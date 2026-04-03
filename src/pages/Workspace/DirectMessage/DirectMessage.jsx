import { Loader2Icon, TriangleAlertIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { ChannelHeader } from '@/components/molecules/Channel/ChannelHeader';
import { ChatInput } from '@/components/molecules/ChatInput/ChatInput';
import { Message } from '@/components/molecules/Message/Message';
import { TypingIndicator } from '@/components/molecules/TypingIndicator/TypingIndicator';
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace';
import { useAuth } from '@/hooks/context/useAuth';
import { useGetDirectMessages } from '@/hooks/apis/direct-messages/useGetDirectMessages';
import { useSendDirectMessage } from '@/hooks/apis/direct-messages/useSendDirectMessage';
import { getPreginedUrl, uploadImageToAWSpresignedUrl } from '@/apis/s3';
import { useQueryClient } from '@tanstack/react-query';

export const DirectMessage = () => {

    const { workspaceId: routeWorkspaceId, memberId } = useParams();
    const { currentWorkspace } = useCurrentWorkspace();
    const { auth } = useAuth();
    const queryClient = useQueryClient();
    const workspaceId = routeWorkspaceId || currentWorkspace?._id;

    const {
        messages,
        isFetching,
        isError
    } = useGetDirectMessages({
        workspaceId,
        memberId
    });

    const { sendDirectMessage } = useSendDirectMessage();

    const messageContainerListRef = useRef(null);

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
                <span className='text-sm text-muted-foreground'>Conversation not found</span>
            </div>
        );
    }

    return (
        <div className='flex flex-col h-full'>
            <ChannelHeader name={'Direct message'} />

            <div
                ref={messageContainerListRef}
                className='flex-5 overflow-y-auto p-5 gap-y-2'
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
                            authorId={message.senderId?._id}
                            body={message.body}
                            authorImage={message.senderId?.avatar}
                            authorName={message.senderId?.username}
                            createdAt={message.createdAt}
                            image={message.image}
                        />
                    ))
                )}
            </div>

            <div className='flex-1' />
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

                    await sendDirectMessage({
                        workspaceId,
                        memberId,
                        body,
                        image: fileUrl
                    });
                }}
            />
        </div>
    );
};

