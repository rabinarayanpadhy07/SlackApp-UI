import { XIcon, Loader2Icon, TriangleAlertIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useState } from 'react';

import { useThread } from '@/context/ThreadContext';
import { Button } from '@/components/ui/button';
import { useGetThreadMessages } from '@/hooks/apis/threads/useGetThreadMessages';
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace';
import { Message } from '@/components/molecules/Message/Message';
import { ChatInput } from '@/components/molecules/ChatInput/ChatInput';
import { useAuth } from '@/hooks/context/useAuth';
import { useSocket } from '@/hooks/context/useSocket';
import { getPreginedUrl, uploadImageToAWSpresignedUrl } from '@/apis/s3';
import { buildEditorDraftFromText } from '@/utils/aiDraft';

export const ThreadPanel = () => {
    const { activeThreadMessageId, closeThread } = useThread();
    const { currentWorkspace } = useCurrentWorkspace();
    const { workspaceId } = useParams();
    const { auth } = useAuth();
    const { socket, currentChannel } = useSocket();
    const queryClient = useQueryClient();
    const [replySeedValue, setReplySeedValue] = useState('');
    const hasAiAccess = auth?.user?.plan === 'Paid';

    const { messages, isFetching, isError } = useGetThreadMessages({
        workspaceId: currentWorkspace?._id || workspaceId,
        threadId: activeThreadMessageId
    });

    useEffect(() => {
        if (!socket || !activeThreadMessageId) return;

        const handleNewMessage = (data) => {
            if (data.parentMessage === activeThreadMessageId) {
                queryClient.setQueryData(['getThreadMessages', activeThreadMessageId], (old) => {
                    if (!old) return [data];
                    return [...old, data];
                });
            }
        };

        socket.on('NewMessageReceived', handleNewMessage);
        return () => {
            socket.off('NewMessageReceived', handleNewMessage);
        };
    }, [socket, activeThreadMessageId, queryClient]);

    const handleSubmit = async (payload) => {
        const { body, image } = payload;
        let fileUrl = null;
        if (image) {
            const preSignedUrl = await queryClient.fetchQuery({
                queryKey: ['getPresignedUrl'],
                queryFn: () => getPreginedUrl({ token: auth?.token }),
            });

            await uploadImageToAWSpresignedUrl({
                url: preSignedUrl,
                file: image
            });
            fileUrl = preSignedUrl.split('?')[0];
        }

        socket?.emit('NewMessage', {
            channelId: currentChannel,
            body,
            image: fileUrl,
            senderId: auth?.user?._id,
            workspaceId: currentWorkspace?._id,
            parentMessage: activeThreadMessageId
        }, (data) => {
            console.log('Thread reply sent', data);
            // Invalidate the thread messages query to refresh the list instantly
            queryClient.invalidateQueries(['getThreadMessages', activeThreadMessageId]);
        });
    };

    const handleRequestAiReply = (messageId) => new Promise((resolve) => {
        if (!hasAiAccess || !auth?.token) {
            resolve([]);
            return;
        }

        const messageIndex = messages?.findIndex((message) => message._id === messageId) ?? -1;
        const targetMessage = messageIndex >= 0 ? messages[messageIndex] : null;
        const recentMessages = messageIndex >= 0
            ? messages.slice(Math.max(0, messageIndex - 4), messageIndex).map((message) => ({
                body: message.body,
                senderName: message.senderId?.username
            }))
            : [];

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

    if (!activeThreadMessageId) return null;

    return (
        <div className="flex flex-col h-full bg-white border-l shadow-sm w-full">
            {/* Header */}
            <div className="flex justify-between items-center px-4 h-12 border-b bg-gray-50/80">
                <span className="font-bold text-sm">Thread</span>
                <Button variant="ghost" size="iconSm" onClick={closeThread}>
                    <XIcon className="h-4 w-4" />
                </Button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-y-2">
                {isFetching && (
                    <div className='flex-1 flex items-center justify-center'>
                        <Loader2Icon className='size-5 animate-spin text-muted-foreground' />
                    </div>
                )}

                {isError && (
                    <div className='flex flex-col items-center justify-center flex-1 h-full gap-y-2'>
                        <TriangleAlertIcon className='size-6 text-muted-foreground' />
                        <span className='text-sm text-muted-foreground'>Failed to load thread</span>
                    </div>
                )}

                {!isFetching && !isError && messages?.map((message) => (
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
                        onRequestAiReply={handleRequestAiReply}
                        onUseAiReply={handleUseAiReply}
                        showAiReplyAction={hasAiAccess}
                        // Disable replying to a reply to keep threads 1-level deep
                        isReply={true} 
                        isEdited={message.isEdited}
                        deletedAt={message.deletedAt}
                        isPinned={message.isPinned}
                        stars={message.stars}
                    />
                ))}

                {!isFetching && !isError && messages?.length === 0 && (
                    <div className="flex flex-col items-center justify-center flex-1 text-gray-500 text-sm mt-10">
                        No replies yet. Start the conversation!
                    </div>
                )}
            </div>

            {/* Thread Editor */}
            <div className="p-4 border-t bg-gray-50/50">
                <ChatInput onSubmit={handleSubmit} seedValue={replySeedValue} />
            </div>
        </div>
    );
};
