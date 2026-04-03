import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { resetPasswordRequest } from '@/apis/auth';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

export const useResetPassword = () => {
  const mutation = useMutation({
    mutationFn: resetPasswordRequest,
    onSuccess: () => {
      toast.success('Password updated', {
        description: 'You can now sign in with your new password.'
      });
    },
    onError: (error) => {
      toast.error('Unable to reset password', {
        description: getApiErrorMessage(error)
      });
    }
  });

  return {
    ...mutation,
    resetPasswordMutation: mutation.mutateAsync
  };
};
