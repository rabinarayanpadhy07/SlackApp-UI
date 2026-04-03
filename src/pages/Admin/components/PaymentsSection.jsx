import { AdminEmptyState } from './AdminEmptyState';
import { AdminPagination } from './AdminPagination';
import { AdminPill } from './AdminPill';
import { AdminSectionCard } from './AdminSectionCard';
import {
    formatCurrency,
    innerCardClass
} from '../utils/adminDashboardUtils';

export const PaymentsSection = ({ payments, pagination, onPageChange }) => (
    <AdminSectionCard
        title="Payments"
        description="Recent billing activity across the platform."
    >
        {payments.length === 0 && (
            <AdminEmptyState
                title="No payments yet"
                description="Payments will appear here once subscriptions begin."
            />
        )}

        {payments.slice(0, 12).map((payment) => (
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
        ))}

        <AdminPagination pagination={pagination} onPageChange={onPageChange} />
    </AdminSectionCard>
);
