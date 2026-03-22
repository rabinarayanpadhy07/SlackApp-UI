import { WorkspaceNavbar } from '@/components/organisms/Workspace/WorkspaceNavbar';
import { WorkspacePanel } from '@/components/organisms/Workspace/WorkspacePanel';
import { WorkspaceSidebar } from '@/components/organisms/Workspace/WorkspaceSidebar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ThreadContextProvider, useThread } from '@/context/ThreadContext';
import { ThreadPanel } from '@/components/organisms/Workspace/ThreadPanel';

const WorkspaceLayoutContent = ({ children }) => {
    const { activeThreadMessageId } = useThread();

    return (
        <div className="h-[100vh] bg-[#481349] flex flex-col overflow-hidden font-sans">
            <WorkspaceNavbar />
            <div className="flex flex-1 overflow-hidden pb-2 pr-2">
                <WorkspaceSidebar />
                <ResizablePanelGroup direction="horizontal" autoSaveId={'workspace-resize'}>
                    <ResizablePanel
                        defaultSize={20}
                        minSize={11}
                        className='bg-[#481349] text-white/90'
                    >
                        <WorkspacePanel />
                    </ResizablePanel>
                    <ResizableHandle withHandle className="w-1.5 bg-transparent flex flex-col items-center justify-center transition-colors" />
                    <ResizablePanel
                        minSize={20}
                        defaultSize={activeThreadMessageId ? 50 : 80}
                        className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg border border-black/5 dark:border-white/5 overflow-hidden"
                    >
                        <div className="h-full overflow-y-auto">
                            {children}
                        </div>
                    </ResizablePanel>
                    {activeThreadMessageId && (
                        <>
                            <ResizableHandle withHandle className="w-1.5 bg-transparent flex flex-col items-center justify-center" />
                            <ResizablePanel
                                defaultSize={30}
                                minSize={20}
                                className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg border border-black/5 dark:border-white/5 overflow-hidden"
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