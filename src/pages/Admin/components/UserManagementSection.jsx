import { Button } from '@/components/ui/button';
import { innerCardClass } from '../utils/adminDashboardUtils';
import { AdminEmptyState } from './AdminEmptyState';
import { AdminPagination } from './AdminPagination';
import { AdminPill } from './AdminPill';
import { AdminSectionCard } from './AdminSectionCard';
import { formatDate } from '../utils/adminDashboardUtils';

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
        description="Plan upgrades, super admin access, and suspension control."
    >
        {users.length === 0 && (
            <AdminEmptyState
                title="No matching users"
                description="Try a different search term."
            />
        )}

        {users.map((user) => (
            <div key={user._id} className={innerCardClass}>
                <div className="flex flex-col gap-4 p-5 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-[#311333]">{user.username}</p>
                            <AdminPill tone={user.plan === 'Paid' ? 'amber' : 'slate'}>
                                {user.plan}
                            </AdminPill>
                            {user.isSuperAdmin && <AdminPill tone="sky">Super Admin</AdminPill>}
                            <AdminPill tone={user.isActive ? 'emerald' : 'rose'}>
                                {user.isActive ? 'Active' : 'Suspended'}
                            </AdminPill>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{user.email}</p>
                        <p className="mt-1 text-xs text-slate-500">
                            {user.workspaceCount} workspaces | {user.ownedWorkspaceCount} owned |
                            joined {formatDate(user.createdAt)}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            size="sm"
                            className="rounded-full bg-[#4a154b] text-white hover:bg-[#611f69]"
                            onClick={() => onTogglePlan(user)}
                            disabled={isUpdating}
                        >
                            {user.plan === 'Paid' ? 'Set Normal' : 'Set Paid'}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full border-[#d7c8da] bg-white text-[#4a154b] hover:bg-[#f8f1f8]"
                            onClick={() => onToggleAdmin(user)}
                            disabled={isUpdating}
                        >
                            {user.isSuperAdmin ? 'Remove Admin' : 'Make Admin'}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full border-[#f2c6d3] bg-white text-[#b11b56] hover:bg-[#fff1f5]"
                            onClick={() => onToggleStatus(user)}
                            disabled={isUpdating}
                        >
                            {user.isActive ? 'Suspend User' : 'Restore User'}
                        </Button>
                    </div>
                </div>
            </div>
        ))}

        <AdminPagination pagination={pagination} onPageChange={onPageChange} />
    </AdminSectionCard>
);
