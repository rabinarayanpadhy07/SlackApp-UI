import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAddChannelToWorkspace } from '@/hooks/apis/workspaces/useAddChannelToWorkspace';
import { useCreateChannelModal } from '@/hooks/context/useCreateChannelModal';
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

export const CreateChannelModal = () => {

    const queryClient = useQueryClient();
    
    const { openCreateChannelModal, setOpenCreateChannelModal } = useCreateChannelModal();

    const [channelName, setChannelName] = useState('');

    const { addChannelToWorkspaceMutation, isPending } = useAddChannelToWorkspace();

    const {currentWorkspace} = useCurrentWorkspace();

    function handleClose() {
        setOpenCreateChannelModal(false);
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const workspaceId = currentWorkspace?._id;
        if (!workspaceId) {
            toast.error('Workspace not found.');
            return;
        }

        try {
            await addChannelToWorkspaceMutation({
                channelName: channelName.trim(),
                workspaceId
            });
            toast.success('Channel created successfully');
            queryClient.invalidateQueries({ queryKey: [`fetchWorkspaceById-${workspaceId}`] });
            setChannelName('');
            handleClose();
        } catch (error) {
            toast.error('Failed to create channel', {
                description: getApiErrorMessage(error, 'Please try again.')
            });
        }
    }

    return (
        <Dialog
            open={openCreateChannelModal}
            onOpenChange={handleClose}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a channel</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleFormSubmit}>
                    <Input 
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        minLength={3}
                        placeholder="Channel Name e.g. team-announcements"
                        required
                        disabled={isPending}
                    />

                    <div className='flex justify-end mt-4'>
                        <Button disabled={isPending}>
                            {isPending ? 'Creating...' : 'Create Channel'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
            
        </Dialog>
    );
};
