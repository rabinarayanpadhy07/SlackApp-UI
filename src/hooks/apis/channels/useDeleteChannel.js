import { useMutation } from '@tanstack/react-query';

import { deleteChannelRequest } from '@/apis/channels';
import { useAuth } from '@/hooks/context/useAuth';

export const useDeleteChannel = () => {
    const { auth } = useAuth();

    const { mutateAsync: deleteChannelMutation, isPending, isSuccess, error } = useMutation({
        mutationFn: ({ channelId }) => deleteChannelRequest({ channelId, token: auth?.token }),
        onSuccess: () => {
            console.log('Channel deleted successfully');
        },
        onError: (error) => {
            console.log('Error deleting channel', error);
        }
    });

    return {
        deleteChannelMutation,
        isPending,
        isSuccess,
        error
    };
};
