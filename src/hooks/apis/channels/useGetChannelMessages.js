import { useQuery } from '@tanstack/react-query';

import { getPaginatedMessages } from '@/apis/channels';
import { useAuth } from '@/hooks/context/useAuth';

export const useGetChannelMessages = (channelId) => {

    const { auth } = useAuth();
    
    const { isFetched, isError, error, data, isSuccess  } = useQuery({
        queryFn: () => getPaginatedMessages({ channelId, limit: 20, page: 1, token: auth?.token }),
        queryKey: ['getPaginatedMessages', channelId, auth?.token],
        enabled: !!channelId && !!auth?.token,
        gcTime: 0
    });

    return {
        isFetched,
        isError,
        error,
        messages: data,
        isSuccess
    };
};
