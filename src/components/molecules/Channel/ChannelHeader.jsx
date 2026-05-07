import { useQueryClient } from '@tanstack/react-query';
import { FaChevronDown } from 'react-icons/fa';
import { Headphones, PencilIcon, Trash2Icon, SearchIcon, ShieldIcon } from 'lucide-react';
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
import { SearchModal } from '@/components/organisms/Search/SearchModal';

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
    const [searchOpen, setSearchOpen] = useState(false);

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
        <SearchModal open={searchOpen} setOpen={setSearchOpen} workspace={currentWorkspace} />
        <div
            className="bg-transparent border-b border-white/5 h-[56px] flex items-center justify-between px-4 w-full text-slate-200 pl-14 md:pl-4"
        >
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        className="text-lg font-semibold px-2 w-auto max-w-[150px] md:max-w-[300px] hover:bg-white/5 transition-colors"
                    >
                        <span className="truncate"># {name} </span>
                        <FaChevronDown className='size-3 ml-2 shrink-0 text-slate-400' />
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#13151a] text-slate-200 border-white/10">
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
                                className='flex items-center gap-x-2 px-5 py-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors disabled:cursor-not-allowed disabled:opacity-50'
                                onClick={handleDeleteChannel}
                                disabled={isPending || isUpdatingChannel || channelCount <= 1}
                            >
                                <Trash2Icon className='size-4 text-red-400' />
                                <div className='flex flex-col items-start'>
                                    <p className='text-sm font-semibold text-red-400'>
                                        Delete channel
                                    </p>
                                    <p className='text-xs text-slate-400'>
                                        {channelCount <= 1 ? 'At least one channel must remain in the workspace.' : 'Remove this channel and its messages.'}
                                    </p>
                                </div>
                            </button>
                        ) : null}

                        {isAdmin ? (
                            <form className='space-y-3 rounded-lg border border-white/10 bg-white/5 px-5 py-4' onSubmit={handleRenameChannel}>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-sm font-semibold text-slate-200'>Channel name</p>
                                        <p className='text-xs text-slate-400'>Rename this channel for everyone in the workspace.</p>
                                    </div>
                                    <Button
                                        type='button'
                                        variant='ghost'
                                        size='sm'
                                        className='h-8 px-2 text-slate-400 hover:text-white hover:bg-white/10'
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
                                            className="bg-[#0a0a0a] border-white/10 text-white focus-visible:ring-purple-500"
                                            placeholder='Channel name e.g. design-team'
                                        />
                                        <DialogFooter className='sm:justify-start'>
                                            <Button
                                                type='button'
                                                variant='outline'
                                                className="border-white/10 bg-transparent hover:bg-white/10 text-slate-300"
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
                                                className="bg-purple-600 hover:bg-purple-500 text-white"
                                                disabled={isUpdatingChannel || isPending || editName.trim().length < 3 || editName.trim() === name}
                                            >
                                                {isUpdatingChannel ? 'Saving...' : 'Save channel name'}
                                            </Button>
                                        </DialogFooter>
                                    </>
                                ) : (
                                    <p className='text-sm text-slate-300'># {name}</p>
                                )}
                            </form>
                        ) : (
                            <div className='rounded-lg border border-white/10 bg-white/5 px-5 py-4'>
                                <p className='text-sm font-semibold text-slate-200'>Channel name</p>
                                <p className='mt-2 text-sm text-slate-300'># {name}</p>
                            </div>
                        )}

                    </div>
                </DialogContent>
            </Dialog>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
                
                {/* Search Icon */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchOpen(true)}
                    className="h-8 w-8 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <SearchIcon className="size-4" />
                </Button>

                {/* Shield Admin Icon */}
                {auth?.user?.isSuperAdmin && (
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => navigate('/admin')}
                        className="h-8 w-8 rounded-md text-amber-500/80 hover:text-amber-400 hover:bg-white/10 transition-colors"
                    >
                        <ShieldIcon className='size-4' />
                    </Button>
                )}

                {/* Huddle Interactive Toggle */}
                <div className="ml-2">
                    {!isHuddleActive && !isHuddleLiveInChannel && (
                        <Button 
                            size="sm" 
                            onClick={startHuddle}
                            className="h-8 px-3 sm:px-4 text-xs font-semibold rounded-md bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all flex items-center"
                        >
                            <Headphones className="size-3.5 sm:mr-2 shrink-0" />
                            <span className="hidden sm:inline">Start Huddle</span>
                        </Button>
                    )}
                    {!isHuddleActive && isHuddleLiveInChannel && (
                        <Button 
                            size="sm" 
                            onClick={startHuddle}
                            className="h-8 px-3 sm:px-4 text-xs font-semibold rounded-md bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2"
                        >
                            <span className="relative flex h-2 w-2 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            <span className="hidden sm:inline">Join Huddle</span>
                        </Button>
                    )}
                    {isHuddleActive && (
                        <span className="flex items-center gap-2 text-xs font-bold text-green-400 bg-green-500/10 px-3 py-1.5 rounded-md border border-green-500/20">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            In Huddle...
                        </span>
                    )}
                </div>
            </div>

        </div>
        </>
    );
};
