import { ScrollText } from 'lucide-react';

import { AdminEmptyState } from './AdminEmptyState';
import { AdminPagination } from './AdminPagination';
import { AdminPill } from './AdminPill';
import { AdminSectionCard } from './AdminSectionCard';
import {
    formatDate,
    innerCardClass
} from '../utils/adminDashboardUtils';

export const AuditTrailSection = ({ auditLogs, pagination, onPageChange }) => (
    <AdminSectionCard
        title="Audit Trail"
        description="Recent admin actions across users, workspaces, moderation, and other sensitive operations."
    >
        {auditLogs.length === 0 && (
            <AdminEmptyState
                title="No audit events yet"
                description="Admin actions will appear here after platform changes are made."
            />
        )}

        {auditLogs.map((log) => (
            <div key={log._id} className={innerCardClass}>
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-[22px] border border-[#611f69]/40 bg-[#611f69]/18 text-[#e8d4eb]">
                            <ScrollText className="size-5" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="text-lg font-semibold text-[#f8f8f8]">{log.action}</p>
                                <AdminPill tone="sky">{log.targetType}</AdminPill>
                            </div>
                            <p className="mt-2 text-sm text-[#c9b8cc]">
                                {log.actor?.email || 'System'}
                            </p>
                            <p className="mt-1 text-sm text-[#a49ba8]">
                                {log.targetId || 'No target id'}
                            </p>
                        </div>
                    </div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#a49ba8]">
                        {formatDate(log.createdAt)}
                    </p>
                </div>
            </div>
        ))}

        <AdminPagination pagination={pagination} onPageChange={onPageChange} />
    </AdminSectionCard>
);
