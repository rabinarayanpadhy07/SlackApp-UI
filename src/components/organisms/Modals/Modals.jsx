import { CreateChannelModal } from '@/components/molecules/CreateChannelModal/CreateChannelModal';
import { CreateWorkspaceModal } from '@/components/molecules/CreateWorkspaceModal/CreateWorkspaceModal';
import { UserSettingsModal } from '@/components/molecules/UserSettingsModal/UserSettingsModal';
import { WorkspacePreferencesModal } from '@/components/molecules/Workspace/WorkspacePreferencesModal';

export const Modals = () => {
    return (
        <>
            <CreateWorkspaceModal />
            <UserSettingsModal />
            <WorkspacePreferencesModal />
            <CreateChannelModal />
        </>
    );
};
