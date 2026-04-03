import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    formatDate,
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
        description="Review recent messages and remove content when needed."
    >
        {messages.length === 0 && (
            <AdminEmptyState
                title="No messages found"
                description="Try another search or clear the filter."
            />
        )}

        {messages.map((message) => (
            <div key={message._id} className={innerCardClass}>
                <div className="flex flex-col gap-4 p-5 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-[#311333]">
                                {message.sender?.email || 'Unknown sender'}
                            </p>
                            <AdminPill tone={message.deletedAt ? 'rose' : 'emerald'}>
                                {message.deletedAt ? 'Deleted' : 'Live'}
                            </AdminPill>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">
                            Channel: {message.channel?.name || 'Unknown channel'}
                        </p>
                        <p className="mt-3 rounded-[20px] bg-[#fbf8fb] px-4 py-3 text-sm leading-6 text-slate-700">
                            {message.body || 'Image-only message'}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                            {formatDate(message.createdAt)}
                        </p>
                    </div>

                    <Button
                        size="sm"
                        variant="destructive"
                        className="rounded-full"
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
