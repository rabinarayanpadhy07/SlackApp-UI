import { ArrowRightIcon, CrownIcon, FolderPlusIcon, ShieldIcon, SparklesIcon, UsersIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useFetchWorkspace } from '@/hooks/apis/workspaces/useFetchWorkspace';
import { useAuth } from '@/hooks/context/useAuth';

export const Home = () => {
    const { isFetching, workspaces } = useFetchWorkspace();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const currentPlan = auth?.user?.plan === 'Paid' ? 'Paid' : 'Normal';
    const hasWorkspaces = workspaces?.length > 0;
    const firstWorkspaceId = workspaces?.[0]?._id;

    useEffect(() => {
        if (auth?.isLoading || isFetching) return;
        if (!auth?.user?.isSuperAdmin && firstWorkspaceId) {
            navigate(`/workspaces/${firstWorkspaceId}`);
        }
    }, [auth?.isLoading, auth?.user?.isSuperAdmin, firstWorkspaceId, isFetching, navigate]);

    if (auth?.isLoading || isFetching || (!auth?.user?.isSuperAdmin && firstWorkspaceId)) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#6c2a6b,_#4a154b_45%,_#2b0f30_100%)] p-6">
                <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 text-center text-white backdrop-blur-xl">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-white/20">
                        <SparklesIcon className="size-6 animate-pulse" />
                    </div>
                    <h1 className="text-xl font-semibold">Preparing your workspace...</h1>
                    <p className="mt-2 text-sm text-white/70">
                        Please wait while we set things up for you.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#6c2a6b,_#4a154b_40%,_#2b0f30_82%)] px-4 py-10">
            <div className="mx-auto max-w-7xl">

                {/* HERO SECTION */}
                <div className="text-center text-white mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold">
                        Welcome back, {auth?.user?.username}
                    </h1>
                    <p className="mt-3 text-white/70 max-w-xl mx-auto">
                        Create a workspace, join your team, or manage your plan — everything in one place.
                    </p>
                </div>

                {/* MAIN GRID */}
                <div className="grid gap-6 lg:grid-cols-2">

                    {/* LEFT CARD */}
                    <section className="rounded-3xl border border-white/10 bg-white/10 p-6 sm:p-8 text-white backdrop-blur-xl">
                        <h2 className="text-xl font-semibold mb-6">Workspace Actions</h2>

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={() => navigate('/workspaces/create')}
                                className="h-12 rounded-full bg-white text-[#4a154b] hover:bg-white/90 w-full cursor-pointer"
                            >
                                <FolderPlusIcon className="mr-2 size-4" />
                                Create workspace
                            </Button>

                            <Button
                                variant="outline"
                                className="h-12 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 w-full cursor-pointer"
                                onClick={() => navigate('/workspaces/join')}
                            >
                                <UsersIcon className="mr-2 size-4" />
                                Join workspace
                            </Button>

                            {firstWorkspaceId && (
                                <Button
                                    variant="outline"
                                    className="h-12 rounded-full border-emerald-300/30 bg-emerald-300/10 text-white hover:bg-emerald-300/20 w-full"
                                    onClick={() => navigate(`/workspaces/${firstWorkspaceId}`)}
                                >
                                    Open latest workspace
                                    <ArrowRightIcon className="ml-2 size-4" />
                                </Button>
                            )}

                            {auth?.user?.isSuperAdmin && (
                                <Button
                                    variant="outline"
                                    className="h-12 rounded-full border-amber-300/30 bg-amber-300/10 text-white hover:bg-amber-300/20 w-full"
                                    onClick={() => navigate('/admin')}
                                >
                                    <ShieldIcon className="mr-2 size-4" />
                                    Admin dashboard
                                </Button>
                            )}

                            {currentPlan === 'Normal' && (
                                <Button
                                    variant="outline"
                                    className="h-12 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 w-full cursor-pointer"
                                    onClick={() => navigate('/makepayment')}
                                >
                                    Upgrade to Paid
                                    <ArrowRightIcon className="ml-2 size-4" />
                                </Button>
                            )}
                        </div>
                    </section>

                    {/* RIGHT CARD */}
                    <section className="rounded-3xl border border-white/70 bg-white p-6 sm:p-8 shadow-xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#f4e8f7] px-4 py-2 text-sm font-medium text-[#611f69]">
                            <CrownIcon className={`size-4 ${currentPlan === 'Paid' ? 'text-amber-500' : 'text-[#611f69]'}`} />
                            {currentPlan} plan
                        </div>

                        <div className="mt-6 space-y-4 text-sm text-slate-600">
                            <div className="rounded-2xl bg-slate-50 p-5">
                                <p className="font-medium text-slate-900">What you can do</p>
                                <p className="mt-2">
                                    {currentPlan === 'Paid'
                                        ? 'Unlimited workspaces and channels are active.'
                                        : 'Create 1 workspace and up to 2 channels.'}
                                </p>
                            </div>

                            <div className="rounded-2xl border p-5">
                                <p className="font-medium text-slate-900">Your workspaces</p>

                                {hasWorkspaces ? (
                                    <div className="mt-3 space-y-2">
                                        {workspaces.slice(0, 5).map((workspace) => (
                                            <button
                                                key={workspace._id}
                                                onClick={() => navigate(`/workspaces/${workspace._id}`)}
                                                className="flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 hover:bg-purple-50 cursor-pointer"
                                            >
                                                <span className="truncate font-medium">
                                                    {workspace.name}
                                                </span>
                                                <ArrowRightIcon className="size-4 text-[#611f69]" />
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="mt-2 text-slate-500">
                                        No workspaces yet.
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};