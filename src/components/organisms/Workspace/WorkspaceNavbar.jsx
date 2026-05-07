import { InfoIcon, LucideLoader2, ShieldIcon, Menu, Headphones } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useGetWorkspaceById } from '@/hooks/apis/workspaces/useGetWorkspaceById';
import { useAuth } from '@/hooks/context/useAuth';
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace';

export const WorkspaceNavbar = ({ onMenuClick }) => {

    const { workspaceId } = useParams();

    const navigate = useNavigate();
    const { auth, logout } = useAuth();
    const { isFetching, workspace, error, isSuccess } = useGetWorkspaceById(workspaceId);
    const { setCurrentWorkspace } = useCurrentWorkspace();

    useEffect(() => {
        if(!isFetching && !isSuccess && error) {
            console.log('Error fetching workspace', error.status);
            if(error.status === 401 || error.status === 403) {
                logout();
                navigate('/auth/signin');
            }
        }
        
        if(workspace) {
            setCurrentWorkspace(workspace);
        }

    }, [workspace, setCurrentWorkspace, isSuccess, error, isFetching, logout, navigate]);

    if(isFetching) {
        return (
            <div className="flex h-14 items-center justify-center bg-white border-b border-black/10 w-full rounded-t-2xl">
                <LucideLoader2 className="animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <nav className='flex items-center justify-between h-14 px-4 bg-white border-b border-black/5 z-10 w-full rounded-t-2xl shadow-sm'>
            
            {/* Left side: Mobile Menu Toggle & Title */}
            <div className='flex-1 flex items-center justify-start'>
                <Button
                    variant="transparent"
                    size="icon"
                    onClick={onMenuClick}
                    className="md:hidden text-slate-500 hover:text-slate-800 hover:bg-slate-100 mr-2"
                >
                    <Menu className="w-5 h-5" />
                </Button>
                <div className="font-semibold text-slate-800 truncate max-w-[200px]">
                    {workspace?.name || 'Workspace'}
                </div>
            </div>

            {/* Right side: Actions */}
            <div className='flex items-center justify-end space-x-2'>
                {/* Start Huddle Icon */}
                <Button
                    variant='transparent'
                    size='icon'
                    className="hover:bg-slate-100 rounded-full text-slate-500 hover:text-purple-600 transition-colors group"
                >
                    <Headphones className='size-5 group-hover:scale-110 transition-transform' />
                </Button>

                {auth?.user?.isSuperAdmin && (
                    <Button
                        variant='transparent'
                        size='icon'
                        className="hover:bg-slate-100 rounded-full text-amber-500 hover:text-amber-600 transition-colors"
                        onClick={() => navigate('/admin')}
                    >
                        <ShieldIcon className='size-5' />
                    </Button>
                )}
                <Button
                    variant='transparent'
                    size='icon'
                    className="hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <InfoIcon className='size-5' />
                </Button>
            </div>
        </nav>
    );
};
