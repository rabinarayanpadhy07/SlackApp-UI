import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '../../ui/skeleton';
import { useFetchWorkspace } from '@/hooks/apis/workspaces/useFetchWorkspace';
import { useGetWorkspaceById } from '@/hooks/apis/workspaces/useGetWorkspaceById';

export const WorkspaceSwitcher = () => {

    const navigate = useNavigate();

    const { workspaceId } = useParams();

    const { isFetching, workspace } = useGetWorkspaceById(workspaceId);

    const { workspaces, isFetching: isFetchingWorkspace } = useFetchWorkspace();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none" asChild>
                <Button
                    className='size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 font-semibold text-slate-800 text-xl rounded-md'
                >
                    {isFetching ? (<Skeleton className="size-full rounded-md bg-white/20" />) : workspace?.name.charAt(0).toUpperCase()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    className='cursor-pointer flex-col justify-start items-start'
                >
                    {workspace?.name}
                    <span className='text-xs text-muted-foreground'>
                        (Active Workspace)
                    </span>
                </DropdownMenuItem>
                {isFetchingWorkspace ? ( 
                    <div className="p-2 space-y-2">
                        <Skeleton className="h-4 w-24 bg-black/10" />
                        <Skeleton className="h-4 w-32 bg-black/10" />
                    </div> 
                ) : 
                    workspaces?.map((workspace) => {
                        if(workspace._id === workspaceId) {
                            return null;
                        }
                        return (
                            <DropdownMenuItem
                                className='cursor-pointer flex-col justify-start items-start'
                                onClick={() => navigate(`/workspaces/${workspace._id}`)}
                                key={workspace._id}
                            >
                                <p
                                    className='truncate'
                                >{workspace?.name}</p>
                            </DropdownMenuItem>
                        );
                    }
                        
                    )
                }

                <DropdownMenuItem
                    className='cursor-pointer flex-col justify-start items-start'
                    onClick={() => navigate('/workspaces/join')}
                >
                    <p className='truncate'>Join another workspace</p>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    );
};
