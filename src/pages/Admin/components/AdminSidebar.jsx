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
        <aside className="hidden h-full w-[250px] shrink-0 flex-col border-r border-[#350d36] bg-[#1a0d1c] lg:flex">
            <div className="flex shrink-0 items-center gap-2 border-b border-[#350d36] px-3 py-4">
                <div className="flex size-9 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#E01E5A_0%,#ECB22E_33%,#2EB67D_66%,#36C5F0_100%)] text-[#1a0d1c]">
                    <Activity className="size-[18px]" />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a49ba8]">
                        Super Admin
                    </p>
                    <p className="truncate text-sm font-semibold text-[#f8f8f8]">Console</p>
                </div>
            </div>

            <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-3" aria-label="Admin sections">
                <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7c7280]">
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
                                        ? 'bg-[#611f69]/45 text-white'
                                        : 'text-[#d1cbd4] hover:bg-[#350d36]/80 hover:text-[#f8f8f8]'
                                        }`}
                                >
                                    <span
                                        className={`flex size-8 shrink-0 items-center justify-center rounded-md border ${isActive
                                            ? 'border-[#2EB67D]/50 bg-[#2EB67D]/15 text-[#b8efd4]'
                                            : 'border-[#611f69]/25 bg-[#120a14]/60 text-[#a49ba8]'
                                            }`}
                                    >
                                        <Icon className="size-4" />
                                    </span>
                                    <span className="min-w-0 flex-1 truncate font-medium">{section.label}</span>
                                    {isActive ? (
                                        <span className="shrink-0 rounded border border-[#2EB67D]/40 bg-[#2EB67D]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#b8efd4]">
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

            <div className="shrink-0 border-t border-[#350d36] px-2 py-3">
                <div className="mb-2 grid grid-cols-2 gap-2 rounded-lg border border-[#611f69]/20 bg-[#120a14]/80 p-2 text-[10px]">
                    <div>
                        <p className="text-[#7c7280]">Users</p>
                        <p className="font-semibold text-[#f8f8f8]">{metrics.totalUsers ?? 0}</p>
                    </div>
                    <div>
                        <p className="text-[#7c7280]">Spaces</p>
                        <p className="font-semibold text-[#f8f8f8]">{metrics.totalWorkspaces ?? 0}</p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    className="mb-1 h-9 w-full justify-start gap-2 px-2 text-[#d1cbd4] hover:bg-[#350d36] hover:text-[#f8f8f8]"
                    onClick={() => navigate('/home')}
                >
                    <Settings className="size-4" />
                    Settings
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    className="h-9 w-full justify-start gap-2 px-2 text-[#fb9fb8] hover:bg-[#E01E5A]/15 hover:text-[#fce7f0]"
                    onClick={handleLogout}
                >
                    <LogOutIcon className="size-4" />
                    Logout
                </Button>
            </div>
        </aside>
    );
};
