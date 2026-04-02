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

    useEffect(() => {
        if (auth?.isLoading || isFetching) return;
        if (!auth?.user?.isSuperAdmin && workspaces?.length > 0) {
            navigate(`/workspaces/${workspaces[0]._id}`);
        }
    }, [auth?.isLoading, auth?.user?.isSuperAdmin, isFetching, navigate, workspaces]);

    if (auth?.isLoading || isFetching || (!auth?.user?.isSuperAdmin && workspaces?.length > 0)) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#6c2a6b,_#4a154b_45%,_#2b0f30_100%)] p-6">
                <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-white/10 p-8 text-center text-white shadow-[0_24px_80px_-36px_rgba(0,0,0,0.55)] backdrop-blur">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-white/15 text-white">
                        <SparklesIcon className="size-6 animate-pulse" />
                    </div>
                    <h1 className="text-2xl font-semibold">Preparing your workspace</h1>
                    <p className="mt-3 text-sm leading-6 text-white/70">
                        We&apos;re checking your account and routing you to the right place.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#6c2a6b,_#4a154b_40%,_#2b0f30_82%)] px-4 py-10">
            <div className="mx-auto grid min-h-[80vh] max-w-6xl items-center gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <section className="rounded-[32px] border border-white/10 bg-white/10 px-8 py-10 text-white shadow-[0_30px_90px_-42px_rgba(0,0,0,0.72)] backdrop-blur">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80">
                        <SparklesIcon className="size-4" />
                        Slack-style workspace start
                    </div>
                    <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight">
                        Welcome back, {auth?.user?.username}.
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72">
                        Create a fresh workspace, join an existing one with an invite code, or upgrade your plan when your team outgrows the basics.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <Button onClick={() => navigate('/workspaces/create')} className="h-12 rounded-full bg-white text-[#4a154b] hover:bg-white/90">
                            <FolderPlusIcon className="mr-2 size-4" />
                            Create workspace
                        </Button>
                        <Button variant="outline" className="h-12 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10" onClick={() => navigate('/workspaces/join')}>
                            <UsersIcon className="mr-2 size-4" />
                            Join workspace
                        </Button>
                        {auth?.user?.isSuperAdmin ? (
                            <Button variant="outline" className="h-12 rounded-full border-amber-300/30 bg-amber-300/10 text-white hover:bg-amber-300/20" onClick={() => navigate('/admin')}>
                                <ShieldIcon className="mr-2 size-4" />
                                Open admin dashboard
                            </Button>
                        ) : null}
                        {currentPlan === 'Normal' ? (
                            <Button variant="outline" className="h-12 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10" onClick={() => navigate('/makepayment')}>
                                Upgrade to Paid
                                <ArrowRightIcon className="ml-2 size-4" />
                            </Button>
                        ) : null}
                    </div>

                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-3xl border border-white/10 bg-black/15 p-5">
                            <p className="text-sm font-medium text-white">Create</p>
                            <p className="mt-2 text-sm text-white/65">Start a new workspace for a team, client, or project.</p>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-black/15 p-5">
                            <p className="text-sm font-medium text-white">Join</p>
                            <p className="mt-2 text-sm text-white/65">Use a 6-character invite code to enter an existing workspace.</p>
                        </div>
                        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                            <p className="text-sm font-medium text-emerald-100">Scale</p>
                            <p className="mt-2 text-sm text-emerald-50/80">Paid users unlock unlimited workspaces and channels.</p>
                        </div>
                    </div>
                </section>

                <section className="rounded-[32px] border border-white/70 bg-white/95 p-8 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.35)] backdrop-blur">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#f4e8f7] px-4 py-2 text-sm font-medium text-[#611f69]">
                        <CrownIcon className={`size-4 ${currentPlan === 'Paid' ? 'text-amber-500' : 'text-[#611f69]'}`} />
                        {currentPlan} plan
                    </div>

                    <div className="mt-6 space-y-4 text-sm text-slate-600">
                        <div className="rounded-3xl bg-slate-50 p-5">
                            <p className="font-medium text-slate-900">What you can do next</p>
                            <p className="mt-2">
                                {currentPlan === 'Paid'
                                    ? 'Create or join as many workspaces as you need. Your full plan is already active.'
                                    : 'Create your own workspace now, or join an existing one with an invite code from your team.'}
                            </p>
                        </div>
                        <div className="rounded-3xl border border-dashed border-slate-200 p-5">
                            <p className="font-medium text-slate-900">Plan access</p>
                            <p className="mt-2">
                                {currentPlan === 'Paid'
                                    ? 'Unlimited workspaces and channels are active on this account.'
                                    : 'Normal users can create 1 workspace and up to 2 channels per workspace, but can still join other workspaces they are invited to.'}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
