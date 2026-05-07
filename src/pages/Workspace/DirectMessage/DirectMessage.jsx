import { Loader2Icon, TriangleAlertIcon } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { ChannelHeader } from '@/components/molecules/Channel/ChannelHeader';
import { ChatInput } from '@/components/molecules/ChatInput/ChatInput';
import { Message } from '@/components/molecules/Message/Message';
import { TypingIndicator } from '@/components/molecules/TypingIndicator/TypingIndicator';
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace';
import { useAuth } from '@/hooks/context/useAuth';
import { useGetDirectMessages } from '@/hooks/apis/direct-messages/useGetDirectMessages';
import { useSendDirectMessage } from '@/hooks/apis/direct-messages/useSendDirectMessage';
import { getPreginedUrl, uploadImageToAWSpresignedUrl } from '@/apis/s3';
import { useSocket } from '@/hooks/context/useSocket';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

export const DirectMessage = () => {

    const { workspaceId: routeWorkspaceId, memberId } = useParams();
    const { currentWorkspace } = useCurrentWorkspace();
    const { auth } = useAuth();
    const { socket } = useSocket();
    const queryClient = useQueryClient();
    const workspaceId = routeWorkspaceId || currentWorkspace?._id;

    const {
        messages,
        isFetching,
        isError,
        error
    } = useGetDirectMessages({
        workspaceId,
        memberId
    });

    const { sendDirectMessage } = useSendDirectMessage();

    const messageContainerListRef = useRef(null);

    const addMessageToCache = useCallback((message) => {
        if (!message?._id || !workspaceId || !memberId) return;

        queryClient.setQueryData(
            ['directMessages', workspaceId, memberId, 1, 20],
            (prev = []) => {
                if (prev.some((item) => item._id === message._id)) return prev;
                return [message, ...prev];
            }
        );
    }, [memberId, queryClient, workspaceId]);

    useEffect(() => {
        if (!socket || !workspaceId || !memberId || !auth?.user?._id) return;

        socket.emit('JoinDirectMessage', {
            workspaceId,
            memberId,
            currentUserId: auth.user._id
        });

        const handleDirectMessageReceived = (message) => {
            const senderId = String(message?.senderId?._id || message?.senderId || '');
            const recipientId = String(message?.recipientId?._id || message?.recipientId || '');
            const currentUserId = String(auth.user._id);
            const messageWorkspaceId = String(message?.workspaceId || '');
            const isCurrentConversation =
                messageWorkspaceId === String(workspaceId) &&
                (
                    (senderId === currentUserId && recipientId === String(memberId)) ||
                    (senderId === String(memberId) && recipientId === currentUserId)
                );

            if (!isCurrentConversation) return;

            addMessageToCache(message);
        };

        socket.on('NewDirectMessageReceived', handleDirectMessageReceived);

        return () => {
            socket.off('NewDirectMessageReceived', handleDirectMessageReceived);
        };
    }, [addMessageToCache, auth?.user?._id, memberId, socket, workspaceId]);

    useEffect(() => {
        if(messageContainerListRef.current) {
            messageContainerListRef.current.scrollTop = messageContainerListRef.current.scrollHeight;
        }
    }, [messages]);

    if (!workspaceId || !memberId) {
        return (
            <div className='h-full flex-1 flex items-center justify-center text-sm text-muted-foreground'>
                Loading workspace conversation...
            </div>
        );
    }

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
                <span className='text-sm text-muted-foreground'>
                    {getApiErrorMessage(error, 'Conversation could not be opened.')}
                </span>
            </div>
        );
    }

    return (
        <div className='flex flex-col h-full'>
            <ChannelHeader name={'Direct message'} />

            <div
                ref={messageContainerListRef}
                className='flex-1 overflow-y-auto p-5 gap-y-2'
            >
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                        You don&apos;t have any messages in this conversation yet.
                    </div>
                ) : (
                    [...messages].reverse().map((message) => (
                        <Message
                            key={message._id}
                            messageId={message._id}
                            author={message.senderId}
                            authorId={message.senderId?._id}
                            body={message.body}
                            authorName={message.senderId?.username}
                            createdAt={message.createdAt}
                            image={message.image}
                        />
                    ))
                )}
            </div>

            <TypingIndicator />
            <ChatInput
                onSubmit={async ({ body, image }) => {
                    if (!body && !image) return;
                    if (!workspaceId || !memberId) return;

                    let fileUrl = null;
                    if (image) {
                        try {
                            const preSignedUrl = await queryClient.fetchQuery({
                                queryKey: ['getPresignedUrl'],
                                queryFn: () => getPreginedUrl({ token: auth?.token }),
                            });

                            await uploadImageToAWSpresignedUrl({
                                url: preSignedUrl,
                                file: image
                            });
                            fileUrl = preSignedUrl.split('?')[0];
                        } catch (error) {
                            console.error('Failed to upload image:', error);
                            // Decide if you want to abort message send on image failure
                            return;
                        }
                    }

                    if (socket?.connected && auth?.user?._id) {
                        try {
                            const socketMessage = await new Promise((resolve, reject) => {
                                const timeoutId = window.setTimeout(() => {
                                    reject(new Error('Direct message socket timed out'));
                                }, 5000);

                                socket.emit('NewDirectMessage', {
                                    workspaceId,
                                    memberId,
                                    senderId: auth.user._id,
                                    body,
                                    image: fileUrl
                                }, (response) => {
                                    window.clearTimeout(timeoutId);

                                    if (response?.success) {
                                        resolve(response.data);
                                        return;
                                    }
                                    reject(new Error(response?.message || 'Failed to send direct message'));
                                });
                            });

                            addMessageToCache(socketMessage);
                            return;
                        } catch (error) {
                            console.error('Direct message socket send failed, falling back to HTTP:', error);
                        }
                    }

                    const httpMessage = await sendDirectMessage({
                        workspaceId,
                        memberId,
                        body,
                        image: fileUrl
                    });
                    addMessageToCache(httpMessage);
                }}
            />
        </div>
    );
};
