import { useQueryClient } from '@tanstack/react-query';
import { ArrowRightIcon, Loader2Icon, UsersIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import VerificationInput from 'react-verification-input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { resolveWorkspaceJoinCodeRequest } from '@/apis/workspaces';
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
            const normalizedJoinCode = joinCode.toUpperCase();

            let targetWorkspaceId = workspaceId;
            let workspacePreview = null;

            if (!targetWorkspaceId) {
                workspacePreview = await resolveWorkspaceJoinCodeRequest({
                    joinCode: normalizedJoinCode,
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
                joinCode: normalizedJoinCode
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

    // Animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] px-4 py-6 sm:py-10 flex items-center justify-center relative overflow-hidden text-slate-200">
            {/* Ambient Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="mx-auto w-full max-w-5xl z-10">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
                >
                    {/* INFO SECTION */}
                    <motion.div variants={itemVariants} className="text-white space-y-8 order-2 lg:order-1 text-center lg:text-left">
                        <div>
                            <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-300 mb-6">
                                <UsersIcon className="mr-2 h-4 w-4" /> Team Collaboration
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                                Join your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">workspace</span>
                            </h1>
                            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                                Enter the 6-digit invite code shared by your team to access your workspace. If you're already a member, we'll take you right there.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="glass-card border border-white/5 rounded-2xl p-5 bg-white/[0.02] backdrop-blur-md">
                                <h3 className="font-semibold text-white flex items-center">
                                    <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs mr-2">1</div>
                                    Get the code
                                </h3>
                                <p className="text-sm text-slate-400 mt-2">
                                    Ask your workspace admin or a colleague for the 6-character code.
                                </p>
                            </div>

                            <div className="glass-card border border-white/5 rounded-2xl p-5 bg-white/[0.02] backdrop-blur-md">
                                <h3 className="font-semibold text-white flex items-center">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs mr-2">2</div>
                                    Enter it here
                                </h3>
                                <p className="text-sm text-slate-400 mt-2">
                                    Type the code in the inputs, and you'll be instantly added to the team.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* JOIN CARD */}
                    <motion.div variants={itemVariants} className="w-full max-w-md mx-auto order-1 lg:order-2">
                        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-[#0a0a0a]/80 backdrop-blur-xl relative overflow-hidden">
                            
                            {/* Card Accent */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />

                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Enter Invite Code
                                </h2>
                                <p className="text-sm text-slate-400">
                                    Check your email or ask your admin.
                                </p>
                            </div>

                            <div className="rounded-2xl p-4 sm:p-6 mb-8 border border-white/5 bg-white/5">
                                <div className="mx-auto flex justify-center">
                                    <VerificationInput
                                        onComplete={handleAddMemberToWorkspace}
                                        length={6}
                                        autoFocus
                                        classNames={{
                                            container: "flex justify-center gap-2 w-full",
                                            character:
                                                "aspect-square w-full max-w-[40px] sm:max-w-[48px] md:max-w-[54px] rounded-xl border border-white/10 bg-[#13151a] text-lg sm:text-xl font-bold text-white shadow-inner transition-all flex items-center justify-center focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:bg-[#1a1c23]",
                                            characterInactive: "border-white/10 text-white/50",
                                            characterFilled: "border-purple-500/50 text-white bg-[#1a1c23]",
                                            characterSelected:
                                                "border-purple-500 ring-2 ring-purple-500/30 bg-[#1a1c23]",
                                        }}
                                    />
                                </div>

                                {/* Status Text */}
                                <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-slate-400">
                                    {isBusy ? (
                                        <Loader2Icon className="size-4 animate-spin text-purple-400" />
                                    ) : (
                                        <UsersIcon className="size-4 text-purple-400" />
                                    )}
                                    {isBusy
                                        ? <span className="text-purple-300">Joining workspace...</span>
                                        : <span>Waiting for code...</span>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    type="button"
                                    disabled={isBusy}
                                    className="w-full flex items-center justify-center py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-500 hover:to-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-lg disabled:opacity-50"
                                    onClick={() => navigate("/home")}
                                >
                                    Open Dashboard
                                    <ArrowRightIcon className="ml-2 size-4" />
                                </button>

                                <button
                                    type="button"
                                    disabled={isBusy}
                                    className="w-full py-3 px-4 rounded-xl bg-transparent border border-white/10 text-slate-300 font-medium hover:bg-white/5 hover:text-white transition-all disabled:opacity-50"
                                    onClick={() => navigate(workspaceId ? `/workspaces/${workspaceId}` : "/home")}
                                >
                                    {workspaceId ? "Back to workspace" : "Back to home"}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
};