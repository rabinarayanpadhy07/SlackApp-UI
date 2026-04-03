import { useEffect, useRef } from 'react';
import {
    Captions,
    FileText,
    Loader2,
    Maximize2,
    Mic,
    MicOff,
    Minimize2,
    MonitorUp,
    PhoneOff,
    Sparkles,
    User,
    Video,
    VideoOff
} from 'lucide-react';

import { Button } from '@/components/ui/button';

const VideoStream = ({ stream, isLocal }) => {
    const videoRef = useRef();

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isLocal}
            className={`h-full w-full rounded-xl border border-slate-700/30 bg-black object-cover ${isLocal ? 'scale-x-[-1]' : ''}`}
        />
    );
};

export const HuddleRoom = ({
    localStream,
    remoteStreams,
    transcriptSegments,
    latestSummary,
    isAudioEnabled,
    isVideoEnabled,
    isSharingScreen,
    isCaptionsEnabled,
    isCaptionsSupported,
    isSummarizing,
    hasAiAccess,
    isAiEnabledForSession,
    toggleAudio,
    toggleVideo,
    toggleCaptions,
    toggleScreenShare,
    stopHuddle,
    requestSummary,
    isExpanded,
    toggleExpand
}) => {
    const remotePeers = Object.values(remoteStreams);
    const transcriptPreview = transcriptSegments.slice(-4).reverse();
    const sidePanelVisible = isExpanded;

    return (
        <div className="relative flex h-full w-full overflow-hidden rounded-2xl bg-[#09090b] ring-1 ring-white/10 shadow-[0_8px_40px_-5px_rgba(0,0,0,0.8)]">
            <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent p-3 pointer-events-none">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 backdrop-blur-xl">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-100">Huddle Live</span>
                </div>
                <div className="pointer-events-auto flex items-center gap-2">
                    <div className="hidden rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[10px] font-medium text-zinc-300 backdrop-blur-xl sm:block">
                        {remotePeers.length + 1} {remotePeers.length === 0 ? 'Member' : 'Members'}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleExpand}
                        className="h-6 w-6 rounded-full border border-white/10 bg-black/30 text-zinc-300 backdrop-blur-xl transition-all hover:scale-110 hover:bg-white/20 hover:text-white"
                    >
                        {isExpanded ? <Minimize2 className="size-3" /> : <Maximize2 className="size-3" />}
                    </Button>
                </div>
            </div>

            <div className={`flex h-full w-full ${sidePanelVisible ? 'flex-col lg:flex-row' : 'flex-col'}`}>
                <div className="flex-1 bg-gradient-to-br from-zinc-900 via-[#0a0a0c] to-black p-2 pb-16 pt-12">
                    <div
                        className="grid h-full w-full gap-2"
                        style={{
                            gridTemplateColumns: remotePeers.length === 0 ? '1fr' : 'repeat(auto-fit, minmax(140px, 1fr))',
                            gridTemplateRows: remotePeers.length > 1 ? '1fr 1fr' : '1fr'
                        }}
                    >
                        <div className="group relative flex items-center justify-center overflow-hidden rounded-[14px] border border-white/5 bg-zinc-900 shadow-xl transition-all duration-300 ease-out hover:ring-1 hover:ring-zinc-700">
                            {localStream && <VideoStream stream={localStream} isLocal={!isSharingScreen} />}
                            <div className="absolute bottom-2 left-2 rounded-md border border-white/5 bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-md">
                                You {isSharingScreen && <span className="ml-1 text-sky-400">(Screen)</span>}
                            </div>
                        </div>

                        {remotePeers.map((peer, idx) => (
                            <div
                                key={idx}
                                className="group relative flex items-center justify-center overflow-hidden rounded-[14px] border border-white/5 bg-zinc-900 shadow-xl transition-all duration-300 ease-out hover:ring-1 hover:ring-zinc-700"
                            >
                                {peer.stream ? (
                                    <VideoStream stream={peer.stream} isLocal={false} />
                                ) : (
                                    <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-800/50">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-zinc-800 shadow-inner">
                                            <User className="size-5 text-zinc-500" />
                                        </div>
                                    </div>
                                )}
                                <div className="absolute bottom-2 left-2 rounded-md border border-white/5 bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-md">
                                    {peer.user?.username || 'Guest'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {sidePanelVisible && hasAiAccess && isAiEnabledForSession && (
                    <div className="w-full border-t border-white/10 bg-zinc-950/95 lg:w-[320px] lg:border-l lg:border-t-0">
                        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Huddle AI</p>
                                <p className="text-sm text-zinc-200">Transcript and smart summary</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={requestSummary}
                                disabled={isSummarizing}
                                className="h-8 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 text-emerald-200 hover:bg-emerald-500/20"
                            >
                                {isSummarizing ? <Loader2 className="mr-2 size-3.5 animate-spin" /> : <Sparkles className="mr-2 size-3.5" />}
                                Summarize
                            </Button>
                        </div>

                        <div className="max-h-[calc(100%-56px)] space-y-4 overflow-y-auto p-4">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                                    <Captions className="size-3.5" />
                                    Live Transcript
                                </div>
                                <p className="mb-3 text-xs text-zinc-500">
                                    {isCaptionsSupported
                                        ? isCaptionsEnabled
                                            ? 'Browser captions are on. Final transcript snippets will appear here.'
                                            : 'Captions are paused for this huddle.'
                                        : 'Live captions need a supported browser such as Chrome or Edge.'}
                                </p>
                                <div className="space-y-2">
                                    {transcriptPreview.length > 0 ? (
                                        transcriptPreview.map((segment) => (
                                            <div key={`${segment.createdAt}-${segment.speakerName}-${segment.text}`} className="rounded-xl border border-white/5 bg-black/20 p-3">
                                                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{segment.speakerName}</p>
                                                <p className="text-sm leading-relaxed text-zinc-200">{segment.text}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-white/10 bg-black/10 p-3 text-sm text-zinc-500">
                                            Start talking and the transcript will collect here.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {latestSummary && (
                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                                        <FileText className="size-3.5" />
                                        Meeting Summary
                                    </div>
                                    <p className="text-sm leading-relaxed text-zinc-200">{latestSummary.overview}</p>
                                    {latestSummary.keyPoints?.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {latestSummary.keyPoints.map((point) => (
                                                <div key={point} className="rounded-xl bg-black/20 px-3 py-2 text-sm text-zinc-300">
                                                    {point}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {latestSummary.actionItems?.length > 0 && (
                                        <div className="mt-3">
                                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-300">Action Items</p>
                                            <div className="space-y-2">
                                                {latestSummary.actionItems.map((item) => (
                                                    <div key={item} className="rounded-xl border border-amber-400/10 bg-amber-500/5 px-3 py-2 text-sm text-amber-100">
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-[#18181b]/70 px-3 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-transform duration-300 hover:scale-105">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleAudio}
                    className={`h-8 w-8 rounded-full transition-colors duration-200 ${
                        !isAudioEnabled
                            ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 hover:text-rose-300'
                            : 'bg-white/5 text-zinc-300 hover:bg-white/15 hover:text-white'
                    }`}
                >
                    {isAudioEnabled ? <Mic className="size-4" /> : <MicOff className="size-4" />}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleVideo}
                    className={`h-8 w-8 rounded-full transition-colors duration-200 ${
                        !isVideoEnabled
                            ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 hover:text-rose-300'
                            : 'bg-white/5 text-zinc-300 hover:bg-white/15 hover:text-white'
                    }`}
                >
                    {isVideoEnabled ? <Video className="size-4" /> : <VideoOff className="size-4" />}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleCaptions}
                    disabled={!hasAiAccess || !isAiEnabledForSession || !isCaptionsSupported}
                    className={`h-8 w-8 rounded-full transition-colors duration-200 ${
                        hasAiAccess && isAiEnabledForSession && isCaptionsEnabled && isCaptionsSupported
                            ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                            : 'bg-white/5 text-zinc-300 hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-40'
                    }`}
                >
                    <Captions className="size-4" />
                </Button>

                <div className="mx-0.5 h-5 w-[1px] rounded-full bg-zinc-700/80" />

                {hasAiAccess && isAiEnabledForSession && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={requestSummary}
                        disabled={isSummarizing}
                        className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-300 transition-colors duration-200 hover:bg-emerald-500/20 hover:text-emerald-200"
                    >
                        {isSummarizing ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                    </Button>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleScreenShare}
                    className={`h-8 w-8 rounded-full transition-colors duration-200 ${
                        isSharingScreen
                            ? 'bg-sky-500/20 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.2)] hover:bg-sky-500/30'
                            : 'bg-white/5 text-zinc-300 hover:bg-white/15 hover:text-white'
                    }`}
                >
                    <MonitorUp className="size-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={stopHuddle}
                    className="ml-1 h-8 w-8 rounded-full bg-rose-500 text-white shadow-[0_4px_14px_0_rgba(225,29,72,0.39)] transition-all duration-200 hover:scale-110 hover:bg-rose-600"
                >
                    <PhoneOff className="size-4" />
                </Button>
            </div>
        </div>
    );
};
