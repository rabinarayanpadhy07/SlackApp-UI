import { Archive, ArchiveRestore, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    formatDate,
    innerCardClass
} from '../utils/adminDashboardUtils';
import { AdminEmptyState } from './AdminEmptyState';
import { AdminPagination } from './AdminPagination';
import { AdminPill } from './AdminPill';
import { AdminSectionCard } from './AdminSectionCard';

export const WorkspaceOperationsSection = ({
    workspaces,
    pagination,
    onPageChange,
    isUpdating,
    isDeleting,
    onToggleArchive,
    onDelete
}) => (
    <AdminSectionCard
        title="Workspace Operations"
        description="Archive, restore, or permanently delete workspaces."
        contentClassName="grid gap-4 xl:grid-cols-2"
    >
        {workspaces.length === 0 && (
            <div className="xl:col-span-2">
                <AdminEmptyState
                    title="No matching workspaces"
                    description="Try a different search term."
                />
            </div>
        )}

        {workspaces.map((workspace) => (
            <div key={workspace._id} className={innerCardClass}>
                <div className="flex h-full flex-col p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold text-[#311333]">{workspace.name}</p>
                                <AdminPill tone={workspace.isArchived ? 'amber' : 'emerald'}>
                                    {workspace.isArchived ? 'Archived' : 'Active'}
                                </AdminPill>
                            </div>
                            <p className="mt-2 text-sm text-slate-600">
                                {workspace.description || 'No description yet.'}
                            </p>
                        </div>

                        <Button
                            size="iconSm"
                            variant="ghost"
                            className="text-rose-600 hover:text-rose-700"
                            onClick={() => onDelete(workspace._id)}
                            disabled={isDeleting}
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                        <p>Owner: {workspace.owner?.email || 'Unknown'}</p>
                        <p>Members: {workspace.memberCount}</p>
                        <p>Channels: {workspace.channelCount}</p>
                        <p>Created: {formatDate(workspace.createdAt)}</p>
                    </div>

                    <div className="mt-4">
                        <Button
                            size="sm"
                            className="rounded-full bg-[#1264a3] text-white hover:bg-[#0f5489]"
                            onClick={() => onToggleArchive(workspace)}
                            disabled={isUpdating}
                        >
                            {workspace.isArchived ? (
                                <ArchiveRestore className="size-4" />
                            ) : (
                                <Archive className="size-4" />
                            )}
                            {workspace.isArchived ? 'Restore Workspace' : 'Archive Workspace'}
                        </Button>
                    </div>
                </div>
            </div>
        ))}

        <div className="xl:col-span-2">
            <AdminPagination pagination={pagination} onPageChange={onPageChange} />
        </div>
    </AdminSectionCard>
);
