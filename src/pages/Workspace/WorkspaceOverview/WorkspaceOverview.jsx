import { Loader2Icon, HashIcon, MessageSquareTextIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useGetWorkspaceById } from '@/hooks/apis/workspaces/useGetWorkspaceById';

export const WorkspaceOverview = () => {
    const { workspaceId } = useParams();
    const navigate = useNavigate();
    const { workspace, isFetching, isSuccess } = useGetWorkspaceById(workspaceId);

    useEffect(() => {
        if (!isFetching && isSuccess && workspace) {
            const firstChannel = workspace?.channels?.[0];
            if (firstChannel) {
                navigate(`/workspaces/${workspaceId}/channels/${firstChannel._id}`, { replace: true });
                return;
            }
        }
    }, [isFetching, isSuccess, workspace, workspaceId, navigate]);

    if (isFetching) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-4">
                <Loader2Icon className="size-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading workspace...</p>
            </div>
        );
    }

    const hasChannels = workspace?.channels?.length > 0;

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
            <div className="rounded-2xl bg-muted/50 p-6 mb-6 flex items-center justify-center">
                <HashIcon className="size-16 text-muted-foreground/60" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
                {workspace?.name ?? 'Workspace'}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
                {hasChannels
                    ? 'Redirecting to your first channel...'
                    : 'No channels yet. Create a channel to start collaborating.'}
            </p>
            {hasChannels && (
                <div className="flex flex-wrap gap-2 justify-center">
                    {workspace.channels.slice(0, 5).map((ch) => (
                        <Button
                            key={ch._id}
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/workspaces/${workspaceId}/channels/${ch._id}`)}
                            className="gap-1.5"
                        >
                            <HashIcon className="size-3.5" />
                            {ch.name}
                        </Button>
                    ))}
                </div>
            )}
            {!hasChannels && (
                <Button
                    variant="outline"
                    onClick={() => navigate(`/workspaces/${workspaceId}/threads`)}
                    className="gap-2"
                >
                    <MessageSquareTextIcon className="size-4" />
                    View Threads
                </Button>
            )}
        </div>
    );
};
