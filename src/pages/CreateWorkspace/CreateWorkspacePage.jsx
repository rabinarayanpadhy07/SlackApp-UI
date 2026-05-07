import { useQueryClient } from '@tanstack/react-query';
import { Building2Icon, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { useCreateWorkspace } from '@/hooks/apis/workspaces/useCreateWorkspace';
import { useAuth } from '@/hooks/context/useAuth';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

export const CreateWorkspacePage = () => {
    const [workspaceName, setWorkspaceName] = useState('');
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isPending, createWorkspaceMutation } = useCreateWorkspace();
    const { auth } = useAuth();
    const currentPlan = auth?.user?.plan === 'Paid' ? 'Paid' : 'Normal';

    async function handleSubmit(e) {
        e.preventDefault();
        if (!workspaceName.trim()) return;
        try {
            const data = await createWorkspaceMutation({ name: workspaceName.trim() });
            queryClient.invalidateQueries({ queryKey: ['fetchWorkspaces'] });
            navigate(`/workspaces/${data._id}`);
        } catch (err) {
            console.error('Failed to create workspace', err);
            toast.error('Unable to create workspace', {
                description: getApiErrorMessage(err, 'Please try again.')
            });
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden text-slate-200">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card rounded-2xl p-8 border border-white/10 shadow-2xl bg-[#0a0a0a]/80 backdrop-blur-xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_15px_rgba(147,51,234,0.1)]">
                            <Building2Icon className="size-8 text-purple-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2 text-center">
                            Create your workspace
                        </h1>
                        <p className="text-slate-400 text-center text-sm">
                            Give your team a home. You can always change the name later.
                        </p>
                    </div>

                    <div className="mb-6 rounded-xl bg-white/5 border border-white/5 px-4 py-3 text-center text-xs text-slate-300">
                        {currentPlan === 'Paid'
                            ? <span className="text-emerald-400 font-medium">✨ Paid plan active: create unlimited workspaces.</span>
                            : <span>Normal plan: <span className="text-white font-medium">1 workspace</span> included.</span>}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">
                                Workspace Name
                            </label>
                            <input
                                required
                                minLength={3}
                                placeholder="e.g. Acme Corp, Engineering Team"
                                value={workspaceName}
                                onChange={(e) => setWorkspaceName(e.target.value)}
                                disabled={isPending}
                                className="w-full bg-[#13151a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all disabled:opacity-50"
                            />
                        </div>
                        
                        <div className="flex flex-col gap-3 mt-8">
                            <button 
                                type="submit" 
                                disabled={isPending}
                                className="w-full flex items-center justify-center py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-500 hover:to-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        Create workspace
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/home')}
                                disabled={isPending}
                                className="w-full py-3 px-4 rounded-xl bg-transparent border border-white/10 text-slate-300 font-medium hover:bg-white/5 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};
