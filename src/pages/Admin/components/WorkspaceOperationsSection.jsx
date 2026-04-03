import { Archive, ArchiveRestore, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    formatDate,
    getInitials,
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
        description="Archive, restore, or permanently delete workspaces from a cleaner lifecycle view."
        contentClassName="grid min-w-0 gap-4 md:gap-5 xl:grid-cols-2 2xl:grid-cols-3"
    >
        {workspaces.length === 0 && (
            <div className="xl:col-span-2 2xl:col-span-3">
                <AdminEmptyState
                    title="No matching workspaces"
                    description="Try a different search term to find the workspace you need."
                />
            </div>
        )}

        {workspaces.map((workspace) => (
            <div key={workspace._id} className={innerCardClass}>
                <div className="flex h-full flex-col p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-[22px] border border-[#2EB67D]/30 bg-[#2EB67D]/12 text-sm font-semibold text-[#b8efd4]">
                                {getInitials(workspace.name)}
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-lg font-semibold text-[#f8f8f8]">{workspace.name}</p>
                                    <AdminPill tone={workspace.isArchived ? 'amber' : 'emerald'}>
                                        {workspace.isArchived ? 'Archived' : 'Active'}
                                    </AdminPill>
                                </div>
                                <p className="mt-2 text-sm leading-7 text-[#c9b8cc]">
                                    {workspace.description || 'No description yet.'}
                                </p>
                            </div>
                        </div>

                        <Button
                            size="iconSm"
                            variant="ghost"
                            className="rounded-full text-[#fb9fb8] hover:bg-[#E01E5A]/15 hover:text-[#fce7f0]"
                            onClick={() => onDelete(workspace._id)}
                            disabled={isDeleting}
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm text-[#c9b8cc] sm:grid-cols-2">
                        <div className="rounded-[20px] border border-[#611f69]/22 bg-[#350d36]/30 px-4 py-3">
                            Owner: {workspace.owner?.email || 'Unknown'}
                        </div>
                        <div className="rounded-[20px] border border-[#611f69]/22 bg-[#350d36]/30 px-4 py-3">
                            Members: {workspace.memberCount}
                        </div>
                        <div className="rounded-[20px] border border-[#611f69]/22 bg-[#350d36]/30 px-4 py-3">
                            Channels: {workspace.channelCount}
                        </div>
                        <div className="rounded-[20px] border border-[#611f69]/22 bg-[#350d36]/30 px-4 py-3">
                            Created: {formatDate(workspace.createdAt)}
                        </div>
                    </div>

                    <div className="mt-5">
                        <Button
                            size="sm"
                            className="rounded-full bg-[linear-gradient(90deg,#611f69,#36C5F0)] text-white hover:opacity-95"
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

        <div className="xl:col-span-2 2xl:col-span-3">
            <AdminPagination pagination={pagination} onPageChange={onPageChange} />
        </div>
    </AdminSectionCard>
);
