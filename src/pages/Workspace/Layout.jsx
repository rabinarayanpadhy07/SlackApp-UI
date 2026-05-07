import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { UnifiedWorkspaceSidebar } from '@/components/organisms/Workspace/UnifiedWorkspaceSidebar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ThreadContextProvider, useThread } from '@/context/ThreadContext';
import { ThreadPanel } from '@/components/organisms/Workspace/ThreadPanel';
import { Button } from '@/components/ui/button';

const WorkspaceLayoutContent = ({ children }) => {
    const { activeThreadMessageId } = useThread();
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

    return (
        <div className="flex h-screen bg-[#0a0a0a] overflow-hidden font-sans text-slate-200 relative">
            {/* Ambient Background */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Desktop Sidebar (Flush Left) */}
            <div className="hidden md:block z-20 h-full border-r border-white/5">
                <UnifiedWorkspaceSidebar />
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
                            <UnifiedWorkspaceSidebar />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden absolute top-2 left-2 z-30">
                <Button
                    variant="transparent"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="text-slate-300 hover:text-white bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-md border border-white/10"
                >
                    <Menu className="w-5 h-5" />
                </Button>
            </div>

            {/* Main Dark Chat Container (Edge to Edge) */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
                <ResizablePanelGroup direction="horizontal" autoSaveId={'workspace-resize'} className="h-full">
                    <ResizablePanel
                        minSize={30}
                        defaultSize={activeThreadMessageId ? 60 : 100}
                        className="overflow-hidden bg-[#0a0a0a]"
                    >
                        <div className="h-full flex flex-col w-full relative">
                            {children}
                        </div>
                    </ResizablePanel>
                    
                    {activeThreadMessageId && (
                        <>
                            <ResizableHandle withHandle className="w-1.5 bg-white/5 flex flex-col items-center justify-center hover:bg-purple-500/50 transition-colors border-x border-white/5" />
                            <ResizablePanel
                                defaultSize={40}
                                minSize={20}
                                className="overflow-hidden bg-[#13151a]"
                            >
                                <ThreadPanel />
                            </ResizablePanel>
                        </>
                    )}
                </ResizablePanelGroup>
            </div>
        </div>
    );
};

export const WorkspaceLayout = ({ children }) => {
    return (
        <ThreadContextProvider>
            <WorkspaceLayoutContent>
                {children}
            </WorkspaceLayoutContent>
        </ThreadContextProvider>
    );
};