import { WorkspaceNavbar } from '@/components/organisms/Workspace/WorkspaceNavbar';
import { WorkspacePanel } from '@/components/organisms/Workspace/WorkspacePanel';
import { WorkspaceSidebar } from '@/components/organisms/Workspace/WorkspaceSidebar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ThreadContextProvider, useThread } from '@/context/ThreadContext';
import { ThreadPanel } from '@/components/organisms/Workspace/ThreadPanel';

const WorkspaceLayoutContent = ({ children }) => {
    const { activeThreadMessageId } = useThread();

    return (
        <div className="h-[100vh]">
            <WorkspaceNavbar />
            <div className="flex h-[calc(100vh-40px)]">
                <WorkspaceSidebar />
                <ResizablePanelGroup direction="horizontal" autoSaveId={'workspace-resize'}>
                    <ResizablePanel
                        defaultSize={20}
                        minSize={11}
                        className='bg-slack-medium'
                    >
                        <WorkspacePanel />
                    </ResizablePanel>
                    <ResizableHandle withHandle/>
                    <ResizablePanel
                        minSize={20}
                        defaultSize={activeThreadMessageId ? 50 : 80}
                    >
                        {children}
                    </ResizablePanel>
                    {activeThreadMessageId && (
                        <>
                            <ResizableHandle withHandle />
                            <ResizablePanel
                                defaultSize={30}
                                minSize={20}
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