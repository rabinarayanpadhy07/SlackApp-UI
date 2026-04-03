import {
    Building2,
    CreditCard,
    LayoutDashboard,
    MessageSquareWarning,
    ScrollText,
    Users
} from 'lucide-react';

const iconMap = {
    'audit-logs': ScrollText,
    dashboard: LayoutDashboard,
    moderation: MessageSquareWarning,
    payments: CreditCard,
    users: Users,
    workspaces: Building2
};

export const AdminSidebar = ({ sections, activeSection, onSectionChange }) => (
    <aside className="hidden h-full w-[260px] shrink-0 border-r border-white/10 bg-[#2f0b31]/92 p-5 text-white lg:flex lg:flex-col">
        <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/52">Control Center</p>
            <h2 className="mt-2 text-xl font-semibold">Admin Workspace</h2>
            <p className="mt-2 text-sm leading-6 text-white/64">
                Navigate between analytics, customer management, moderation, and platform governance.
            </p>
        </div>

        <nav className="mt-6 flex-1 space-y-2">
            {sections.map((section) => {
                const Icon = iconMap[section.key];
                const isActive = activeSection === section.key;

                return (
                    <button
                        key={section.key}
                        type="button"
                        onClick={() => onSectionChange(section.key)}
                        className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${isActive
                            ? 'bg-white text-[#4a154b] shadow-[0_18px_40px_-24px_rgba(255,255,255,0.65)]'
                            : 'bg-white/5 text-white/72 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <Icon className="size-4" />
                        {section.label}
                    </button>
                );
            })}
        </nav>
    </aside>
);
