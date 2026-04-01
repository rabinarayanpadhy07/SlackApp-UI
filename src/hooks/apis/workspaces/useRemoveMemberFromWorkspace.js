import { useMutation } from '@tanstack/react-query';

import { removeMemberFromWorkspaceRequest } from '@/apis/workspaces';
import { useAuth } from '@/hooks/context/useAuth';

export const useRemoveMemberFromWorkspace = (workspaceId) => {
    const { auth } = useAuth();
    const { isPending, isSuccess, error, mutateAsync: removeMemberMutation } = useMutation({
        mutationFn: (memberId) => removeMemberFromWorkspaceRequest({ workspaceId, memberId, token: auth?.token }),
        onSuccess: () => {
            console.log('Successfully removed member from workspace');
        },
        onError: (error) => {
            console.log('Error in removing member from workspace mutation', error);
        }
    });

    return {
        isPending,
        isSuccess,
        error,
        removeMemberMutation
    };
};
