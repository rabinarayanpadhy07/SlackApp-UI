import { useMutation } from '@tanstack/react-query';

import { updateMemberRoleRequest } from '@/apis/workspaces';
import { useAuth } from '@/hooks/context/useAuth';

export const useUpdateMemberRole = (workspaceId) => {
    const { auth } = useAuth();
    const { isPending, isSuccess, error, mutateAsync: updateMemberRoleMutation } = useMutation({
        mutationFn: ({ memberId, role }) => updateMemberRoleRequest({ workspaceId, memberId, role, token: auth?.token }),
        onSuccess: () => {
            console.log('Successfully updated member role');
        },
        onError: (error) => {
            console.log('Error in updating member role mutation', error);
        }
    });

    return {
        isPending,
        isSuccess,
        error,
        updateMemberRoleMutation
    };
};
