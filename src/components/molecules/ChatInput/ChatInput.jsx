import { useRef } from 'react';
import { getPreginedUrl, uploadImageToAWSpresignedUrl } from '@/apis/s3';
import { Editor } from '@/components/atoms/Editor/Edtior';
import { useAuth } from '@/hooks/context/useAuth';
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace';
import { useSocket } from '@/hooks/context/useSocket';
import { useQueryClient } from '@tanstack/react-query';

export const ChatInput = ({ onSubmit, seedValue }) => {

    const { socket, currentChannel } = useSocket();
    const { auth } = useAuth();
    const { currentWorkspace } = useCurrentWorkspace();
    const queryClient = useQueryClient();
    const typingTimeoutRef = useRef(null);

    function handleTextChange() {
        if (!socket || !currentChannel || !auth?.user?.username) return;

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        } else {
            socket.emit('typing_start', {
                channelId: currentChannel,
                username: auth.user.username
            });
        }

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('typing_stop', {
                channelId: currentChannel,
                username: auth.user.username
            });
            typingTimeoutRef.current = null;
        }, 2000);
    }

    async function handleSubmit(payload) {
        if (onSubmit) {
            await onSubmit(payload);
            return;
        }

        const { body, image } = payload;
        console.log(body, image);
        let fileUrl = null;
        if(image) {
            const preSignedUrl = await queryClient.fetchQuery({
                queryKey: ['getPresignedUrl'],
                queryFn: () => getPreginedUrl({ token: auth?.token }),
            });

            console.log('Presigned url', preSignedUrl);

            const responseAws = await uploadImageToAWSpresignedUrl({
                url: preSignedUrl,
                file: image
            });
            console.log("file upload success", responseAws);
            fileUrl = preSignedUrl.split('?')[0];
        }
        socket?.emit('NewMessage', {
            channelId: currentChannel,
            body,
            image: fileUrl,
            senderId: auth?.user?._id,
            workspaceId: currentWorkspace?._id,
            mentions: payload.mentions || []
        }, (data) => {
            console.log('Message sent', data);
        });
    }

    return (
        <div
            className="px-5 w-full"
        >
            <Editor 
                placeholder="Type a message..."
                onSubmit={handleSubmit}
                onTextChange={handleTextChange}
                onCancel={() => {}}
                disabled={false}
                defaultValue=""
                seedValue={seedValue}
                workspaceMembers={currentWorkspace?.members || []}
                workspaceChannels={currentWorkspace?.channels || []}
            />

            
        </div>
    );
};
