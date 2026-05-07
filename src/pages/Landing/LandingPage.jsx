import { ArrowRight, Bot, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-slate-200 overflow-hidden relative selection:bg-purple-500/30">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-[800px] h-[400px] bg-emerald-600/5 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>

            {/* Navbar */}
            <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/20">
                            S
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">SlackApp</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            className="text-slate-300 hover:text-white hover:bg-white/5"
                            onClick={() => navigate('/auth/signin')}
                        >
                            Log in
                        </Button>
                        <Button
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-lg shadow-black/50 transition-all rounded-full px-6"
                            onClick={() => navigate('/auth/signup')}
                        >
                            Sign up
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-40 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-8">
                        The Future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400">
                            Team Collaboration
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                        Connect, communicate, and create in a workspace designed for the modern team. Experience seamless messaging with AI-powered insights.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            size="lg"
                            className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-xl shadow-purple-500/20 border border-white/10 transition-all w-full sm:w-auto"
                            onClick={() => navigate('/auth/signup')}
                        >
                            Get Started for Free
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-14 px-8 text-lg rounded-full bg-white/5 hover:bg-white/10 text-white border-white/10 w-full sm:w-auto transition-all"
                            onClick={() => navigate('/auth/signin')}
                        >
                            Sign in to Workspace
                        </Button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="max-w-7xl mx-auto mt-32 grid md:grid-cols-3 gap-6">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6">
                            <Bot className="w-7 h-7 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">AI Powered</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Get instant meeting summaries and intelligent message replies to supercharge your productivity.
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
                            <Zap className="w-7 h-7 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Experience real-time messaging with zero latency. Your team is always perfectly in sync.
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6">
                            <Users className="w-7 h-7 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Infinite Scale</h3>
                        <p className="text-slate-400 leading-relaxed">
                            From small startups to massive enterprises, create unlimited workspaces and channels.
                        </p>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="max-w-4xl mx-auto mt-32 text-center bg-gradient-to-tr from-purple-900/40 to-blue-900/40 rounded-[3rem] p-12 border border-white/10 backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm pointer-events-none"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold text-white mb-6">Ready to transform your workflow?</h2>
                        <p className="text-xl text-slate-300 mb-10">Join thousands of teams already using SlackApp.</p>
                        <Button
                            size="lg"
                            className="h-14 px-10 text-lg rounded-full bg-white text-black hover:bg-slate-200 transition-colors"
                            onClick={() => navigate('/auth/signup')}
                        >
                            Create a Workspace
                        </Button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md py-12 flex items-center justify-center  z-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
                            S
                        </div>
                        <span className="font-semibold text-slate-300">SlackApp © 2026 || All Rights Reserved </span>
                    </div>

                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
