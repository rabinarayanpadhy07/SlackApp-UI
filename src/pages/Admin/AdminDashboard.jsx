import { useDeferredValue, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Archive,
    ArchiveRestore,
    BadgeIndianRupee,
    Building2,
    Crown,
    Loader2,
    Search,
    ShieldBan,
    Trash2,
    Users
} from 'lucide-react';
import { toast } from 'sonner';

import {
    deleteAdminMessageRequest,
    deleteAdminWorkspaceRequest,
    getAdminAuditLogsRequest,
    getAdminMessagesRequest,
    getAdminOverviewRequest,
    getAdminPaymentsRequest,
    getAdminUsersRequest,
    getAdminWorkspacesRequest,
    updateAdminUserRequest,
    updateAdminWorkspaceRequest
} from '@/apis/admin';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/context/useAuth';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format((amount || 0) / 100);

const formatDate = (value) =>
    value
        ? new Intl.DateTimeFormat('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(new Date(value))
        : 'N/A';

const shellCardClass =
    'overflow-hidden rounded-[28px] border border-white/10 bg-[#3e1141]/72 shadow-[0_24px_80px_-34px_rgba(9,4,12,0.75)] backdrop-blur';

const innerCardClass =
    'rounded-[24px] border border-[#e7dcea] bg-white/96 shadow-[0_18px_50px_-34px_rgba(74,21,75,0.35)]';

const Pill = ({ tone = 'slate', children }) => {
    const tones = {
        slate: 'bg-slate-100 text-slate-700',
        sky: 'bg-sky-100 text-sky-700',
        amber: 'bg-amber-100 text-amber-700',
        emerald: 'bg-emerald-100 text-emerald-700',
        rose: 'bg-rose-100 text-rose-700'
    };

    return (
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${tones[tone]}`}>
            {children}
        </span>
    );
};

const SearchInput = ({ value, onChange, placeholder }) => (
    <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/45" />
        <Input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="h-11 rounded-2xl border-white/10 bg-white/8 pl-9 text-white placeholder:text-white/45"
        />
    </div>
);

const EmptyState = ({ title, description }) => (
    <div className="rounded-[24px] border border-dashed border-[#d8cadc] bg-[#fbf8fb] px-6 py-10 text-center">
        <p className="font-medium text-[#311333]">{title}</p>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
);

export const AdminDashboard = () => {
    const { auth, setAuth } = useAuth();
    const queryClient = useQueryClient();
    const [userSearch, setUserSearch] = useState('');
    const [workspaceSearch, setWorkspaceSearch] = useState('');
    const [messageSearch, setMessageSearch] = useState('');
    const deferredUserSearch = useDeferredValue(userSearch);
    const deferredWorkspaceSearch = useDeferredValue(workspaceSearch);
    const deferredMessageSearch = useDeferredValue(messageSearch);

    const overviewQuery = useQuery({
        queryKey: ['admin-overview'],
        queryFn: () => getAdminOverviewRequest({ token: auth?.token }),
        enabled: !!auth?.token
    });
    const usersQuery = useQuery({
        queryKey: ['admin-users'],
        queryFn: () => getAdminUsersRequest({ token: auth?.token }),
        enabled: !!auth?.token
    });
    const workspacesQuery = useQuery({
        queryKey: ['admin-workspaces'],
        queryFn: () => getAdminWorkspacesRequest({ token: auth?.token }),
        enabled: !!auth?.token
    });
    const messagesQuery = useQuery({
        queryKey: ['admin-messages', deferredMessageSearch],
        queryFn: () => getAdminMessagesRequest({ token: auth?.token, search: deferredMessageSearch }),
        enabled: !!auth?.token,
        placeholderData: (previousData) => previousData
    });
    const paymentsQuery = useQuery({
        queryKey: ['admin-payments'],
        queryFn: () => getAdminPaymentsRequest({ token: auth?.token }),
        enabled: !!auth?.token
    });
    const auditLogsQuery = useQuery({
        queryKey: ['admin-audit-logs'],
        queryFn: () => getAdminAuditLogsRequest({ token: auth?.token }),
        enabled: !!auth?.token
    });

    const refreshAdminData = async (...keys) => {
        await Promise.all(keys.map((key) => queryClient.invalidateQueries({ queryKey: [key] })));
    };

    const updateUserMutation = useMutation({
        mutationFn: updateAdminUserRequest,
        onSuccess: async (updatedUser) => {
            await refreshAdminData('admin-overview', 'admin-users', 'admin-audit-logs');
            if (updatedUser?._id === auth?.user?._id) {
                const nextUser = {
                    ...auth.user,
                    plan: updatedUser.plan ?? auth.user.plan,
                    isSuperAdmin: updatedUser.isSuperAdmin ?? auth.user.isSuperAdmin,
                    isActive: updatedUser.isActive ?? auth.user.isActive
                };
                globalThis.localStorage.setItem('user', JSON.stringify(nextUser));
                setAuth((previous) => ({ ...previous, user: nextUser }));
            }
            toast.success('User updated successfully');
        },
        onError: (error) => {
            toast.error('Unable to update user', {
                description: getApiErrorMessage(error, 'Please try again.')
            });
        }
    });

    const updateWorkspaceMutation = useMutation({
        mutationFn: updateAdminWorkspaceRequest,
        onSuccess: async (workspace) => {
            await refreshAdminData('admin-overview', 'admin-workspaces', 'admin-audit-logs');
            toast.success(workspace?.isArchived ? 'Workspace archived successfully' : 'Workspace restored successfully');
        },
        onError: (error) => {
            toast.error('Unable to update workspace', {
                description: getApiErrorMessage(error, 'Please try again.')
            });
        }
    });

    const deleteWorkspaceMutation = useMutation({
        mutationFn: deleteAdminWorkspaceRequest,
        onSuccess: async () => {
            await refreshAdminData('admin-overview', 'admin-workspaces', 'admin-messages', 'admin-audit-logs');
            toast.success('Workspace deleted successfully');
        },
        onError: (error) => {
            toast.error('Unable to delete workspace', {
                description: getApiErrorMessage(error, 'Please try again.')
            });
        }
    });

    const deleteMessageMutation = useMutation({
        mutationFn: deleteAdminMessageRequest,
        onSuccess: async () => {
            await refreshAdminData('admin-overview', 'admin-messages', 'admin-audit-logs');
            toast.success('Message removed successfully');
        },
        onError: (error) => {
            toast.error('Unable to remove message', {
                description: getApiErrorMessage(error, 'Please try again.')
            });
        }
    });

    const filteredUsers = useMemo(() => {
        const needle = deferredUserSearch.trim().toLowerCase();
        if (!needle) return usersQuery.data || [];
        return (usersQuery.data || []).filter((user) =>
            [user.username, user.email, user.plan, user.isActive ? 'active' : 'suspended']
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(needle))
        );
    }, [deferredUserSearch, usersQuery.data]);

    const filteredWorkspaces = useMemo(() => {
        const needle = deferredWorkspaceSearch.trim().toLowerCase();
        if (!needle) return workspacesQuery.data || [];
        return (workspacesQuery.data || []).filter((workspace) =>
            [workspace.name, workspace.description, workspace.owner?.email, workspace.isArchived ? 'archived' : 'active']
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(needle))
        );
    }, [deferredWorkspaceSearch, workspacesQuery.data]);

    const metrics = overviewQuery.data?.metrics || {};
    const cards = [
        { label: 'Users', value: metrics.totalUsers ?? 0, icon: Users, bar: 'bg-[#36c5f0]', hint: `${metrics.totalPaidUsers ?? 0} paid accounts` },
        { label: 'Paid', value: metrics.totalPaidUsers ?? 0, icon: Crown, bar: 'bg-[#ecb22e]', hint: 'Upgraded customer seats' },
        { label: 'Suspended', value: metrics.totalSuspendedUsers ?? 0, icon: ShieldBan, bar: 'bg-[#e01e5a]', hint: 'Restricted accounts' },
        { label: 'Workspaces', value: metrics.totalWorkspaces ?? 0, icon: Building2, bar: 'bg-[#2eb67d]', hint: `${metrics.totalArchivedWorkspaces ?? 0} archived` },
        { label: 'Archived', value: metrics.totalArchivedWorkspaces ?? 0, icon: Archive, bar: 'bg-[#1264a3]', hint: 'Recoverable workspaces' },
        { label: 'Revenue', value: formatCurrency(metrics.grossRevenue), icon: BadgeIndianRupee, bar: 'bg-[#611f69]', hint: `${metrics.totalPayments ?? 0} payments tracked` }
    ];

    const isLoading = [
        overviewQuery,
        usersQuery,
        workspacesQuery,
        messagesQuery,
        paymentsQuery,
        auditLogsQuery
    ].some((query) => query.isLoading);

    if (isLoading) {
        return (
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_#6a1f6a,_#481349_42%,_#25092b_100%)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(54,197,240,0.12),transparent_24%),radial-gradient(circle_at_84%_14%,rgba(46,182,125,0.14),transparent_22%),radial-gradient(circle_at_84%_82%,rgba(224,30,90,0.16),transparent_24%)]" />
                <div className="relative flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm text-white shadow-[0_24px_80px_-36px_rgba(0,0,0,0.72)] backdrop-blur">
                    <Loader2 className="size-4 animate-spin" />
                    Preparing Slack admin control center
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#6a1f6a,_#481349_42%,_#25092b_100%)] px-4 py-8 text-slate-100">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(54,197,240,0.12),transparent_24%),radial-gradient(circle_at_84%_14%,rgba(46,182,125,0.14),transparent_22%),radial-gradient(circle_at_84%_82%,rgba(224,30,90,0.16),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_34%)]" />
            <div className="relative mx-auto max-w-7xl space-y-6">
                <section className="rounded-[30px] border border-white/10 bg-black/18 px-5 py-4 shadow-[0_24px_80px_-36px_rgba(0,0,0,0.72)] backdrop-blur lg:px-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="grid grid-cols-2 gap-1 rounded-2xl bg-white/10 p-2">
                                <span className="h-3 w-3 rounded-full bg-[#36c5f0]" />
                                <span className="h-3 w-3 rounded-full bg-[#2eb67d]" />
                                <span className="h-3 w-3 rounded-full bg-[#ecb22e]" />
                                <span className="h-3 w-3 rounded-full bg-[#e01e5a]" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.22em] text-white/55">Slack Style Admin</p>
                                <h1 className="text-2xl font-semibold tracking-tight text-white">Super Admin Control Center</h1>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]">
                            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white/80">Live platform ops</span>
                            <span className="rounded-full border border-emerald-300/20 bg-emerald-400/12 px-3 py-1 text-emerald-100">{metrics.totalSuspendedUsers ?? 0} suspended monitored</span>
                            <span className="rounded-full border border-amber-300/20 bg-amber-300/12 px-3 py-1 text-amber-100">{metrics.totalSuperAdmins ?? 0} super admins</span>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
                    <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,#6f2b70_0%,#4a154b_52%,#321137_100%)] p-8 shadow-[0_30px_90px_-42px_rgba(11,5,12,0.82)]">
                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em]">
                            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white/80">Premium workspace governance</span>
                            <span className="rounded-full border border-emerald-300/20 bg-emerald-400/12 px-3 py-1 text-emerald-100">Slack-themed operator UI</span>
                        </div>
                        <div className="mt-6 max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80">
                                <Crown className="size-4" />
                                Modern SaaS admin layer
                            </div>
                            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white lg:text-5xl">
                                Run users, billing, moderation, and workspace controls from one Slack-style surface.
                            </h2>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">
                                A more premium admin cockpit for customer ops, workspace governance, billing visibility, and moderation.
                            </p>
                        </div>
                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-[24px] border border-white/10 bg-white/8 p-5">
                                <p className="text-xs uppercase tracking-[0.18em] text-white/55">Protected Users</p>
                                <p className="mt-3 text-3xl font-semibold text-white">{metrics.totalUsers ?? 0}</p>
                                <p className="mt-2 text-sm text-white/58">Plan control and suspension tools.</p>
                            </div>
                            <div className="rounded-[24px] border border-white/10 bg-white/8 p-5">
                                <p className="text-xs uppercase tracking-[0.18em] text-white/55">Workspace Health</p>
                                <p className="mt-3 text-3xl font-semibold text-white">{metrics.totalWorkspaces ?? 0}</p>
                                <p className="mt-2 text-sm text-white/58">Archive and recover with visibility.</p>
                            </div>
                            <div className="rounded-[24px] border border-white/10 bg-white/8 p-5">
                                <p className="text-xs uppercase tracking-[0.18em] text-white/55">Cashflow</p>
                                <p className="mt-3 text-3xl font-semibold text-white">{formatCurrency(metrics.grossRevenue)}</p>
                                <p className="mt-2 text-sm text-white/58">Linked payments for SaaS operations.</p>
                            </div>
                        </div>
                    </div>

                    <div className={shellCardClass}>
                        <div className="border-b border-white/10 px-6 py-5">
                            <p className="text-xs uppercase tracking-[0.18em] text-white/55">Platform Pulse</p>
                            <h3 className="mt-2 text-xl font-semibold text-white">Live operational snapshot</h3>
                        </div>
                        <div className="grid gap-3 p-4">
                            {cards.slice(0, 4).map(({ label, value, icon: Icon, hint, bar }) => (
                                <div key={label} className="relative overflow-hidden rounded-[24px] border border-white/12 bg-white/10 p-5">
                                    <div className={`absolute inset-x-0 top-0 h-1 ${bar}`} />
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs uppercase tracking-[0.18em] text-white/56">{label}</p>
                                        <Icon className="size-4 text-white/74" />
                                    </div>
                                    <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
                                    <p className="mt-2 text-sm text-white/58">{hint}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {cards.map(({ label, value, icon: Icon }) => (
                        <div key={label} className="rounded-[26px] border border-white/10 bg-white/10 p-5 shadow-[0_18px_60px_-32px_rgba(15,23,42,0.55)] backdrop-blur">
                            <div className="flex items-center justify-between">
                                <p className="text-xs uppercase tracking-[0.16em] text-white/62">{label}</p>
                                <Icon className="size-4 text-white/78" />
                            </div>
                            <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
                        </div>
                    ))}
                </div>

                <Card className={shellCardClass}>
                    <CardHeader className="border-b border-white/10 bg-white/5">
                        <CardTitle className="text-white">User Administration</CardTitle>
                        <CardDescription className="text-white/68">Plan upgrades, super admin access, and suspension control.</CardDescription>
                        <SearchInput
                            value={userSearch}
                            onChange={(event) => setUserSearch(event.target.value)}
                            placeholder="Search users by name, email, plan, or status"
                        />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {filteredUsers.length === 0 && <EmptyState title="No matching users" description="Try a different search term." />}
                        {filteredUsers.map((user) => (
                            <div key={user._id} className={innerCardClass}>
                                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-semibold text-[#311333]">{user.username}</p>
                                            <Pill tone={user.plan === 'Paid' ? 'amber' : 'slate'}>{user.plan}</Pill>
                                            {user.isSuperAdmin && <Pill tone="sky">Super Admin</Pill>}
                                            <Pill tone={user.isActive ? 'emerald' : 'rose'}>{user.isActive ? 'Active' : 'Suspended'}</Pill>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-600">{user.email}</p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {user.workspaceCount} workspaces | {user.ownedWorkspaceCount} owned | joined {formatDate(user.createdAt)}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Button size="sm" className="rounded-full bg-[#4a154b] text-white hover:bg-[#611f69]" onClick={() => updateUserMutation.mutate({ token: auth.token, userId: user._id, plan: user.plan === 'Paid' ? 'Normal' : 'Paid' })} disabled={updateUserMutation.isPending}>
                                            {user.plan === 'Paid' ? 'Set Normal' : 'Set Paid'}
                                        </Button>
                                        <Button size="sm" variant="outline" className="rounded-full border-[#d7c8da] bg-white text-[#4a154b] hover:bg-[#f8f1f8]" onClick={() => updateUserMutation.mutate({ token: auth.token, userId: user._id, isSuperAdmin: !user.isSuperAdmin })} disabled={updateUserMutation.isPending}>
                                            {user.isSuperAdmin ? 'Remove Admin' : 'Make Admin'}
                                        </Button>
                                        <Button size="sm" variant="outline" className="rounded-full border-[#f2c6d3] bg-white text-[#b11b56] hover:bg-[#fff1f5]" onClick={() => updateUserMutation.mutate({ token: auth.token, userId: user._id, isActive: !user.isActive })} disabled={updateUserMutation.isPending}>
                                            {user.isActive ? 'Suspend User' : 'Restore User'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className={shellCardClass}>
                    <CardHeader className="border-b border-white/10 bg-white/5">
                        <CardTitle className="text-white">Workspace Operations</CardTitle>
                        <CardDescription className="text-white/68">Archive, restore, or permanently delete workspaces.</CardDescription>
                        <SearchInput
                            value={workspaceSearch}
                            onChange={(event) => setWorkspaceSearch(event.target.value)}
                            placeholder="Search workspaces by name, owner, description, or status"
                        />
                    </CardHeader>
                    <CardContent className="grid gap-4 xl:grid-cols-2">
                        {filteredWorkspaces.length === 0 && <div className="xl:col-span-2"><EmptyState title="No matching workspaces" description="Try a different search term." /></div>}
                        {filteredWorkspaces.map((workspace) => (
                            <div key={workspace._id} className={innerCardClass}>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-semibold text-[#311333]">{workspace.name}</p>
                                            <Pill tone={workspace.isArchived ? 'amber' : 'emerald'}>{workspace.isArchived ? 'Archived' : 'Active'}</Pill>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-600">{workspace.description || 'No description yet.'}</p>
                                    </div>
                                    <Button size="iconSm" variant="ghost" className="text-rose-600 hover:text-rose-700" onClick={() => deleteWorkspaceMutation.mutate({ token: auth.token, workspaceId: workspace._id })} disabled={deleteWorkspaceMutation.isPending}>
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                                <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                                    <p>Owner: {workspace.owner?.email || 'Unknown'}</p>
                                    <p>Members: {workspace.memberCount}</p>
                                    <p>Channels: {workspace.channelCount}</p>
                                    <p>Created: {formatDate(workspace.createdAt)}</p>
                                </div>
                                <div className="mt-4">
                                    <Button size="sm" className="rounded-full bg-[#1264a3] text-white hover:bg-[#0f5489]" onClick={() => updateWorkspaceMutation.mutate({ token: auth.token, workspaceId: workspace._id, isArchived: !workspace.isArchived })} disabled={updateWorkspaceMutation.isPending}>
                                        {workspace.isArchived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
                                        {workspace.isArchived ? 'Restore Workspace' : 'Archive Workspace'}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className={shellCardClass}>
                    <CardHeader className="border-b border-white/10 bg-white/5">
                        <CardTitle className="text-white">Message Moderation</CardTitle>
                        <CardDescription className="text-white/68">Review recent messages and remove content when needed.</CardDescription>
                        <SearchInput
                            value={messageSearch}
                            onChange={(event) => setMessageSearch(event.target.value)}
                            placeholder="Search messages by body, sender, or channel"
                        />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {(messagesQuery.data || []).length === 0 && <EmptyState title="No messages found" description="Try another search or clear the filter." />}
                        {(messagesQuery.data || []).map((message) => (
                            <div key={message._id} className={innerCardClass}>
                                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-semibold text-[#311333]">{message.sender?.email || 'Unknown sender'}</p>
                                            <Pill tone={message.deletedAt ? 'rose' : 'emerald'}>{message.deletedAt ? 'Deleted' : 'Live'}</Pill>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-600">Channel: {message.channel?.name || 'Unknown channel'}</p>
                                        <p className="mt-3 rounded-[20px] bg-[#fbf8fb] px-4 py-3 text-sm leading-6 text-slate-700">{message.body || 'Image-only message'}</p>
                                        <p className="mt-2 text-xs text-slate-500">{formatDate(message.createdAt)}</p>
                                    </div>
                                    <Button size="sm" variant="destructive" className="rounded-full" onClick={() => deleteMessageMutation.mutate({ token: auth.token, messageId: message._id })} disabled={deleteMessageMutation.isPending || !!message.deletedAt}>
                                        <Trash2 className="size-4" />
                                        {message.deletedAt ? 'Removed' : 'Remove Message'}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-2">
                    <Card className={shellCardClass}>
                        <CardHeader className="border-b border-white/10 bg-white/5">
                            <CardTitle className="text-white">Payments</CardTitle>
                            <CardDescription className="text-white/68">Recent billing activity across the platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(paymentsQuery.data || []).length === 0 && <EmptyState title="No payments yet" description="Payments will appear here once subscriptions begin." />}
                            {(paymentsQuery.data || []).slice(0, 12).map((payment) => (
                                <div key={payment._id} className={innerCardClass}>
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-semibold text-[#311333]">{payment.user?.email || 'Unlinked payment'}</p>
                                            <p className="mt-1 text-xs text-slate-500">{payment.orderId}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-[#311333]">{formatCurrency(payment.amount)}</p>
                                            <Pill tone={payment.status === 'success' ? 'emerald' : payment.status === 'failed' ? 'rose' : 'amber'}>{payment.status}</Pill>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className={shellCardClass}>
                        <CardHeader className="border-b border-white/10 bg-white/5">
                            <CardTitle className="text-white">Audit Trail</CardTitle>
                            <CardDescription className="text-white/68">Recent admin actions across users, workspaces, and moderation.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(auditLogsQuery.data || []).length === 0 && <EmptyState title="No audit events yet" description="Admin actions will appear here after platform changes." />}
                            {(auditLogsQuery.data || []).map((log) => (
                                <div key={log._id} className={innerCardClass}>
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-semibold text-[#311333]">{log.action}</p>
                                                <Pill tone="sky">{log.targetType}</Pill>
                                            </div>
                                            <p className="mt-2 text-sm text-slate-600">{log.actor?.email || 'System'}</p>
                                            <p className="mt-1 text-xs text-slate-500">{log.targetId || 'No target id'}</p>
                                        </div>
                                        <p className="text-xs text-slate-500">{formatDate(log.createdAt)}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
