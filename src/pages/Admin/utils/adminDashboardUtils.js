export const shellCardClass =
    'overflow-hidden rounded-[28px] border border-white/10 bg-[#3e1141]/72 shadow-[0_24px_80px_-34px_rgba(9,4,12,0.75)] backdrop-blur';

export const innerCardClass =
    'rounded-[24px] border border-[#e7dcea] bg-white/96 shadow-[0_18px_50px_-34px_rgba(74,21,75,0.35)]';

export const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format((amount || 0) / 100);

export const formatDate = (value) =>
    value
        ? new Intl.DateTimeFormat('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(new Date(value))
        : 'N/A';

export const getAdminMetricCards = (metrics = {}) => [
    {
        label: 'Users',
        value: metrics.totalUsers ?? 0,
        hint: `${metrics.totalPaidUsers ?? 0} paid accounts`,
        iconKey: 'users',
        bar: 'bg-[#36c5f0]'
    },
    {
        label: 'Paid',
        value: metrics.totalPaidUsers ?? 0,
        hint: 'Upgraded customer seats',
        iconKey: 'crown',
        bar: 'bg-[#ecb22e]'
    },
    {
        label: 'Suspended',
        value: metrics.totalSuspendedUsers ?? 0,
        hint: 'Restricted accounts',
        iconKey: 'shieldBan',
        bar: 'bg-[#e01e5a]'
    },
    {
        label: 'Workspaces',
        value: metrics.totalWorkspaces ?? 0,
        hint: `${metrics.totalArchivedWorkspaces ?? 0} archived`,
        iconKey: 'building',
        bar: 'bg-[#2eb67d]'
    },
    {
        label: 'Archived',
        value: metrics.totalArchivedWorkspaces ?? 0,
        hint: 'Recoverable workspaces',
        iconKey: 'archive',
        bar: 'bg-[#1264a3]'
    },
    {
        label: 'Revenue',
        value: formatCurrency(metrics.grossRevenue),
        hint: `${metrics.totalPayments ?? 0} payments tracked`,
        iconKey: 'revenue',
        bar: 'bg-[#611f69]'
    }
];
