import { Loader2Icon, TriangleAlertIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetWorkspaceById } from '@/hooks/apis/workspaces/useGetWorkspaceById';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

export const WorkspaceRedirect = () => {
    const { workspaceId } = useParams();
    const navigate = useNavigate();
    const { workspace, isFetching, isSuccess, error } = useGetWorkspaceById(workspaceId);

    useEffect(() => {
        if (!isSuccess || !workspace) return;

        const firstChannel = workspace.channels?.[0];
        if (firstChannel?._id) {
            navigate(`/workspaces/${workspaceId}/channels/${firstChannel._id}`, { replace: true });
        }
    }, [isSuccess, navigate, workspace, workspaceId]);

    if (isFetching) {
        return (
            <div className='h-full flex items-center justify-center'>
                <Loader2Icon className='size-5 animate-spin text-muted-foreground' />
            </div>
        );
    }

    if (!isSuccess || !workspace?.channels?.length) {
        return (
            <div className='h-full flex flex-col gap-y-2 items-center justify-center'>
                <TriangleAlertIcon className='size-6 text-muted-foreground' />
                <span className='text-sm text-muted-foreground'>
                    {workspace?.channels?.length === 0
                        ? 'No channels are available in this workspace yet.'
                        : getApiErrorMessage(error, 'Workspace could not be opened.')}
                </span>
            </div>
        );
    }

    return null;
};
