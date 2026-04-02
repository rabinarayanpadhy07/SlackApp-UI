import { useQueryClient } from '@tanstack/react-query';
import { FaChevronDown } from 'react-icons/fa';
import { Headphones, PencilIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { useDeleteChannel } from '@/hooks/apis/channels/useDeleteChannel';
import { useUpdateChannel } from '@/hooks/apis/channels/useUpdateChannel';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/context/useAuth';
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace';
import { useConfirm } from '@/hooks/useConfirm';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

export const ChannelHeader = ({ name, channelId, isHuddleActive, startHuddle, isHuddleLiveInChannel }) => {
    const navigate = useNavigate();
    const { workspaceId } = useParams();
    const queryClient = useQueryClient();
    const { auth } = useAuth();
    const { currentWorkspace, setCurrentWorkspace } = useCurrentWorkspace();
    const { deleteChannelMutation, isPending } = useDeleteChannel();
    const { updateChannelMutation, isPending: isUpdatingChannel } = useUpdateChannel();
    const { confirmation, ConfirmDialog } = useConfirm({
        title: 'Delete channel',
        message: 'This will permanently remove the channel and its messages.'
    });
    const [editName, setEditName] = useState(name || '');
    const [isEditingName, setIsEditingName] = useState(false);

    const isAdmin = currentWorkspace?.members?.some(
        (member) => member.memberId?._id === auth?.user?._id && member.role === 'admin'
    );
    const channelCount = currentWorkspace?.channels?.length || 0;

    useEffect(() => {
        setEditName(name || '');
    }, [name]);

    async function handleRenameChannel(e) {
        e.preventDefault();

        try {
            const response = await updateChannelMutation({
                channelId,
                channelName: editName.trim()
            });

            setCurrentWorkspace((previous) => previous ? {
                ...previous,
                channels: previous.channels?.map((channel) =>
                    channel._id === channelId ? { ...channel, name: response.name } : channel
                ) || []
            } : previous);
            queryClient.setQueryData([`fetchWorkspaceById-${workspaceId}`], (previous) => previous ? {
                ...previous,
                channels: previous.channels?.map((channel) =>
                    channel._id === channelId ? { ...channel, name: response.name } : channel
                ) || []
            } : previous);
            queryClient.setQueryData([`get-channel-${channelId}`], (previous) => previous ? {
                ...previous,
                name: response.name
            } : previous);
            queryClient.invalidateQueries({ queryKey: [`fetchWorkspaceById-${workspaceId}`] });
            queryClient.invalidateQueries({ queryKey: [`get-channel-${channelId}`] });

            setIsEditingName(false);
            toast.success('Channel renamed successfully');
        } catch (error) {
            toast.error('Unable to rename channel', {
                description: getApiErrorMessage(error, 'Please try again.')
            });
        }
    }

    async function handleDeleteChannel() {
        const ok = await confirmation();
        if (!ok) return;

        try {
            const response = await deleteChannelMutation({ channelId });
            const nextChannels = currentWorkspace?.channels?.filter((channel) => channel._id !== channelId) || [];

            setCurrentWorkspace((previous) => previous ? {
                ...previous,
                channels: previous.channels?.filter((channel) => channel._id !== channelId) || []
            } : previous);
            queryClient.setQueryData([`fetchWorkspaceById-${workspaceId}`], (previous) => previous ? {
                ...previous,
                channels: previous.channels?.filter((channel) => channel._id !== channelId) || []
            } : previous);
            queryClient.invalidateQueries({ queryKey: [`fetchWorkspaceById-${workspaceId}`] });
            queryClient.invalidateQueries({ queryKey: ['unreadChannels', workspaceId] });
            queryClient.removeQueries({ queryKey: [`get-channel-${channelId}`] });

            toast.success('Channel deleted successfully');
            navigate(
                response?.nextChannelId
                    ? `/workspaces/${workspaceId}/channels/${response.nextChannelId}`
                    : nextChannels[0]?._id
                        ? `/workspaces/${workspaceId}/channels/${nextChannels[0]._id}`
                        : `/workspaces/${workspaceId}`,
                { replace: true }
            );
        } catch (error) {
            toast.error('Unable to delete channel', {
                description: getApiErrorMessage(error, 'Please try again.')
            });
        }
    }

    return (
        <>
        <ConfirmDialog />
        <div
            className="bg-white border-b h-[50px] flex items-center justify-between px-4 overflow-hidden w-full"
        >
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        className="text-lg font-semibold px-2 w-auto overflow-hidden"
                    >
                        <span># {name} </span>
                        <FaChevronDown className='size-3 ml-2' />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            # {name}
                        </DialogTitle>

                    </DialogHeader>
                    <div
                        className='px-4 pb-4 flex flex-col gap-y-2'
                    >
                        {isAdmin ? (
                            <button
                                className='flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50'
                                onClick={handleDeleteChannel}
                                disabled={isPending || isUpdatingChannel || channelCount <= 1}
                            >
                                <Trash2Icon className='size-4 text-red-500' />
                                <div className='flex flex-col items-start'>
                                    <p className='text-sm font-semibold text-red-600'>
                                        Delete channel
                                    </p>
                                    <p className='text-xs text-muted-foreground'>
                                        {channelCount <= 1 ? 'At least one channel must remain in the workspace.' : 'Remove this channel and its messages.'}
                                    </p>
                                </div>
                            </button>
                        ) : null}

                        {isAdmin ? (
                            <form className='space-y-3 rounded-lg border bg-slate-50 px-5 py-4' onSubmit={handleRenameChannel}>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-sm font-semibold text-slate-900'>Channel name</p>
                                        <p className='text-xs text-muted-foreground'>Rename this channel for everyone in the workspace.</p>
                                    </div>
                                    <Button
                                        type='button'
                                        variant='ghost'
                                        size='sm'
                                        className='h-8 px-2 text-slate-600'
                                        onClick={() => setIsEditingName((previous) => !previous)}
                                    >
                                        <PencilIcon className='mr-2 size-3.5' />
                                        {isEditingName ? 'Close' : 'Edit'}
                                    </Button>
                                </div>

                                {isEditingName ? (
                                    <>
                                        <Input
                                            value={editName}
                                            onChange={(event) => setEditName(event.target.value)}
                                            minLength={3}
                                            maxLength={50}
                                            required
                                            disabled={isUpdatingChannel || isPending}
                                            placeholder='Channel name e.g. design-team'
                                        />
                                        <DialogFooter className='sm:justify-start'>
                                            <Button
                                                type='button'
                                                variant='outline'
                                                onClick={() => {
                                                    setEditName(name || '');
                                                    setIsEditingName(false);
                                                }}
                                                disabled={isUpdatingChannel || isPending}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type='submit'
                                                disabled={isUpdatingChannel || isPending || editName.trim().length < 3 || editName.trim() === name}
                                            >
                                                {isUpdatingChannel ? 'Saving...' : 'Save channel name'}
                                            </Button>
                                        </DialogFooter>
                                    </>
                                ) : (
                                    <p className='text-sm text-slate-700'># {name}</p>
                                )}
                            </form>
                        ) : (
                            <div className='rounded-lg border bg-slate-50 px-5 py-4'>
                                <p className='text-sm font-semibold text-slate-900'>Channel name</p>
                                <p className='mt-2 text-sm text-slate-700'># {name}</p>
                            </div>
                        )}

                    </div>
                </DialogContent>
            </Dialog>

            {/* Huddle Interactive Toggle */}
            <div className="flex items-center gap-2">
                {!isHuddleActive && !isHuddleLiveInChannel && (
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={startHuddle}
                        className="h-8 text-xs font-semibold rounded-full border-sky-400/60 text-sky-600 hover:bg-sky-50 hover:text-sky-700 transition"
                    >
                        <Headphones className="size-3.5 mr-2" />
                        Start Huddle
                    </Button>
                )}
                {!isHuddleActive && isHuddleLiveInChannel && (
                    <Button 
                        size="sm" 
                        onClick={startHuddle}
                        className="h-8 text-xs font-semibold rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2 px-3"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        Join Huddle
                    </Button>
                )}
                {isHuddleActive && (
                    <span className="flex items-center gap-2 text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full ring-1 ring-green-400">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        In Huddle...
                    </span>
                )}
            </div>

        </div>
        </>
    );
};
