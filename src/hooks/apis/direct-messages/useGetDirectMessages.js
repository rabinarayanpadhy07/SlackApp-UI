import { useQuery } from '@tanstack/react-query';

import axiosInstance from '@/config/axiosConfig';
import { useAuth } from '@/hooks/context/useAuth';

// NOTE: This hook assumes backend envelope { data, message } for responses.
export const useGetDirectMessages = ({
    workspaceId,
    memberId,
    page = 1,
    limit = 20
}) => {
    const { auth } = useAuth();
    const enabled = Boolean(workspaceId && memberId && auth?.token);

    const query = useQuery({
        queryKey: ['directMessages', workspaceId, memberId, page, limit],
        enabled,
        queryFn: async () => {
            try {
                const res = await axiosInstance.get(
                    `/workspaces/${workspaceId}/members/${memberId}/messages`,
                    {
                        params: { page, limit },
                        headers: { 'x-access-token': auth?.token }
                    }
                );
                return res?.data?.data || [];
            } catch (error) {
                if (error?.response?.status === 404) {
                    return [];
                }
                throw error;
            }
        },
        retry: (failureCount, error) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 3;
        }
    });

    return {
        messages: query.data ?? [],
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error
    };
};

