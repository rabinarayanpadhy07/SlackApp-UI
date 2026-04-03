import { AdminSectionCard } from './AdminSectionCard';
import { AdminPill } from './AdminPill';
import { formatCurrency, formatDate, innerCardClass } from '../utils/adminDashboardUtils';

export const AdminOverviewActivity = ({ overview }) => (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-[1.15fr_0.85fr]">
        <AdminSectionCard
            title="Recent Users"
            description="Newest accounts and their current access state."
        >
            {(overview?.recentUsers || []).map((user) => (
                <div key={user._id} className={innerCardClass}>
                    <div className="flex flex-col gap-3 p-5 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold text-[#311333]">{user.username}</p>
                                <AdminPill tone={user.plan === 'Paid' ? 'amber' : 'slate'}>
                                    {user.plan}
                                </AdminPill>
                                {user.isSuperAdmin && <AdminPill tone="sky">Super Admin</AdminPill>}
                            </div>
                            <p className="mt-2 text-sm text-slate-600">{user.email}</p>
                        </div>
                        <p className="text-xs text-slate-500">{formatDate(user.createdAt)}</p>
                    </div>
                </div>
            ))}
        </AdminSectionCard>

        <div className="space-y-6">
            <AdminSectionCard
                title="Recent Payments"
                description="Latest successful and pending platform payments."
            >
                {(overview?.recentPayments || []).map((payment) => (
                    <div key={payment._id} className={innerCardClass}>
                        <div className="flex items-center justify-between gap-4 p-5">
                            <div>
                                <p className="font-semibold text-[#311333]">
                                    {payment.user?.email || 'Unlinked payment'}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">{payment.orderId}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-[#311333]">
                                    {formatCurrency(payment.amount)}
                                </p>
                                <p className="text-xs text-slate-500">{payment.status}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </AdminSectionCard>

            <AdminSectionCard
                title="Recent Audit Logs"
                description="Most recent administrative actions."
            >
                {(overview?.recentAuditLogs || []).map((log) => (
                    <div key={log._id} className={innerCardClass}>
                        <div className="p-5">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold text-[#311333]">{log.action}</p>
                                <AdminPill tone="sky">{log.targetType}</AdminPill>
                            </div>
                            <p className="mt-2 text-sm text-slate-600">
                                {log.actor?.email || 'System'}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">{formatDate(log.createdAt)}</p>
                        </div>
                    </div>
                ))}
            </AdminSectionCard>
        </div>
    </div>
);
