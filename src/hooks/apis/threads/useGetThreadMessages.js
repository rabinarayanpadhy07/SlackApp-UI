import { useQuery } from '@tanstack/react-query';

import { getThreadMessagesRequest } from '@/api/threads';
import { useAuth } from '@/hooks/context/useAuth';

export const useGetThreadMessages = ({ workspaceId, threadId }) => {
    const { auth } = useAuth();
    
    const {
        data: messages,
        isSuccess,
        isError,
        isFetching,
        error
    } = useQuery({
        queryFn: () => getThreadMessagesRequest({ 
            workspaceId, 
            threadId,
            token: auth?.token 
        }),
        queryKey: ['getThreadMessages', threadId],
        staleTime: 10000,
        enabled: !!threadId && !!workspaceId && !!auth?.token,
    });

    return {
        messages,
        isSuccess,
        isError,
        isFetching,
        error
    };
};
