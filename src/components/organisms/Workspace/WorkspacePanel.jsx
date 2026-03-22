import { AlertTriangleIcon, HashIcon, MessageSquareTextIcon, SendHorizonalIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { SideBarItem } from '@/components/atoms/SideBarItem/SideBarItem';
import { UserItem } from '@/components/atoms/UserItem/UserItem';
import { WorkspacePanelHeader } from '@/components/molecules/Workspace/WorkspacePanelHeader';
import { WorkspacePanelSection } from '@/components/molecules/Workspace/WorkspacePanelSection';
import { Skeleton } from '../../ui/skeleton';
import { useGetWorkspaceById } from '@/hooks/apis/workspaces/useGetWorkspaceById';
import { useCreateChannelModal } from '@/hooks/context/useCreateChannelModal';
import { useGetUnreadChannels } from '@/hooks/apis/read-receipts/useGetUnreadChannels';

export const WorkspacePanel = () => {

    const { workspaceId } = useParams();

    const { setOpenCreateChannelModal } = useCreateChannelModal();
    const { workspace, isFetching, isSuccess } = useGetWorkspaceById(workspaceId);
    const { unreadMap } = useGetUnreadChannels(workspaceId);

    if(isFetching) {

        return (
            <div
                className='flex flex-col gap-y-4 h-full bg-[#481349] p-4'
            >
                <Skeleton className='h-10 w-full bg-white/20 rounded-md' />
                <div className='flex flex-col gap-y-2 mt-4'>
                    <Skeleton className='h-6 w-[80%] bg-white/10' />
                    <Skeleton className='h-6 w-[60%] bg-white/10' />
                    <Skeleton className='h-6 w-[70%] bg-white/10' />
                    <Skeleton className='h-6 w-[50%] bg-white/10' />
                </div>
            </div>
        );
    }

    if(!isSuccess) {
        return (
            <div
                className='flex flex-col gap-y-2 h-full items-center justify-center text-white'
            >
                <AlertTriangleIcon className='size-6 text-white' />
                Something went wrong
            </div>
        );
    }

    return (
        <div
            className="flex flex-col h-full bg-[#481349]"
        >
            <WorkspacePanelHeader workspace={workspace} />

            <div
                className='flex flex-col px-2 mt-3'
            >
                <SideBarItem 
                    label="Threads"
                    icon={MessageSquareTextIcon}
                    to={`/workspaces/${workspaceId}/threads`}
                    variant='active'
                />
                <SideBarItem 
                    label="Drafts & Sends"
                    icon={SendHorizonalIcon}
                    to={`/workspaces/${workspaceId}/drafts`}
                    variant='default'
                />
            </div>

            <WorkspacePanelSection
                label={'Channels'}
                onIconClick={() => {setOpenCreateChannelModal(true);}}
            >
                {workspace?.channels?.map((channel) => {
                    return <SideBarItem 
                        key={channel._id} 
                        icon={HashIcon} 
                        label={channel.name} 
                        id={channel._id} 
                        unreadCount={unreadMap?.[channel._id] || 0}
                    />;
                })}
            </WorkspacePanelSection>

            <WorkspacePanelSection
                label="Direct messages"
                onIconClick={() => {}}
            >
                {workspace?.members?.map((item) => {
                    const memberId = item.memberId;
                    if (!memberId) return null;
                    return <UserItem key={memberId._id} label={memberId.username} id={memberId._id} image={memberId.avatar} />;
                })}
            </WorkspacePanelSection>
        </div>
    );
};