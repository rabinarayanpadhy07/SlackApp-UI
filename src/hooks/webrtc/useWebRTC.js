import { useCallback, useEffect, useRef, useState } from 'react';

import { useAuth } from '../context/useAuth';
import { useSocket } from '../context/useSocket';

const getSpeechRecognition = () => {
    if (typeof window === 'undefined') return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' }
    ]
};

export const useWebRTC = (channelId, hasAiAccess = false) => {
    const { socket } = useSocket();
    const { auth } = useAuth();

    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState({});
    const [transcriptSegments, setTranscriptSegments] = useState([]);
    const [latestSummary, setLatestSummary] = useState(null);
    const [isSharingScreen, setIsSharingScreen] = useState(false);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isHuddleActive, setIsHuddleActive] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isCaptionsEnabled, setIsCaptionsEnabled] = useState(false);
    const [isAiEnabledForSession, setIsAiEnabledForSession] = useState(false);

    const peersRef = useRef({});
    const localStreamRef = useRef(null);
    const transcriptSegmentsRef = useRef([]);
    const recognitionRef = useRef(null);
    const shouldRestartRecognitionRef = useRef(false);

    const isCaptionsSupported = Boolean(getSpeechRecognition());

    useEffect(() => {
        transcriptSegmentsRef.current = transcriptSegments;
    }, [transcriptSegments]);

    const stopSpeechRecognition = useCallback(() => {
        shouldRestartRecognitionRef.current = false;

        if (recognitionRef.current) {
            recognitionRef.current.onresult = null;
            recognitionRef.current.onend = null;
            recognitionRef.current.onerror = null;
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
    }, []);

    const startSpeechRecognition = useCallback(() => {
        const SpeechRecognition = getSpeechRecognition();

        if (!hasAiAccess || !isAiEnabledForSession || !SpeechRecognition || !socket || !auth?.user?._id || !auth?.token) return;

        stopSpeechRecognition();

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let finalTranscript = '';

            for (let index = event.resultIndex; index < event.results.length; index += 1) {
                const result = event.results[index];
                if (result.isFinal) {
                    finalTranscript += result[0]?.transcript || '';
                }
            }

            const text = finalTranscript.trim();
            if (!text) return;

            socket.emit('HUDDLE_TRANSCRIPT_SEGMENT', {
                channelId,
                token: auth.token,
                segment: {
                    speakerId: auth.user._id,
                    speakerName: auth.user.username,
                    text,
                    createdAt: new Date().toISOString()
                }
            });
        };

        recognition.onend = () => {
            recognitionRef.current = null;

            if (shouldRestartRecognitionRef.current) {
                startSpeechRecognition();
            }
        };

        recognition.onerror = () => {
            recognitionRef.current = null;
        };

        shouldRestartRecognitionRef.current = true;
        recognitionRef.current = recognition;

        try {
            recognition.start();
        } catch {
            recognitionRef.current = null;
        }
    }, [auth?.token, auth?.user?._id, auth?.user?.username, channelId, hasAiAccess, isAiEnabledForSession, socket, stopSpeechRecognition]);

    const requestSummary = useCallback(async () => {
        if (!socket || !hasAiAccess || !isAiEnabledForSession || !auth?.token) return null;

        setIsSummarizing(true);

        return new Promise((resolve) => {
            socket.emit('GENERATE_HUDDLE_SUMMARY', { channelId, token: auth.token }, (response) => {
                setIsSummarizing(false);

                if (response?.success && response.data) {
                    setLatestSummary(response.data);
                    resolve(response.data);
                    return;
                }

                resolve(null);
            });
        });
    }, [auth?.token, channelId, hasAiAccess, isAiEnabledForSession, socket]);

    const startHuddle = useCallback(async ({ enableAi = false } = {}) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

            stream.getAudioTracks().forEach((track) => {
                track.enabled = isAudioEnabled;
            });
            stream.getVideoTracks().forEach((track) => {
                track.enabled = isVideoEnabled;
            });

            setTranscriptSegments([]);
            setLatestSummary(null);
            setIsAiEnabledForSession(Boolean(hasAiAccess && enableAi));
            setIsCaptionsEnabled(Boolean(hasAiAccess && enableAi));
            setLocalStream(stream);
            localStreamRef.current = stream;

            setIsHuddleActive(true);
            socket.emit('join-huddle', { channelId, user: auth?.user });
        } catch (error) {
            console.error('Error accessing hardware media devices', error);
        }
    }, [auth?.user, channelId, hasAiAccess, isAudioEnabled, isVideoEnabled, socket]);

    const stopHuddle = useCallback(async () => {
        if (transcriptSegmentsRef.current.length > 0) {
            await requestSummary();
        }

        stopSpeechRecognition();
        socket?.emit('leave-huddle', { channelId });
        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
        localStreamRef.current = null;

        Object.values(peersRef.current).forEach((peer) => peer.close());
        peersRef.current = {};
        setRemoteStreams({});
        setIsHuddleActive(false);
        setIsSharingScreen(false);
        setIsCaptionsEnabled(false);
        setIsAiEnabledForSession(false);
    }, [channelId, requestSummary, socket, stopSpeechRecognition]);

    const createPeer = useCallback((targetSocketId, user) => {
        const peer = new RTCPeerConnection(ICE_SERVERS);

        localStreamRef.current?.getTracks().forEach((track) => {
            peer.addTrack(track, localStreamRef.current);
        });

        peer.ontrack = (event) => {
            setRemoteStreams((prev) => ({
                ...prev,
                [targetSocketId]: { stream: event.streams[0], user }
            }));
        };

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('huddle-ice-candidate', {
                    targetSocketId,
                    candidate: event.candidate
                });
            }
        };

        peersRef.current[targetSocketId] = peer;
        return peer;
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        const handleUserJoined = async ({ socketId, user }) => {
            if (!isHuddleActive || !localStreamRef.current || peersRef.current[socketId]) return;
            const peer = createPeer(socketId, user);
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            socket.emit('huddle-offer', { targetSocketId: socketId, offer, user: auth?.user });
        };

        const handleOffer = async ({ fromSocketId, user, offer }) => {
            if (!localStreamRef.current) return;
            const peer = createPeer(fromSocketId, user);
            await peer.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            socket.emit('huddle-answer', { targetSocketId: fromSocketId, answer });
        };

        const handleAnswer = async ({ fromSocketId, answer }) => {
            const peer = peersRef.current[fromSocketId];
            if (peer) await peer.setRemoteDescription(new RTCSessionDescription(answer));
        };

        const handleIceCandidate = async ({ fromSocketId, candidate }) => {
            const peer = peersRef.current[fromSocketId];
            if (peer) await peer.addIceCandidate(new RTCIceCandidate(candidate));
        };

        const handleUserLeft = ({ socketId }) => {
            if (peersRef.current[socketId]) {
                peersRef.current[socketId].close();
                delete peersRef.current[socketId];
                setRemoteStreams((prev) => {
                    const updated = { ...prev };
                    delete updated[socketId];
                    return updated;
                });
            }
        };

        socket.on('user-joined-huddle', handleUserJoined);
        socket.on('huddle-offer', handleOffer);
        socket.on('huddle-answer', handleAnswer);
        socket.on('huddle-ice-candidate', handleIceCandidate);
        socket.on('user-left-huddle', handleUserLeft);

        return () => {
            socket.off('user-joined-huddle', handleUserJoined);
            socket.off('huddle-offer', handleOffer);
            socket.off('huddle-answer', handleAnswer);
            socket.off('huddle-ice-candidate', handleIceCandidate);
            socket.off('user-left-huddle', handleUserLeft);
        };
    }, [socket, isHuddleActive, auth?.user, channelId, createPeer]);

    useEffect(() => {
        if (!socket) return;

        const handleSessionSync = (data) => {
            if (data?.channelId !== channelId) return;
            setTranscriptSegments(data.transcriptSegments || []);
            setLatestSummary(data.latestSummary || null);
        };

        const handleTranscriptUpdated = (data) => {
            if (data?.channelId !== channelId) return;
            setTranscriptSegments(data.transcriptSegments || []);
        };

        const handleSummaryReady = (data) => {
            if (data?.channelId !== channelId) return;
            setLatestSummary(data.summary || null);
        };

        socket.on('HUDDLE_SESSION_SYNC', handleSessionSync);
        socket.on('HUDDLE_TRANSCRIPT_UPDATED', handleTranscriptUpdated);
        socket.on('HUDDLE_SUMMARY_READY', handleSummaryReady);

        return () => {
            socket.off('HUDDLE_SESSION_SYNC', handleSessionSync);
            socket.off('HUDDLE_TRANSCRIPT_UPDATED', handleTranscriptUpdated);
            socket.off('HUDDLE_SUMMARY_READY', handleSummaryReady);
        };
    }, [socket, channelId]);

    useEffect(() => {
        if (!hasAiAccess || !isAiEnabledForSession || !isHuddleActive || !isCaptionsEnabled || !isCaptionsSupported) {
            stopSpeechRecognition();
            return undefined;
        }

        startSpeechRecognition();

        return () => {
            stopSpeechRecognition();
        };
    }, [auth?.token, auth?.user?._id, channelId, hasAiAccess, isAiEnabledForSession, isCaptionsEnabled, isCaptionsSupported, isHuddleActive, socket, startSpeechRecognition, stopSpeechRecognition]);

    useEffect(() => () => {
        stopSpeechRecognition();
    }, [stopSpeechRecognition]);

    const toggleAudio = () => {
        setIsAudioEnabled((prev) => {
            const newState = !prev;
            if (localStreamRef.current) {
                localStreamRef.current.getAudioTracks().forEach((track) => {
                    track.enabled = newState;
                });
            }
            return newState;
        });
    };

    const toggleVideo = () => {
        setIsVideoEnabled((prev) => {
            const newState = !prev;
            if (localStreamRef.current) {
                localStreamRef.current.getVideoTracks().forEach((track) => {
                    track.enabled = newState;
                });
            }
            return newState;
        });
    };

    const toggleCaptions = () => {
        if (!isCaptionsSupported || !isAiEnabledForSession) return;
        setIsCaptionsEnabled((prev) => !prev);
    };

    const toggleScreenShare = async () => {
        try {
            if (isSharingScreen) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: isAudioEnabled });
                const videoTrack = stream.getVideoTracks()[0];
                videoTrack.enabled = isVideoEnabled;

                const oldVideoTrack = localStreamRef.current.getVideoTracks()[0];
                localStreamRef.current.removeTrack(oldVideoTrack);
                oldVideoTrack.stop();
                localStreamRef.current.addTrack(videoTrack);

                Object.values(peersRef.current).forEach((peer) => {
                    const sender = peer.getSenders().find((currentSender) => currentSender.track.kind === 'video');
                    if (sender) sender.replaceTrack(videoTrack);
                });

                setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
                setIsSharingScreen(false);
            } else {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                const screenTrack = screenStream.getVideoTracks()[0];

                screenTrack.onended = () => {
                    toggleScreenShare();
                };

                const oldVideoTrack = localStreamRef.current.getVideoTracks()[0];
                localStreamRef.current.removeTrack(oldVideoTrack);
                oldVideoTrack.stop();
                localStreamRef.current.addTrack(screenTrack);

                Object.values(peersRef.current).forEach((peer) => {
                    const sender = peer.getSenders().find((currentSender) => currentSender.track.kind === 'video');
                    if (sender) sender.replaceTrack(screenTrack);
                });

                setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
                setIsSharingScreen(true);
            }
        } catch (error) {
            console.error('Screen transition failed', error);
        }
    };

    return {
        localStream,
        remoteStreams,
        transcriptSegments,
        latestSummary,
        isHuddleActive,
        isSharingScreen,
        isAudioEnabled,
        isVideoEnabled,
        isCaptionsEnabled,
        isCaptionsSupported,
        isSummarizing,
        hasAiAccess,
        isAiEnabledForSession,
        startHuddle,
        stopHuddle,
        requestSummary,
        toggleAudio,
        toggleVideo,
        toggleCaptions,
        toggleScreenShare
    };
};
