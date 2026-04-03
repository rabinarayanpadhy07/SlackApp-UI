import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { forgotPasswordRequest } from '@/apis/auth';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

export const useForgotPassword = () => {
  const mutation = useMutation({
    mutationFn: forgotPasswordRequest,
    onSuccess: () => {
      toast.success('Reset link requested', {
        description:
          'If an account exists for that email, a password reset link has been sent.'
      });
    },
    onError: (error) => {
      toast.error('Unable to request reset link', {
        description: getApiErrorMessage(error)
      });
    }
  });

  return {
    ...mutation,
    forgotPasswordMutation: mutation.mutateAsync
  };
};
