import { Crown, ShieldCheck, ShieldX, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatDate, getInitials, innerCardClass } from '../utils/adminDashboardUtils';
import { AdminEmptyState } from './AdminEmptyState';
import { AdminPagination } from './AdminPagination';
import { AdminPill } from './AdminPill';
import { AdminSectionCard } from './AdminSectionCard';

export const UserManagementSection = ({
    users,
    pagination,
    onPageChange,
    isUpdating,
    onTogglePlan,
    onToggleAdmin,
    onToggleStatus
}) => (
    <AdminSectionCard
        title="User Administration"
        description="Manage subscription status, elevated permissions, and account health with clearer controls."
    >
        {users.length === 0 && (
            <AdminEmptyState
                title="No matching users"
                description="Try a different search term to locate the account you want to manage."
            />
        )}

        {users.map((user) => (
            <div key={user._id} className={innerCardClass}>
                <div className="flex min-w-0 flex-col gap-5 p-5 xl:flex-row xl:items-center xl:justify-between 2xl:gap-8">
                    <div className="flex items-start gap-4">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-[22px] border border-[#36C5F0]/30 bg-[#36C5F0]/12 text-sm font-semibold text-[#a5e9fc]">
                            {getInitials(user.username || user.email)}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="text-lg font-semibold text-[#f8f8f8]">{user.username}</p>
                                <AdminPill tone={user.plan === 'Paid' ? 'amber' : 'slate'}>
                                    {user.plan}
                                </AdminPill>
                                {user.isSuperAdmin && <AdminPill tone="sky">Super Admin</AdminPill>}
                                <AdminPill tone={user.isActive ? 'emerald' : 'rose'}>
                                    {user.isActive ? 'Active' : 'Suspended'}
                                </AdminPill>
                            </div>
                            <p className="mt-2 text-sm text-[#c9b8cc]">{user.email}</p>
                            <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em] text-[#a49ba8]">
                                <span>{user.workspaceCount} workspaces</span>
                                <span>{user.ownedWorkspaceCount} owned</span>
                                <span>Joined {formatDate(user.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex min-w-0 flex-wrap gap-2 xl:max-w-[min(100%,28rem)] xl:justify-end 2xl:max-w-none 2xl:flex-1 2xl:justify-end">
                        <Button
                            size="sm"
                            className="rounded-full bg-[linear-gradient(90deg,#611f69,#2EB67D)] text-white hover:opacity-95"
                            onClick={() => onTogglePlan(user)}
                            disabled={isUpdating}
                        >
                            <Sparkles className="size-4" />
                            {user.plan === 'Paid' ? 'Set Normal' : 'Set Paid'}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full border-[#611f69]/35 bg-[#350d36]/40 text-[#ebe6ed] hover:bg-[#611f69]/25"
                            onClick={() => onToggleAdmin(user)}
                            disabled={isUpdating}
                        >
                            <Crown className="size-4 text-[#ECB22E]" />
                            {user.isSuperAdmin ? 'Remove Admin' : 'Make Admin'}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full border-[#611f69]/35 bg-[#350d36]/40 text-[#ebe6ed] hover:bg-[#611f69]/25"
                            onClick={() => onToggleStatus(user)}
                            disabled={isUpdating}
                        >
                            {user.isActive ? (
                                <ShieldX className="size-4 text-[#fb9fb8]" />
                            ) : (
                                <ShieldCheck className="size-4 text-[#7dccb0]" />
                            )}
                            {user.isActive ? 'Suspend User' : 'Restore User'}
                        </Button>
                    </div>
                </div>
            </div>
        ))}

        <AdminPagination pagination={pagination} onPageChange={onPageChange} />
    </AdminSectionCard>
);
