import { useQuery } from '@tanstack/react-query';

import { getThreadsRequest } from '@/api/threads';
import { useAuth } from '@/hooks/context/useAuth';

export const useGetThreads = (workspaceId) => {
    const { auth } = useAuth();

    const {
        data: threads,
        isSuccess,
        isError,
        isFetching,
        error
    } = useQuery({
        queryFn: () => getThreadsRequest({
            workspaceId,
            token: auth?.token
        }),
        queryKey: ['threads', workspaceId],
        staleTime: 10000,
        enabled: Boolean(workspaceId) && Boolean(auth?.token)
    });

    return {
        threads: threads || [],
        isSuccess,
        isError,
        isFetching,
        error
    };
};
