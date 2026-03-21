import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/config/axiosConfig';
import { useAuth } from '@/hooks/context/useAuth';

export const useMarkChannelAsRead = () => {
    const { auth } = useAuth();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({ channelId, workspaceId }) => {
            const response = await axiosInstance.put(
                `/channels/${channelId}/read`, 
                { workspaceId },
                { headers: { 'x-access-token': auth?.token } }
            );
            return response?.data?.data;
        },
        onSuccess: (_, variables) => {
            // Update the local unread map instead of refetching the whole thing
            queryClient.setQueryData(['unreadChannels', variables.workspaceId], (oldData) => {
                if (!oldData) return {};
                return {
                    ...oldData,
                    [variables.channelId]: 0 // Reset this channel's unread count to 0
                };
            });
        }
    });

    return {
        markAsRead: mutation.mutateAsync,
        isMarkingAsRead: mutation.isPending
    };
};
