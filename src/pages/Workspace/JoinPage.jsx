import { useQueryClient } from '@tanstack/react-query';
import { ArrowRightIcon, HashIcon, Loader2Icon, SearchIcon, UsersIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import VerificationInput from 'react-verification-input';
import { toast } from 'sonner';

import { resolveWorkspaceJoinCodeRequest } from '@/apis/workspaces';
import { Button } from '@/components/ui/button';
import { useJoinWorkspace } from '@/hooks/apis/workspaces/useJoinWorkspace';
import { useAuth } from '@/hooks/context/useAuth';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

export const JoinPage = () => {
    const { workspaceId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const { auth } = useAuth();
    const { joinWorkspaceMutation, isPending } = useJoinWorkspace();
    const [isResolving, setIsResolving] = useState(false);
    const hasTriedInviteLink = useRef(false);

    const isBusy = isPending || isResolving;

    async function handleAddMemberToWorkspace(joinCode) {
        try {
            setIsResolving(true);

            let targetWorkspaceId = workspaceId;
            let workspacePreview = null;

            if (!targetWorkspaceId) {
                workspacePreview = await resolveWorkspaceJoinCodeRequest({
                    joinCode,
                    token: auth?.token
                });

                if (workspacePreview?.isMember) {
                    toast.success(`You already have access to ${workspacePreview.name}`);
                    navigate(`/workspaces/${workspacePreview._id}`);
                    return;
                }

                targetWorkspaceId = workspacePreview?._id;
            }

            await joinWorkspaceMutation({
                workspaceId: targetWorkspaceId,
                joinCode
            });

            await queryClient.invalidateQueries({ queryKey: ['fetchWorkspaces'] });
            toast.success(workspacePreview?.name ? `Joined ${workspacePreview.name}` : 'Joined workspace successfully');
            navigate(`/workspaces/${targetWorkspaceId}`);
        } catch (error) {
            toast.error('Failed to join workspace', {
                description: getApiErrorMessage(error, 'Please check the code and try again.')
            });
        } finally {
            setIsResolving(false);
        }
    }

    useEffect(() => {
        const inviteCode = searchParams.get('code')?.toUpperCase();
        if (!inviteCode || inviteCode.length !== 6 || hasTriedInviteLink.current) {
            return;
        }

        hasTriedInviteLink.current = true;
        handleAddMemberToWorkspace(inviteCode);
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#611f69,_#4a154b_38%,_#2c0f30_78%)] px-4 py-10">
            <div className="mx-auto grid min-h-[80vh] max-w-5xl items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <section className="rounded-[32px] border border-white/10 bg-white/10 px-8 py-10 text-white shadow-[0_30px_90px_-42px_rgba(0,0,0,0.7)] backdrop-blur">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80">
                        <SearchIcon className="size-4" />
                        Join by invite code
                    </div>
                    <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight">
                        Enter the workspace code and jump right in.
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72">
                        Paste the 6-character code shared by your team. We&apos;ll find the workspace, verify access, and add you automatically.
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-3xl border border-white/10 bg-black/15 p-5">
                            <p className="text-sm font-medium text-white">Need from your team</p>
                            <p className="mt-2 text-sm text-white/65">A 6-character invite code like `A1B2C3`.</p>
                        </div>
                        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                            <p className="text-sm font-medium text-emerald-100">What happens next</p>
                            <p className="mt-2 text-sm text-emerald-50/80">You land in the workspace and we refresh your workspace list automatically.</p>
                        </div>
                    </div>
                </section>

                <section className="rounded-[32px] border border-white/70 bg-white p-8 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.35)]">
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#f4e8f7] px-4 py-2 text-sm font-medium text-[#611f69]">
                            <HashIcon className="size-4" />
                            Workspace access
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold text-slate-900">Join workspace</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Enter the invite code below. If you already belong to this workspace, we&apos;ll take you there directly.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-slate-50 p-5">
                        <VerificationInput
                            onComplete={handleAddMemberToWorkspace}
                            length={6}
                            autoFocus
                            classNames={{
                                container: 'flex justify-center gap-x-2 sm:gap-x-3',
                                character: 'h-14 w-11 rounded-2xl border border-slate-200 bg-white text-lg font-semibold text-slate-900 shadow-sm transition focus:border-[#611f69] focus:ring-2 focus:ring-[#611f69]/20',
                                characterInactive: 'bg-white text-slate-900',
                                characterFilled: 'bg-white text-slate-900',
                                characterSelected: 'border-[#611f69] ring-2 ring-[#611f69]/20'
                            }}
                        />

                        <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
                            {isBusy ? <Loader2Icon className="size-4 animate-spin" /> : <UsersIcon className="size-4" />}
                            {isBusy ? 'Joining workspace...' : 'We will validate the code as soon as all 6 characters are entered.'}
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button type="button" variant="outline" className="rounded-full" asChild>
                            <Link to={workspaceId ? `/workspaces/${workspaceId}` : '/home'}>
                                {workspaceId ? 'Back to workspace' : 'Back to home'}
                            </Link>
                        </Button>
                        <Button type="button" className="rounded-full bg-[#611f69] hover:bg-[#4a154b]" onClick={() => navigate('/home')}>
                            Open home
                            <ArrowRightIcon className="ml-2 size-4" />
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
};
