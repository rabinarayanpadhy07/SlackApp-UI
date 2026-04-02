import { InfoIcon, LucideLoader2, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useGetWorkspaceById } from '@/hooks/apis/workspaces/useGetWorkspaceById';
import { useAuth } from '@/hooks/context/useAuth';
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace';
import { SearchModal } from '@/components/organisms/Search/SearchModal';

export const WorkspaceNavbar = () => {

    const [searchOpen, setSearchOpen] = useState(false);
    const { workspaceId } = useParams();

    const navigate = useNavigate();
    const { logout } = useAuth();
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
        return <LucideLoader2 className="animate-spin ml-2" />;
    }

    return (
        <>
        <SearchModal open={searchOpen} setOpen={setSearchOpen} workspace={workspace} />
        <nav
            className='flex items-center justify-center h-12 p-1.5 bg-[#481349] z-10 w-full'
        >
            <div className='flex-1 flex items-center justify-end px-4' />
            <div className="max-w-[600px] w-full px-4 flex items-center justify-center">
                <Button
                    onClick={() => setSearchOpen(true)}
                    size='sm'
                    className='bg-white/10 hover:bg-white/20 w-full justify-start h-[28px] px-3 rounded-full transition-colors duration-200 group'
                >
                    <SearchIcon className='size-3.5 text-white/70 group-hover:text-white mr-2' />
                    <span className='text-white/70 group-hover:text-white text-xs'>
                        Search {workspace?.name || 'Workspace'} 
                    </span>
                    <kbd className="ml-auto pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded bg-white/5 px-1.5 font-mono text-[10px] text-white/50">
                        <span>⌘</span>K
                    </kbd>
                </Button>
            </div>

            <div
                className='ml-auto flex-1 flex items-center justify-end pr-3'
            >
                <Button
                    variant='transparent'
                    size='icon'
                    className="hover:bg-white/10 rounded"
                >
                    <InfoIcon className='size-4.5 text-white/80 hover:text-white' />
                </Button>
            </div>
        </nav>
        </>
    );
};
