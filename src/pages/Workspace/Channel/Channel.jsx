import { Loader2Icon, TriangleAlertIcon, Pin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ChannelHeader } from '@/components/molecules/Channel/ChannelHeader';
import { ChatInput } from '@/components/molecules/ChatInput/ChatInput';
import { Message } from '@/components/molecules/Message/Message';
import { TypingIndicator } from '@/components/molecules/TypingIndicator/TypingIndicator';
import { HuddleRoom } from '@/components/organisms/HuddleRoom/HuddleRoom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetChannelById } from '@/hooks/apis/channels/useGetChannelById';
import { useGetChannelMessages } from '@/hooks/apis/channels/useGetChannelMessages';
import { useChannelMessages } from '@/hooks/context/useChannelMessages';
import { useSocket } from '@/hooks/context/useSocket';
import { useMarkChannelAsRead } from '@/hooks/apis/read-receipts/useMarkChannelAsRead';
import { useWebRTC } from '@/hooks/webrtc/useWebRTC';
import { buildEditorDraftFromText } from '@/utils/aiDraft';
import { useAuth } from '@/hooks/context/useAuth';

export const Channel = () => {
    // Standard UI Contexts bounds mapping deeply natively 
    const { workspaceId, channelId } = useParams();
    
    const { activeHuddleChannel, joinChannel, socket } = useSocket();
    const [isExpanded, setIsExpanded] = useState(false);
    const [replySeedValue, setReplySeedValue] = useState('');
    const [showHuddleAiPrompt, setShowHuddleAiPrompt] = useState(false);
    const { auth } = useAuth(); // Needed to pass the memberId
    const { channelDetails, isFetching, isError } = useGetChannelById(channelId);
    const { setMessageList, messageList } = useChannelMessages();

    const { messages, isSuccess } = useGetChannelMessages(channelId);
    
    const { markAsRead } = useMarkChannelAsRead();

    const hasAiAccess = channelDetails?.aiAccess ?? auth?.user?.plan === 'Paid';
    const webrtc = useWebRTC(channelId, hasAiAccess);

    const messageContainerListRef = useRef(null);
    const visibleSummary = webrtc.latestSummary || channelDetails?.latestHuddleSummary;

    useEffect(() => {
        if(messageContainerListRef.current) {
            messageContainerListRef.current.scrollTop = messageContainerListRef.current.scrollHeight;
        }
    }, [messageList]);

    useEffect(() => {
        if(!isFetching && !isError) {
            joinChannel(channelId);
            if (workspaceId) {
                markAsRead({ channelId, workspaceId });
            }
        }
    }, [isFetching, isError, joinChannel, channelId, workspaceId, markAsRead]);

    useEffect(() => {
        if(isSuccess ) {
            console.log('Channel Messages fetched');
            setMessageList([...(messages || [])].reverse());
        }
    }, [isSuccess, messages, setMessageList, channelId]);

    useEffect(() => {
        if (channelDetails?.messages?.length) {
            setMessageList([...(channelDetails.messages || [])].reverse());
        }
    }, [channelDetails, setMessageList]);

    const handleReaction = (messageId, emoji) => {
        if (!socket || !auth?.user?._id) return;

        socket.emit('ADD_REACTION', {
            messageId,
            emoji,
            memberId: auth.user._id,
            channelId
        }, (response) => {
            console.log('Reaction response:', response);
        });
    };

    const handleRequestAiReply = (messageId) => new Promise((resolve) => {
        if (!hasAiAccess || !auth?.token) {
            resolve([]);
            return;
        }

        const messageIndex = messageList.findIndex((message) => message._id === messageId);
        const targetMessage = messageList[messageIndex];
        const recentMessages = messageList
            .slice(Math.max(0, messageIndex - 4), messageIndex)
            .map((message) => ({
                body: message.body,
                senderName: message.senderId?.username
            }));

        socket.emit('GENERATE_AI_REPLY', {
            token: auth.token,
            targetMessage: {
                body: targetMessage?.body,
                senderName: targetMessage?.senderId?.username
            },
            recentMessages
        }, (response) => {
            resolve(response?.success ? response.data || [] : []);
        });
    });

    const handleUseAiReply = (text) => {
        setReplySeedValue('');
        window.requestAnimationFrame(() => {
            setReplySeedValue(buildEditorDraftFromText(text));
        });
    };

    const handleStartHuddle = async () => {
        if (!hasAiAccess) {
            await webrtc.startHuddle({ enableAi: false });
            return;
        }

        setShowHuddleAiPrompt(true);
    };

    const handleHuddleAiChoice = async (enableAi) => {
        setShowHuddleAiPrompt(false);
        await webrtc.startHuddle({ enableAi });
    };

    if(isFetching) {
        return (
            <div
                className='h-full flex-1 flex items-center justify-center'
            >
                <Loader2Icon className='size-5 animate-spin text-muted-foreground' />
            </div>
        );
    }

    if(isError) {
        return (
            <div className='h-full flex-1 flex flex-col gap-y-2 items-center justify-center'>
                <TriangleAlertIcon className='size-6 text-muted-foreground' />
                <span className='text-sm text-muted-foreground'>Channel Not found</span>
            </div>
        );
    }

    const pinnedMessages = messageList?.filter(m => m.isPinned && !m.deletedAt) || [];
    const isHuddleLiveInChannel = activeHuddleChannel === channelId;

    return (
        <div className='flex flex-col h-full relative'>
            <Dialog open={showHuddleAiPrompt} onOpenChange={setShowHuddleAiPrompt}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Turn On Huddle AI For This Meeting?</DialogTitle>
                        <DialogDescription>
                            We can capture transcript snippets and generate a summary for this huddle. If you choose not now, the huddle will still start with AI notes off for this meeting.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className='sm:justify-start'>
                        <Button variant="outline" onClick={() => handleHuddleAiChoice(false)}>
                            Start Without AI
                        </Button>
                        <Button onClick={() => handleHuddleAiChoice(true)}>
                            Turn On AI
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ChannelHeader 
                name={channelDetails?.name} 
                channelId={channelId}
                isHuddleActive={webrtc.isHuddleActive}
                startHuddle={handleStartHuddle}
                isHuddleLiveInChannel={isHuddleLiveInChannel}
            />

            {webrtc.isHuddleActive && (
                <div className={`absolute z-50 bg-[#09090b] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden rounded-[20px] border border-white/10 ring-1 ring-white/5 cursor-default transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isExpanded 
                    ? "inset-4 w-auto h-auto rounded-[32px] shadow-[0_0_100px_rgba(0,0,0,0.8)]" 
                    : "bottom-[20px] right-[20px] w-[340px] h-[260px]"
                }`}>
                    <HuddleRoom {...webrtc} isExpanded={isExpanded} toggleExpand={() => setIsExpanded(prev => !prev)} />
                </div>
            )}

            {pinnedMessages.length > 0 && (
                <div className="bg-white border-b px-5 py-2 shadow-[0_2px_4px_rgba(0,0,0,0.02)] z-10 max-h-[20vh] overflow-y-auto w-full">
                    <div className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1 uppercase tracking-wider">
                        <Pin className="h-3 w-3" /> {pinnedMessages.length} Pinned {pinnedMessages.length === 1 ? 'Message' : 'Messages'}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        {pinnedMessages.map((msg) => (
                            <div key={`pin-${msg._id}`} className="text-sm px-3 py-2 bg-yellow-50/80 rounded-md border border-yellow-200/60 flex flex-col gap-0.5 hover:bg-yellow-100/50 transition-colors">
                                <span className="font-semibold text-xs text-slate-800">{msg.senderId?.username}</span>
                                <div className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.body }} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {visibleSummary && !webrtc.isHuddleActive && hasAiAccess && (
                <div className="border-b bg-emerald-50/70 px-5 py-4">
                    <div className="max-w-4xl space-y-3 rounded-2xl border border-emerald-200 bg-white/70 p-4">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">Latest Huddle Summary</p>
                            <p className="mt-1 text-sm text-slate-700">{visibleSummary?.overview}</p>
                        </div>
                        {visibleSummary?.actionItems?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {visibleSummary.actionItems.map((item) => (
                                    <span key={item} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* We need to make sure that below div is scrollable for the messages */}
            <div
                ref={messageContainerListRef}
                className='flex-5 overflow-y-auto p-5 gap-y-2'
            >
                {messageList?.map((message) => {
                    return (
                        <Message 
                            key={message._id} 
                            messageId={message._id}
                            author={message.senderId}
                            authorId={message.senderId?._id}
                            body={message.body} 
                            authorName={message.senderId?.username} 
                            createdAt={message.createdAt} 
                            image={message.image}
                            reactions={message.reactions || []}
                            onAddReaction={handleReaction}
                            onRequestAiReply={handleRequestAiReply}
                            onUseAiReply={handleUseAiReply}
                            showAiReplyAction={hasAiAccess}
                            isEdited={message.isEdited}
                            deletedAt={message.deletedAt}
                            isPinned={message.isPinned}
                            stars={message.stars}
                        />
                    );
                })}   
            </div>         

            
            <div className='flex-1' /> 
            <TypingIndicator />
            <ChatInput seedValue={replySeedValue} />
        </div>
    );
};
