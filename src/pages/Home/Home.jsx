import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';

import { useAuth } from '@/hooks/context/useAuth';
import { useFetchWorkspace } from '@/hooks/apis/workspaces/useFetchWorkspace';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopNavbar } from '@/components/dashboard/TopNavbar';
import { WelcomeHero } from '@/components/dashboard/WelcomeHero';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentWorkspaces } from '@/components/dashboard/RecentWorkspaces';

export const Home = () => {
    const { auth } = useAuth();
    const { isFetching, workspaces } = useFetchWorkspace();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    if (auth?.isLoading || isFetching) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-6">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const firstWorkspace = workspaces?.length > 0 ? workspaces[0] : null;

    return (
        <div className="flex h-screen bg-[#0a0a0a] overflow-hidden text-slate-200">
            {/* Desktop Sidebar */}
            <div className="hidden md:block z-20">
                <Sidebar workspaces={workspaces} />
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                            className="fixed inset-y-0 left-0 z-50 md:hidden shadow-2xl"
                        >
                            <Sidebar workspaces={workspaces} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Background Ambient Glows */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

                {/* Mobile Header with Menu Toggle */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md z-30">
                    <div className="flex items-center space-x-3">
                        {firstWorkspace && (
                            <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                {firstWorkspace.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className="font-semibold text-white">
                            {firstWorkspace ? firstWorkspace.name : 'Workspaces'}
                        </span>
                    </div>
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 bg-white/5 rounded-lg text-slate-300 hover:text-white"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                {/* Desktop Top Navbar */}
                <div className="hidden md:block z-30">
                    <TopNavbar user={auth?.user} />
                </div>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 z-10">
                    <div className="max-w-7xl mx-auto">
                        <WelcomeHero user={auth?.user} />
                        <QuickActions />
                        
                        <div className="mt-8">
                            <RecentWorkspaces workspaces={workspaces} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Home;