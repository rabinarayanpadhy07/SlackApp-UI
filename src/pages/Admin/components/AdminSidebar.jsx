import {
    Activity,
    Building2,
    CreditCard,
    LayoutDashboard,
    LogOutIcon,
    MessageSquareWarning,
    ScrollText,
    Settings,
    Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/context/useAuth';

const iconMap = {
    'audit-logs': ScrollText,
    dashboard: LayoutDashboard,
    moderation: MessageSquareWarning,
    payments: CreditCard,
    users: Users,
    workspaces: Building2
};

export const AdminSidebar = ({ sections, activeSection, onSectionChange, metrics }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/auth/signin', { replace: true });
    };

    return (
        <aside className="hidden h-full w-[250px] shrink-0 flex-col border-r border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl lg:flex z-10">
            <div className="flex shrink-0 items-center gap-2 border-b border-white/5 px-3 py-4">
                <div className="flex size-9 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#E01E5A_0%,#ECB22E_33%,#2EB67D_66%,#36C5F0_100%)] text-[#1a0d1c]">
                    <Activity className="size-[18px]" />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Super Admin
                    </p>
                    <p className="truncate text-sm font-semibold text-slate-200">Console</p>
                </div>
            </div>

            <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-3" aria-label="Admin sections">
                <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Menu
                </p>
                <ul className="space-y-0.5">
                    {sections.map((section) => {
                        const Icon = iconMap[section.key];
                        const isActive = activeSection === section.key;

                        return (
                            <li key={section.key}>
                                    <button
                                        type="button"
                                        onClick={() => onSectionChange(section.key)}
                                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-2.5 text-left text-sm transition ${isActive
                                            ? 'bg-white/10 text-white shadow-sm border border-white/5'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                            }`}
                                    >
                                        <span
                                            className={`flex size-8 shrink-0 items-center justify-center rounded-md border ${isActive
                                                ? 'border-purple-500/50 bg-purple-500/20 text-purple-300'
                                                : 'border-white/10 bg-black/20 text-slate-400'
                                                }`}
                                        >
                                        <Icon className="size-4" />
                                    </span>
                                    <span className="min-w-0 flex-1 truncate font-medium">{section.label}</span>
                                    {isActive ? (
                                        <span className="shrink-0 rounded border border-purple-500/40 bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-bold text-purple-300">
                                            A
                                        </span>
                                    ) : (
                                        <span className="size-6 shrink-0" aria-hidden />
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="shrink-0 border-t border-white/5 px-2 py-3 z-10">
                <div className="mb-2 grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-black/20 p-2 text-[10px]">
                    <div>
                        <p className="text-slate-400">Users</p>
                        <p className="font-semibold text-slate-200">{metrics.totalUsers ?? 0}</p>
                    </div>
                    <div>
                        <p className="text-slate-400">Spaces</p>
                        <p className="font-semibold text-slate-200">{metrics.totalWorkspaces ?? 0}</p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    className="mb-1 h-9 w-full justify-start gap-2 px-2 text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    onClick={() => navigate('/home')}
                >
                    <Settings className="size-4" />
                    Settings
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    className="h-9 w-full justify-start gap-2 px-2 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    onClick={handleLogout}
                >
                    <LogOutIcon className="size-4" />
                    Logout
                </Button>
            </div>
        </aside>
    );
};
