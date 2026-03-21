import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/useSocket';
import { useAuth } from '../context/useAuth';

export const useWebRTC = (channelId) => {
    const { socket } = useSocket();
    const { auth } = useAuth();
    
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState({});
    
    const [isSharingScreen, setIsSharingScreen] = useState(false);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isHuddleActive, setIsHuddleActive] = useState(false);
    
    const peersRef = useRef({});
    const localStreamRef = useRef(null);

    const iceServers = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
        ]
    };

    const startHuddle = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            
            // Sync initial state overrides
            stream.getAudioTracks().forEach(track => track.enabled = isAudioEnabled);
            stream.getVideoTracks().forEach(track => track.enabled = isVideoEnabled);
            
            setLocalStream(stream);
            localStreamRef.current = stream;
            
            setIsHuddleActive(true);
            socket.emit('join-huddle', { channelId, user: auth?.user });
        } catch (error) {
            console.error('Error accessing hardware media devices', error);
        }
    };

    const stopHuddle = () => {
        socket?.emit('leave-huddle', { channelId });
        localStreamRef.current?.getTracks().forEach(track => track.stop());
        setLocalStream(null);
        localStreamRef.current = null;
        
        Object.values(peersRef.current).forEach(peer => peer.close());
        peersRef.current = {};
        setRemoteStreams({});
        setIsHuddleActive(false);
        setIsSharingScreen(false);
    };

    const createPeer = (targetSocketId, user) => {
        const peer = new RTCPeerConnection(iceServers);

        // Map existing tracks securely mapped into our new peer sender
        localStreamRef.current?.getTracks().forEach(track => {
            peer.addTrack(track, localStreamRef.current);
        });

        // Resolve incoming streams
        peer.ontrack = (event) => {
            setRemoteStreams(prev => ({
                ...prev,
                [targetSocketId]: { stream: event.streams[0], user }
            }));
        };

        // Network NAT resolution candidates
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
    };

    useEffect(() => {
        if (!socket || !isHuddleActive) return;

        const handleUserJoined = async ({ socketId, user }) => {
            const peer = createPeer(socketId, user);
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            socket.emit('huddle-offer', { targetSocketId: socketId, offer, user: auth?.user });
        };

        const handleOffer = async ({ fromSocketId, user, offer }) => {
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
                setRemoteStreams(prev => {
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
    }, [socket, isHuddleActive]);

    const toggleAudio = () => {
        setIsAudioEnabled(prev => {
            const newState = !prev;
            if (localStreamRef.current) {
                localStreamRef.current.getAudioTracks().forEach(t => t.enabled = newState);
            }
            return newState;
        });
    };

    const toggleVideo = () => {
        setIsVideoEnabled(prev => {
            const newState = !prev;
            if (localStreamRef.current) {
                localStreamRef.current.getVideoTracks().forEach(t => t.enabled = newState);
            }
            return newState;
        });
    };

    const toggleScreenShare = async () => {
        try {
            if (isSharingScreen) {
                // Revert to camera
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: isAudioEnabled });
                const videoTrack = stream.getVideoTracks()[0];
                videoTrack.enabled = isVideoEnabled;

                const oldVideoTrack = localStreamRef.current.getVideoTracks()[0];
                localStreamRef.current.removeTrack(oldVideoTrack);
                oldVideoTrack.stop();
                localStreamRef.current.addTrack(videoTrack);

                Object.values(peersRef.current).forEach(peer => {
                    const sender = peer.getSenders().find(s => s.track.kind === 'video');
                    if (sender) sender.replaceTrack(videoTrack);
                });

                setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
                setIsSharingScreen(false);
            } else {
                // Capture Screen
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                const screenTrack = screenStream.getVideoTracks()[0];

                screenTrack.onended = () => {
                    toggleScreenShare();
                };

                const oldVideoTrack = localStreamRef.current.getVideoTracks()[0];
                localStreamRef.current.removeTrack(oldVideoTrack);
                oldVideoTrack.stop();
                localStreamRef.current.addTrack(screenTrack);

                Object.values(peersRef.current).forEach(peer => {
                    const sender = peer.getSenders().find(s => s.track.kind === 'video');
                    if (sender) sender.replaceTrack(screenTrack);
                });

                setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
                setIsSharingScreen(true);
            }
        } catch (error) {
            console.error("Screen transition failed", error);
        }
    };

    return {
        localStream,
        remoteStreams,
        isHuddleActive,
        isSharingScreen,
        isAudioEnabled,
        isVideoEnabled,
        startHuddle,
        stopHuddle,
        toggleAudio,
        toggleVideo,
        toggleScreenShare
    };
};
