import { useMutation } from '@tanstack/react-query';

import { updateChannelRequest } from '@/apis/channels';
import { useAuth } from '@/hooks/context/useAuth';

export const useUpdateChannel = () => {
    const { auth } = useAuth();

    const { mutateAsync: updateChannelMutation, isPending, isSuccess, error } = useMutation({
        mutationFn: ({ channelId, channelName }) => updateChannelRequest({
            channelId,
            channelName,
            token: auth?.token
        }),
        onSuccess: () => {
            console.log('Channel updated successfully');
        },
        onError: (error) => {
            console.log('Error updating channel', error);
        }
    });

    return {
        updateChannelMutation,
        isPending,
        isSuccess,
        error
    };
};
