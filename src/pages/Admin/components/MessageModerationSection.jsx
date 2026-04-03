import { Trash2 } from 'lucide-react';

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

export const MessageModerationSection = ({
    messages,
    pagination,
    onPageChange,
    isDeleting,
    onDelete
}) => (
    <AdminSectionCard
        title="Message Moderation"
        description="Review recent messages, inspect context quickly, and remove problematic content with confidence."
    >
        {messages.length === 0 && (
            <AdminEmptyState
                title="No messages found"
                description="Try another search or clear the filter to view more conversation activity."
            />
        )}

        {messages.map((message) => (
            <div key={message._id} className={innerCardClass}>
                <div className="flex min-w-0 flex-col gap-5 p-5 xl:flex-row xl:items-start xl:justify-between xl:gap-8">
                    <div className="flex min-w-0 flex-1 items-start gap-4">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-[22px] border border-[#611f69]/40 bg-[#611f69]/18 text-sm font-semibold text-[#e8d4eb]">
                            {getInitials(message.sender?.email || 'Unknown sender')}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="text-lg font-semibold text-[#f8f8f8]">
                                    {message.sender?.email || 'Unknown sender'}
                                </p>
                                <AdminPill tone={message.deletedAt ? 'rose' : 'emerald'}>
                                    {message.deletedAt ? 'Deleted' : 'Live'}
                                </AdminPill>
                            </div>
                            <p className="mt-2 text-sm text-[#c9b8cc]">
                                Channel: {message.channel?.name || 'Unknown channel'}
                            </p>
                            <p className="mt-3 break-words rounded-[22px] border border-[#611f69]/22 bg-[#350d36]/30 px-4 py-4 text-sm leading-7 text-[#ebe6ed]">
                                {message.body || 'Image-only message'}
                            </p>
                            <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[#a49ba8]">
                                {formatDate(message.createdAt)}
                            </p>
                        </div>
                    </div>

                    <Button
                        size="sm"
                        className="shrink-0 rounded-full bg-[#E01E5A] text-white hover:bg-[#c9184a]"
                        onClick={() => onDelete(message._id)}
                        disabled={isDeleting || !!message.deletedAt}
                    >
                        <Trash2 className="size-4" />
                        {message.deletedAt ? 'Removed' : 'Remove Message'}
                    </Button>
                </div>
            </div>
        ))}

        <AdminPagination pagination={pagination} onPageChange={onPageChange} />
    </AdminSectionCard>
);
