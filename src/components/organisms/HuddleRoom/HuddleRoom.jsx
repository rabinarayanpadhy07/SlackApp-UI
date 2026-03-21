import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff, User, Maximize2, Minimize2 } from 'lucide-react';

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
            className={`w-full h-full object-cover rounded-xl border border-slate-700/30 bg-black ${isLocal ? 'scale-x-[-1]' : ''}`}
        />
    );
};

export const HuddleRoom = ({ 
    localStream, 
    remoteStreams, 
    isAudioEnabled, 
    isVideoEnabled, 
    isSharingScreen, 
    toggleAudio, 
    toggleVideo, 
    toggleScreenShare, 
    stopHuddle,
    isExpanded,
    toggleExpand
}) => {
    const remotePeers = Object.values(remoteStreams);

    return (
        <div className="flex flex-col h-full w-full relative bg-[#09090b] overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_8px_40px_-5px_rgba(0,0,0,0.8)]">
            
            {/* Ambient Top Gradient Header */}
            <div className="absolute top-0 left-0 w-full p-3 z-10 flex justify-between items-center bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-xl px-2.5 py-1 rounded-full border border-white/10">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    </span>
                    <span className="text-[10px] font-semibold tracking-widest text-zinc-100 uppercase">Huddle Live</span>
                </div>
                <div className="flex items-center gap-2 pointer-events-auto">
                    <div className="text-[10px] font-medium text-zinc-300 bg-black/30 backdrop-blur-xl px-2.5 py-1 rounded-full border border-white/10 hidden sm:block">
                        {remotePeers.length + 1} {remotePeers.length === 0 ? 'Member' : 'Members'}
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={toggleExpand}
                        className="h-6 w-6 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 text-zinc-300 hover:text-white hover:bg-white/20 transition-all hover:scale-110"
                    >
                        {isExpanded ? <Minimize2 className="size-3" /> : <Maximize2 className="size-3" />}
                    </Button>
                </div>
            </div>

            {/* Video Streams Grid */}
            <div className="flex-1 w-full h-full p-2 pt-12 pb-16 bg-gradient-to-br from-zinc-900 via-[#0a0a0c] to-black">
                <div className="w-full h-full grid gap-2" 
                     style={{ 
                         gridTemplateColumns: remotePeers.length === 0 ? '1fr' : 'repeat(auto-fit, minmax(140px, 1fr))',
                         gridTemplateRows: remotePeers.length > 1 ? '1fr 1fr' : '1fr'
                     }}>
                    
                    {/* Local Stream View */}
                    <div className="relative rounded-[14px] overflow-hidden border border-white/5 bg-zinc-900 shadow-xl group flex items-center justify-center transition-all duration-300 ease-out hover:ring-1 hover:ring-zinc-700">
                        {localStream && <VideoStream stream={localStream} isLocal={!isSharingScreen} />}
                        
                        {/* Stream Watermark label */}
                        <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-medium text-white/90 border border-white/5">
                            You {isSharingScreen && <span className="text-sky-400 ml-1">(Screen)</span>}
                        </div>
                    </div>

                    {/* Remote Peers View */}
                    {remotePeers.map((peer, idx) => (
                        <div key={idx} className="relative rounded-[14px] overflow-hidden border border-white/5 bg-zinc-900 shadow-xl group flex items-center justify-center transition-all duration-300 ease-out hover:ring-1 hover:ring-zinc-700">
                            {peer.stream ? (
                                <VideoStream stream={peer.stream} isLocal={false} />
                            ) : (
                                <div className="h-full w-full flex flex-col items-center justify-center bg-zinc-800/50">
                                    <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 shadow-inner">
                                        <User className="size-5 text-zinc-500" />
                                    </div>
                                </div>
                            )}
                            <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-medium text-white/90 border border-white/5">
                                {peer.user?.username || 'Guest'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Glass Control Dock */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#18181b]/70 px-3 py-1.5 rounded-full border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-20 backdrop-blur-2xl transition-transform hover:scale-105 duration-300">
                
                {/* Audio Toggle */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleAudio}
                    className={`rounded-full h-8 w-8 transition-colors duration-200 ${
                        !isAudioEnabled 
                        ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 hover:text-rose-300' 
                        : 'bg-white/5 text-zinc-300 hover:text-white hover:bg-white/15'
                    }`}
                >
                    {isAudioEnabled ? <Mic className="size-4" /> : <MicOff className="size-4" />}
                </Button>
                
                {/* Video Toggle */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleVideo}
                    className={`rounded-full h-8 w-8 transition-colors duration-200 ${
                        !isVideoEnabled 
                        ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 hover:text-rose-300' 
                        : 'bg-white/5 text-zinc-300 hover:text-white hover:bg-white/15'
                    }`}
                >
                    {isVideoEnabled ? <Video className="size-4" /> : <VideoOff className="size-4" />}
                </Button>

                <div className="h-5 w-[1px] bg-zinc-700/80 mx-0.5 rounded-full" />

                {/* Share Toggle */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleScreenShare}
                    className={`rounded-full h-8 w-8 transition-colors duration-200 ${
                        isSharingScreen 
                        ? 'bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]' 
                        : 'bg-white/5 text-zinc-300 hover:text-white hover:bg-white/15'
                    }`}
                >
                    <MonitorUp className="size-4" />
                </Button>

                {/* Hang Up */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={stopHuddle}
                    className="rounded-full h-8 w-8 bg-rose-500 text-white hover:bg-rose-600 shadow-[0_4px_14px_0_rgba(225,29,72,0.39)] ml-1 transition-all duration-200 hover:scale-110"
                >
                    <PhoneOff className="size-4" />
                </Button>
            </div>
        </div>
    );
};
