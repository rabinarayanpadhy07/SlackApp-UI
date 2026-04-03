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
        description="Recent admin actions across users, workspaces, and moderation."
    >
        {auditLogs.length === 0 && (
            <AdminEmptyState
                title="No audit events yet"
                description="Admin actions will appear here after platform changes."
            />
        )}

        {auditLogs.map((log) => (
            <div key={log._id} className={innerCardClass}>
                <div className="flex items-center justify-between gap-4 p-5">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-[#311333]">{log.action}</p>
                            <AdminPill tone="sky">{log.targetType}</AdminPill>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">
                            {log.actor?.email || 'System'}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            {log.targetId || 'No target id'}
                        </p>
                    </div>
                    <p className="text-xs text-slate-500">{formatDate(log.createdAt)}</p>
                </div>
            </div>
        ))}

        <AdminPagination pagination={pagination} onPageChange={onPageChange} />
    </AdminSectionCard>
);
