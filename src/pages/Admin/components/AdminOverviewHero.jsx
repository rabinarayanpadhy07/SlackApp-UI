import {
    Building2,
    Crown,
    ArrowRightIcon,
    ShieldBan,
    Users
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatCurrency } from '../utils/adminDashboardUtils';

export const AdminOverviewHero = ({ metrics, cards, onGoWorkspaces, onMakePayment }) => (
    <>
        <section className="rounded-[30px] border border-white/10 bg-black/18 px-4 py-4 shadow-[0_24px_80px_-36px_rgba(0,0,0,0.72)] backdrop-blur lg:px-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                    <div className="grid grid-cols-2 gap-1 rounded-2xl bg-white/10 p-2">
                        <span className="h-3 w-3 rounded-full bg-[#36c5f0]" />
                        <span className="h-3 w-3 rounded-full bg-[#2eb67d]" />
                        <span className="h-3 w-3 rounded-full bg-[#ecb22e]" />
                        <span className="h-3 w-3 rounded-full bg-[#e01e5a]" />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]">
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white/80">
                        Live platform ops
                    </span>
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-400/12 px-3 py-1 text-emerald-100">
                        {metrics.totalSuspendedUsers ?? 0} suspended monitored
                    </span>
                    <span className="rounded-full border border-amber-300/20 bg-amber-300/12 px-3 py-1 text-amber-100">
                        {metrics.totalSuperAdmins ?? 0} super admins
                    </span>
                </div>
            </div>
        </section>

        <section className="flex flex-col gap-3 rounded-[26px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-end">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                    type="button"
                    onClick={() => onGoWorkspaces?.()}
                    className="w-full rounded-full bg-white text-[#4a154b] hover:bg-white/90 sm:w-auto"
                >
                    Go to Workspaces
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onMakePayment?.()}
                    className="w-full rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 sm:w-auto"
                >
                    Make Payment
                    <ArrowRightIcon className="ml-1.5 size-4" />
                </Button>
            </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,#6f2b70_0%,#4a154b_52%,#321137_100%)] p-6 sm:p-8 shadow-[0_30px_90px_-42px_rgba(11,5,12,0.82)]">
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em]">
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white/80">
                        Premium workspace governance
                    </span>
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-400/12 px-3 py-1 text-emerald-100">
                        Slack-themed operator UI
                    </span>
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
                        <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                            Protected Users
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-white">
                            {metrics.totalUsers ?? 0}
                        </p>
                        <p className="mt-2 text-sm text-white/58">
                            Plan control and suspension tools.
                        </p>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-white/8 p-5">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                            Workspace Health
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-white">
                            {metrics.totalWorkspaces ?? 0}
                        </p>
                        <p className="mt-2 text-sm text-white/58">
                            Archive and recover with visibility.
                        </p>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-white/8 p-5">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                            Cashflow
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-white">
                            {formatCurrency(metrics.grossRevenue)}
                        </p>
                        <p className="mt-2 text-sm text-white/58">
                            Linked payments for SaaS operations.
                        </p>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#3e1141]/72 shadow-[0_24px_80px_-34px_rgba(9,4,12,0.75)] backdrop-blur">
                <div className="border-b border-white/10 px-6 py-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                        Platform Pulse
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                        Live operational snapshot
                    </h3>
                </div>
                <div className="grid gap-3 p-4 sm:p-5">
                    {cards.slice(0, 4).map(({ label, value, hint, bar, iconKey }) => {
                        const iconMap = {
                            building: Building2,
                            crown: Crown,
                            shieldBan: ShieldBan,
                            users: Users
                        };
                        const Icon = iconMap[iconKey];

                        return (
                            <div
                                key={label}
                                className="relative overflow-hidden rounded-[24px] border border-white/12 bg-white/10 p-5"
                            >
                                <div className={`absolute inset-x-0 top-0 h-1 ${bar}`} />
                                <div className="flex items-center justify-between">
                                    <p className="text-xs uppercase tracking-[0.18em] text-white/56">
                                        {label}
                                    </p>
                                    <Icon className="size-4 text-white/74" />
                                </div>
                                <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
                                <p className="mt-2 text-sm text-white/58">{hint}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    </>
);
