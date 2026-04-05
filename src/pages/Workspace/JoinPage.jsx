import { useQueryClient } from '@tanstack/react-query';
import { ArrowRightIcon, Loader2Icon, UsersIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
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

    const handleAddMemberToWorkspace = useCallback(async (joinCode) => {
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
            toast.success(
                workspacePreview?.name
                    ? `Joined ${workspacePreview.name}`
                    : 'Joined workspace successfully'
            );

            navigate(`/workspaces/${targetWorkspaceId}`);
        } catch (error) {
            toast.error('Failed to join workspace', {
                description: getApiErrorMessage(
                    error,
                    'Please check the code and try again.'
                )
            });
        } finally {
            setIsResolving(false);
        }
    }, [auth?.token, joinWorkspaceMutation, navigate, queryClient, workspaceId]);

    useEffect(() => {
        const inviteCode = searchParams.get('code')?.toUpperCase();
        if (!inviteCode || inviteCode.length !== 6 || hasTriedInviteLink.current) {
            return;
        }

        hasTriedInviteLink.current = true;
        handleAddMemberToWorkspace(inviteCode);
    }, [handleAddMemberToWorkspace, searchParams]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#611f69] via-[#4a154b] to-[#2c0f30] px-4 py-6 sm:py-10">
            <div className="mx-auto w-full max-w-6xl">

                {/* MAIN CONTAINER */}
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">

                    {/* INFO SECTION */}
                    <div className="text-white space-y-6 order-2 lg:order-1 text-center lg:text-left">
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                                Join a workspace
                            </h1>
                            <p className="mt-3 text-white/70 text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
                                Enter the invite code shared by your team to join an existing workspace.
                                If you already have access, we’ll take you there automatically.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur">
                                <h3 className="font-semibold">Where to get the code?</h3>
                                <p className="text-sm text-white/70 mt-1">
                                    Ask your workspace admin or team member for the 6-digit invite code.
                                </p>
                            </div>

                            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur">
                                <h3 className="font-semibold">What happens next?</h3>
                                <p className="text-sm text-white/70 mt-1">
                                    After entering the code, you will instantly join the workspace.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* JOIN CARD */}
                    <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-8 w-full max-w-md mx-auto order-1 lg:order-2">
                        <div className="text-center mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                Enter Invite Code
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Enter the 6-character workspace code
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
                            {/* Responsive Wrapper */}
                            <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto">
                                <VerificationInput
                                    onComplete={handleAddMemberToWorkspace}
                                    length={6}
                                    autoFocus
                                    classNames={{
                                        container: "flex justify-center gap-2 w-full",
                                        character:
                                            "aspect-square w-full max-w-[36px] sm:max-w-[44px] md:max-w-[52px] lg:max-w-[58px] rounded-xl border border-gray-300 bg-white text-base sm:text-lg md:text-xl font-semibold text-gray-900 shadow-sm transition-all focus:border-[#611f69] focus:ring-2 focus:ring-[#611f69]/20",
                                        characterInactive: "bg-white text-gray-900",
                                        characterFilled: "bg-white text-gray-900",
                                        characterSelected:
                                            "border-[#611f69] ring-2 ring-[#611f69]/20",
                                    }}
                                />
                            </div>

                            {/* Status Text */}
                            <div className="mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500 text-center">
                                {isBusy ? (
                                    <Loader2Icon className="size-4 animate-spin" />
                                ) : (
                                    <UsersIcon className="size-4" />
                                )}
                                {isBusy
                                    ? "Joining workspace..."
                                    : "Workspace will be joined automatically"}
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3">
                            <Button
                                type="button"
                                className="w-full rounded-full bg-[#611f69] hover:bg-[#4a154b] cursor-pointer"
                                onClick={() => navigate("/home")}
                            >
                                Open home
                                <ArrowRightIcon className="ml-2 size-4" />
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full rounded-full cursor-pointer"
                                asChild
                            >
                                <Link to={workspaceId ? `/workspaces/${workspaceId}` : "/home"}>
                                    {workspaceId ? "Back to workspace" : "Back to home"}
                                </Link>
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};