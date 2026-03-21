import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LucideLoader2 } from 'lucide-react';

import { useAuth } from '@/hooks/context/useAuth';
import { useToast } from '@/hooks/use-toast';

export const GoogleAuthSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userStr = params.get('user');

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
                    loading: false
                });

                toast({
                    title: 'Successfully signed in',
                    message: 'Welcome back!',
                    type: 'success'
                });

                // Redirect to home
                setTimeout(() => {
                    navigate('/home');
                }, 2000);
            } catch (error) {
                console.error('Error parsing user data', error);
                toast({
                    title: 'Failed to sign in',
                    message: 'Something went wrong with Google authentication.',
                    type: 'error',
                    variant: 'destructive'
                });
                navigate('/auth/signin');
            }
        } else {
            console.error('No token or user data found in URL');
            navigate('/auth/signin');
        }
    }, [location, navigate, setAuth, toast]);

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
