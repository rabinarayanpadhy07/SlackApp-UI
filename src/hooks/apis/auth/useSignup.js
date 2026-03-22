import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { signUpRequest } from '@/apis/auth';

export const useSignup = () => {
    const { isPending, isSuccess, error, mutateAsync: signupMutation } = useMutation({
        mutationFn: signUpRequest,
        onSuccess: (data) => {
            console.log('Scuccessfuilly signed up', data);
            toast.success('Successfully signed up', {
                description: 'You will be redirected to the login page in a few seconds'
            });
        },
        onError: (error) => {
            console.error('Failed to sign up', error);
            toast.error('Failed to sign up', {
                description: error.message
            });
        }
    });


    return {
        isPending,
        isSuccess,
        error,
        signupMutation
    };
};