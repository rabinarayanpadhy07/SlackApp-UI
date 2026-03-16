import { useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance from '@/config/axiosConfig';

import { useAuth } from '@/hooks/context/useAuth';

export const useSendDirectMessage = () => {

    const queryClient = useQueryClient();
    const { auth } = useAuth();

    const mutation = useMutation({
        mutationFn: async ({
            workspaceId,
            memberId,
            body,
            image
        }) => {
            const res = await axiosInstance.post(
                `/workspaces/${workspaceId}/members/${memberId}/messages`,
                { body, image },
                { headers: { 'x-access-token': auth?.token } }
            );
            // backend uses a { data, message } envelope
            return res?.data?.data;
        },
        onSuccess: (newMessage, { workspaceId, memberId }) => {
            queryClient.setQueryData(
                ['directMessages', workspaceId, memberId, 1, 20],
                (prev) => (prev ? [newMessage, ...prev] : [newMessage])
            );
        }
    });

    return {
        sendDirectMessage: mutation.mutateAsync,
        isSending: mutation.isPending
    };
};

