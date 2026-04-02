import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { LucideLoader2 } from 'lucide-react';

import { useAuth } from '@/hooks/context/useAuth';

export const GoogleAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    

    useEffect(() => {
        const params = searchParams; // Changed from new URLSearchParams(location.search)
        const token = params.get('token');
        const userStr = params.get('user');
        const error = params.get('error');

        if (error) {
            toast.error('Failed to sign in with Google', {
                description: 'Please try again.'
            });
            navigate('/auth/signin', { replace: true });
            return;
        }

        if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));
                
                // Store in localStorage
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', token);

                // Update auth state
                setAuth({
                    token,
                    user,
                    isLoading: false
                });

                toast.success('Successfully signed in', {
                    description: 'Welcome back!'
                });

                setTimeout(() => {
                    navigate('/home', { replace: true });
                }, 2000);
            } catch (error) {
                console.error('Error parsing user data', error);
                toast.error('Failed to sign in', {
                    description: 'Something went wrong with Google authentication.'
                });
                navigate('/auth/signin', { replace: true });
            }
        } else {
            console.error('No token or user data found in URL');
            navigate('/auth/signin', { replace: true });
        }
    }, [searchParams, navigate, setAuth]);

    return (
        <div className="h-[100vh] flex items-center justify-center bg-slack">
            <div className="md:h-auto md:w-[420px] bg-white p-8 rounded-lg shadow-md flex flex-col items-center gap-y-4">
                <LucideLoader2 className="size-10 animate-spin text-slack-primary" />
                <p className="text-lg font-semibold">Completing authentication...</p>
                <p className="text-muted-foreground text-sm">Please wait while we set up your session.</p>
            </div>
        </div>
    );
};
