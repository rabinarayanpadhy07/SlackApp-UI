import { useQuery } from '@tanstack/react-query';

import axiosInstance from '@/config/axiosConfig';
import { useAuth } from '@/hooks/context/useAuth';

export const useSearch = ({ workspaceId, query }) => {
    const { auth } = useAuth();
    
    const { data, isFetching, isError, error } = useQuery({
        queryKey: ['searchWorkspace', workspaceId, query],
        queryFn: async () => {
            const response = await axiosInstance.get(`/search`, {
                params: { workspaceId, q: query },
                headers: { 'x-access-token': auth?.token }
            });
            return response?.data?.data;
        },
        enabled: Boolean(workspaceId) && Boolean(query) && query.length >= 2,
        staleTime: 60000 // Cache search results for 1 min
    });

    return {
        results: data || { messages: [], channels: [], users: [] },
        isSearching: isFetching,
        isError,
        error
    };
};
