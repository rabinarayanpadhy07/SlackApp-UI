/** Slack-inspired admin surfaces (no backdrop-blur — better scroll performance) */
export const shellCardClass =
    'relative overflow-hidden rounded-2xl border border-[#611f69]/25 bg-[#120a14]/95 shadow-sm';

export const innerCardClass =
    'group relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#1a0d1c]/95 shadow-sm';

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

export const getInitials = (value = '') =>
    value
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') || 'AD';

export const ADMIN_SECTION_META = {
    'audit-logs': {
        eyebrow: 'Trust and compliance',
        description: 'Track high-impact changes, investigate activity, and keep a clear paper trail.'
    },
    dashboard: {
        eyebrow: 'Operations overview',
        description: 'Watch growth, moderation, billing, and workspace health from one live control room.'
    },
    moderation: {
        eyebrow: 'Safety operations',
        description: 'Review recent conversations, remove risky content, and respond quickly to incidents.'
    },
    payments: {
        eyebrow: 'Revenue visibility',
        description: 'Monitor subscription payments, order activity, and platform cashflow in real time.'
    },
    users: {
        eyebrow: 'Customer governance',
        description: 'Manage plan status, admin access, and account health without leaving the dashboard.'
    },
    workspaces: {
        eyebrow: 'Workspace lifecycle',
        description: 'Archive, restore, and retire workspaces with a cleaner operational workflow.'
    }
};

export const getAdminMetricCards = (metrics = {}) => [
    {
        label: 'Users',
        value: metrics.totalUsers ?? 0,
        hint: `${metrics.totalPaidUsers ?? 0} premium accounts`,
        iconKey: 'users',
        bar: 'from-[#36C5F0] to-[#611f69]'
    },
    {
        label: 'Paid',
        value: metrics.totalPaidUsers ?? 0,
        hint: 'Revenue-generating customers',
        iconKey: 'crown',
        bar: 'from-[#ECB22E] to-[#f59e0b]'
    },
    {
        label: 'Suspended',
        value: metrics.totalSuspendedUsers ?? 0,
        hint: 'Accounts under restriction',
        iconKey: 'shieldBan',
        bar: 'from-[#E01E5A] to-[#be185d]'
    },
    {
        label: 'Workspaces',
        value: metrics.totalWorkspaces ?? 0,
        hint: `${metrics.totalArchivedWorkspaces ?? 0} archived`,
        iconKey: 'building',
        bar: 'from-[#2EB67D] to-[#0d9488]'
    },
    {
        label: 'Archived',
        value: metrics.totalArchivedWorkspaces ?? 0,
        hint: 'Recoverable organizations',
        iconKey: 'archive',
        bar: 'from-[#611f69] to-[#4A154B]'
    },
    {
        label: 'Revenue',
        value: formatCurrency(metrics.grossRevenue),
        hint: `${metrics.totalPayments ?? 0} payments recorded`,
        iconKey: 'revenue',
        bar: 'from-[#611f69] via-[#36C5F0] to-[#2EB67D]'
    }
];
