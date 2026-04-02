import { useQueryClient } from '@tanstack/react-query';
import { MoreVerticalIcon, ShieldAlertIcon, ShieldCheckIcon, TrashIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRemoveMemberFromWorkspace } from '@/hooks/apis/workspaces/useRemoveMemberFromWorkspace';
import { useUpdateMemberRole } from '@/hooks/apis/workspaces/useUpdateMemberRole';
import { useAuth } from '@/hooks/context/useAuth';
import { useConfirm } from '@/hooks/useConfirm';

export const WorkspaceMembersModal = ({ open, setOpen, workspace }) => {
    const queryClient = useQueryClient();
    const { auth } = useAuth();
    const [workspaceId, setWorkspaceId] = useState(null);

    const { removeMemberMutation, isPending: isRemoving } = useRemoveMemberFromWorkspace(workspaceId);
    const { updateMemberRoleMutation, isPending: isUpdatingRole } = useUpdateMemberRole(workspaceId);
    
    const { confirmation, ConfirmDialog } = useConfirm({
        title: 'Remove Member',
        message: 'Are you sure you want to remove this member from the workspace?'
    });

    const { confirmation: roleConfirmation, ConfirmDialog: RoleConfirmDialog } = useConfirm({
        title: 'Change Member Role',
        message: 'Are you sure you want to change this member\'s role?'
    });

    useEffect(() => {
        setWorkspaceId(workspace?._id);
    }, [workspace]);

    const handleRoleChange = async (memberId, newRole) => {
        const ok = await roleConfirmation();
        if (!ok) return;

        try {
            await updateMemberRoleMutation({ memberId, role: newRole }, {
                onSuccess: () => {
                    toast.success('Member role updated');
                    queryClient.invalidateQueries(`fetchWorkspaceById-${workspace?._id}`);
                },
                onError: (err) => {
                    toast.error('Failed to update role', { description: err.message });
                }
            });
        } catch(err) {
            console.error(err);
        }
    };

    const handleRemoveMember = async (memberId) => {
        const ok = await confirmation();
        if (!ok) return;

        try {
            await removeMemberMutation(memberId, {
                onSuccess: () => {
                    toast.success('Member removed');
                    queryClient.invalidateQueries(`fetchWorkspaceById-${workspace?._id}`);
                },
                onError: (err) => {
                    toast.error('Failed to remove member', { description: err.message });
                }
            });
        } catch (err) {
            console.error(err);
        }
    };

    const isCurrentUserAdmin = workspace?.members?.some(
        m => m.memberId?._id === auth?.user?._id && m.role === 'admin'
    );
    const ownerId = (workspace?.ownerId?._id || workspace?.ownerId || workspace?.members?.find((member) => member.role === 'admin')?.memberId?._id)?.toString();
    const isCurrentUserOwner = ownerId === auth?.user?._id;

    return (
        <>
            <ConfirmDialog />
            <RoleConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='max-w-xl'>
                    <DialogHeader>
                        <DialogTitle>Manage Workspace Members</DialogTitle>
                    </DialogHeader>

                    <div className='flex flex-col gap-y-4 max-h-[60vh] overflow-y-auto px-1'>
                        {workspace?.members?.map((member) => (
                            <div key={member.memberId?._id} className='flex items-center justify-between p-3 border rounded-lg bg-gray-50'>
                                <div className='flex items-center gap-x-3'>
                                    <img 
                                        src={member.memberId?.avatar || 'https://github.com/shadcn.png'} 
                                        alt='avatar' 
                                        className='w-10 h-10 rounded-md'
                                    />
                                    <div className='flex flex-col'>
                                        <p className='font-semibold text-sm'>
                                            {member.memberId?.username}
                                            {member.memberId?._id === auth?.user?._id && ' (You)'}
                                        </p>
                                        <p className='text-xs text-muted-foreground flex items-center gap-x-1'>
                                            {member.memberId?._id === ownerId && (
                                                <span className='rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-purple-700'>
                                                    Owner
                                                </span>
                                            )}
                                            {member.role === 'admin' ? (
                                                <><ShieldCheckIcon className='w-3 h-3 text-emerald-500' /> Admin</>
                                            ) : (
                                                <><ShieldAlertIcon className='w-3 h-3 text-orange-400' /> Member</>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                
                                {isCurrentUserAdmin && member.memberId?._id !== auth?.user?._id && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                                                <MoreVerticalIcon className='h-4 w-4' />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            {isCurrentUserOwner ? (
                                                member.role === 'admin' ? (
                                                <DropdownMenuItem 
                                                    onClick={() => handleRoleChange(member.memberId?._id, 'member')}
                                                    disabled={isUpdatingRole || isRemoving || member.memberId?._id === ownerId}
                                                >
                                                    Demote to Member
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem 
                                                    onClick={() => handleRoleChange(member.memberId?._id, 'admin')}
                                                    disabled={isUpdatingRole || isRemoving}
                                                >
                                                    Promote to Admin
                                                </DropdownMenuItem>
                                            )
                                            ) : null}
                                            <DropdownMenuItem 
                                                className='text-red-500 hover:text-red-600 focus:text-red-600'
                                                onClick={() => handleRemoveMember(member.memberId?._id)}
                                                disabled={isUpdatingRole || isRemoving || member.memberId?._id === ownerId || (member.role === 'admin' && !isCurrentUserOwner)}
                                            >
                                                <TrashIcon className='w-4 h-4 mr-2' />
                                                Remove from Workspace
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
