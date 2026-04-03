import { LogOutIcon, SquareDashedMousePointer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useFetchWorkspace } from '@/hooks/apis/workspaces/useFetchWorkspace';
import { useAuth } from '@/hooks/context/useAuth';

export const AdminHeader = ({ activeSectionLabel, isSectionFetching }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { workspaces } = useFetchWorkspace();
    const firstWorkspaceId = workspaces?.[0]?._id;

    const handleLogout = async () => {
        await logout();
        navigate('/auth/signin', { replace: true });
    };

    return (
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slack-dark/88 px-3 py-3 backdrop-blur sm:px-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-white/8">
                        <SquareDashedMousePointer className="size-5 text-amber-200" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{activeSectionLabel}</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {isSectionFetching && (
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/72">
                            Updating
                        </span>
                    )}
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                        onClick={() => navigate('/home')}
                    >
                        Home
                    </Button>
                    {firstWorkspaceId ? (
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                            onClick={() => navigate(`/workspaces/${firstWorkspaceId}`)}
                        >
                            Open Workspace
                        </Button>
                    ) : null}
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300/20 bg-red-400/10 text-white hover:bg-red-400/20"
                        onClick={handleLogout}
                    >
                        <LogOutIcon className="size-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
};
