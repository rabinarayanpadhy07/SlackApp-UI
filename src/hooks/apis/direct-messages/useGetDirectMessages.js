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
    const enabled = Boolean(workspaceId && memberId);

    const query = useQuery({
        queryKey: ['directMessages', workspaceId, memberId, page, limit],
        enabled,
        queryFn: async () => {
            const res = await axiosInstance.get(
                `/workspaces/${workspaceId}/members/${memberId}/messages`,
                {
                    params: { page, limit },
                    headers: { 'x-access-token': auth?.token }
                }
            );
            // backend uses a { data, message } envelope
            return res?.data?.data || [];
        }
    });

    return {
        messages: query.data ?? [],
        isFetching: query.isFetching,
        isError: query.isError
    };
};

