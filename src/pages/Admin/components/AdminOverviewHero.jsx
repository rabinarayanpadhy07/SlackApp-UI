import {
    ArrowRightIcon,
    Building2,
    Crown,
    ShieldBan,
    Users
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatCurrency } from '../utils/adminDashboardUtils';

export const AdminOverviewHero = ({ metrics, cards, onGoWorkspaces, onMakePayment }) => (
    <section className="grid min-w-0 gap-6 lg:gap-8 2xl:gap-10 xl:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.85fr)] 2xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <div className="relative overflow-hidden rounded-[34px] border border-[#611f69]/30 bg-[linear-gradient(135deg,rgba(74,21,75,0.55),rgba(26,13,31,0.94)_52%,rgba(18,10,20,0.92))] p-6 shadow-[0_34px_110px_-48px_rgba(26,13,31,0.95)] backdrop-blur-2xl sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(97,31,105,0.35),transparent_32%),radial-gradient(circle_at_85%_18%,rgba(46,182,125,0.14),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(54,197,240,0.08),transparent_40%)]" />
            <div className="relative">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
                    <span className="rounded-full border border-[#611f69]/45 bg-[#611f69]/20 px-3 py-1 text-[#e8d4eb]">
                        Super admin workspace
                    </span>
                    <span className="rounded-full border border-[#2EB67D]/30 bg-[#2EB67D]/12 px-3 py-1 text-[#b8efd4]">
                        Live platform overview
                    </span>
                </div>

                <div className="mt-6 max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#611f69]/35 bg-[#350d36]/45 px-4 py-2 text-sm text-[#ebe6ed]">
                        <Crown className="size-4 text-[#ECB22E]" />
                        Premium operations cockpit
                    </div>
                    <h2 className="mt-5 text-4xl font-semibold tracking-tight text-[#f8f8f8] lg:text-5xl">
                        Run customer governance, moderation, and revenue from one Slack-inspired command center.
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-[#c9b8cc]/92">
                        Deep aubergine surfaces, crisp hierarchy, and Slack brand accents so platform work feels familiar and fast.
                    </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button
                        type="button"
                        onClick={() => onGoWorkspaces?.()}
                        className="rounded-full bg-[linear-gradient(90deg,#611f69,#2EB67D)] text-white shadow-[0_16px_40px_-20px_rgba(97,31,105,0.7)] hover:opacity-95"
                    >
                        Go to Workspaces
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onMakePayment?.()}
                        className="rounded-full border-[#611f69]/35 bg-[#350d36]/40 text-[#f8f8f8] hover:bg-[#611f69]/25"
                    >
                        Make Payment
                        <ArrowRightIcon className="ml-1.5 size-4" />
                    </Button>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:gap-5">
                    <div className="rounded-[26px] border border-[#611f69]/25 bg-[#350d36]/35 p-5">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#a49ba8]">
                            Protected users
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-[#f8f8f8]">
                            {metrics.totalUsers ?? 0}
                        </p>
                        <p className="mt-2 text-sm text-[#a49ba8]">
                            Plan, access, and suspension controls.
                        </p>
                    </div>
                    <div className="rounded-[26px] border border-[#611f69]/25 bg-[#350d36]/35 p-5">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#a49ba8]">
                            Workspace health
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-[#f8f8f8]">
                            {metrics.totalWorkspaces ?? 0}
                        </p>
                        <p className="mt-2 text-sm text-[#a49ba8]">
                            Archive and recovery tooling in one flow.
                        </p>
                    </div>
                    <div className="rounded-[26px] border border-[#611f69]/25 bg-[#350d36]/35 p-5">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#a49ba8]">
                            Cashflow tracked
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-[#f8f8f8]">
                            {formatCurrency(metrics.grossRevenue)}
                        </p>
                        <p className="mt-2 text-sm text-[#a49ba8]">
                            Billing visibility across your platform.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <div className="overflow-hidden rounded-[30px] border border-[#611f69]/28 bg-[linear-gradient(180deg,rgba(53,13,54,0.5),rgba(18,10,20,0.9))] shadow-[0_30px_90px_-44px_rgba(26,13,31,0.95)] backdrop-blur-2xl">
                <div className="border-b border-[#611f69]/25 px-5 py-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#a49ba8]">
                        Platform pulse
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[#f8f8f8]">Operational snapshot</h3>
                </div>
                <div className="grid gap-3 p-4">
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
                                className="relative overflow-hidden rounded-[24px] border border-[#611f69]/22 bg-[#350d36]/30 p-4"
                            >
                                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${bar}`} />
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#a49ba8]">
                                            {label}
                                        </p>
                                        <p className="mt-3 text-2xl font-semibold text-[#f8f8f8]">{value}</p>
                                    </div>
                                    <div className="flex size-10 items-center justify-center rounded-2xl border border-[#611f69]/30 bg-[#1a0d1c]/50 text-[#d1cbd4]">
                                        <Icon className="size-4" />
                                    </div>
                                </div>
                                <p className="mt-2 text-sm text-[#a49ba8]">{hint}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-[28px] border border-[#36C5F0]/25 bg-[linear-gradient(180deg,rgba(54,197,240,0.12),rgba(18,10,20,0.88))] p-5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#a49ba8]">Response mode</p>
                    <p className="mt-3 text-2xl font-semibold text-[#36C5F0]">Active</p>
                    <p className="mt-2 text-sm leading-7 text-[#a49ba8]">
                        A cleaner action layout makes administrative tasks easier to scan and safer to execute.
                    </p>
                </div>
                <div className="rounded-[28px] border border-[#611f69]/28 bg-[linear-gradient(180deg,rgba(97,31,105,0.22),rgba(18,10,20,0.9))] p-5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#a49ba8]">Coverage</p>
                    <p className="mt-3 text-2xl font-semibold text-[#f8f8f8]">{metrics.totalSuperAdmins ?? 0}</p>
                    <p className="mt-2 text-sm leading-7 text-[#a49ba8]">
                        Super admins currently monitored in the command surface.
                    </p>
                </div>
            </div>
        </div>
    </section>
);
