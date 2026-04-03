import { CreditCard } from 'lucide-react';

import { AdminEmptyState } from './AdminEmptyState';
import { AdminPagination } from './AdminPagination';
import { AdminPill } from './AdminPill';
import { AdminSectionCard } from './AdminSectionCard';
import {
    formatCurrency,
    formatDate,
    innerCardClass
} from '../utils/adminDashboardUtils';

export const PaymentsSection = ({ payments, pagination, onPageChange }) => (
    <AdminSectionCard
        title="Payments"
        description="Recent billing activity with cleaner visual status tracking across the platform."
    >
        {payments.length === 0 && (
            <AdminEmptyState
                title="No payments yet"
                description="Payments will appear here once subscriptions begin processing."
            />
        )}

        {payments.slice(0, 12).map((payment) => (
            <div key={payment._id} className={innerCardClass}>
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-[22px] border border-[#2EB67D]/30 bg-[#2EB67D]/12 text-[#b8efd4]">
                            <CreditCard className="size-5" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-[#f8f8f8]">
                                {payment.user?.email || 'Unlinked payment'}
                            </p>
                            <p className="mt-1 text-sm text-[#a49ba8]">{payment.orderId}</p>
                            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#a49ba8]">
                                {formatDate(payment.createdAt)}
                            </p>
                        </div>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-2xl font-semibold text-[#f8f8f8]">
                            {formatCurrency(payment.amount)}
                        </p>
                        <div className="mt-2">
                            <AdminPill
                                tone={
                                    payment.status === 'success'
                                        ? 'emerald'
                                        : payment.status === 'failed'
                                            ? 'rose'
                                            : 'amber'
                                }
                            >
                                {payment.status}
                            </AdminPill>
                        </div>
                    </div>
                </div>
            </div>
        ))}

        <AdminPagination pagination={pagination} onPageChange={onPageChange} />
    </AdminSectionCard>
);
