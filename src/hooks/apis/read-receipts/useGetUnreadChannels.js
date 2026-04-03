import { useQuery } from '@tanstack/react-query';

import axiosInstance from '@/config/axiosConfig';
import { useAuth } from '@/hooks/context/useAuth';

export const useGetUnreadChannels = (workspaceId) => {
    const { auth } = useAuth();

    const { data, isFetching, isError, refetch } = useQuery({
        queryKey: ['unreadChannels', workspaceId],
        queryFn: async () => {
            const response = await axiosInstance.get(`/workspaces/${workspaceId}/unreads`, {
                headers: { 'x-access-token': auth?.token }
            });
            return response?.data?.data || {}; // Returns a map { channelId: unreadCount }
        },
        enabled: Boolean(workspaceId)
    });

    return {
        unreadMap: data || {},
        isFetchingUnreads: isFetching,
        isError,
        refetchUnreads: refetch
    };
};
