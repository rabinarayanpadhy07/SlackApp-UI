import { memo } from 'react';
import {
    Archive,
    BadgeIndianRupee,
    Building2,
    Crown,
    ShieldBan,
    Users
} from 'lucide-react';

const iconMap = {
    archive: Archive,
    building: Building2,
    crown: Crown,
    revenue: BadgeIndianRupee,
    shieldBan: ShieldBan,
    users: Users
};

const AdminMetricGridInner = ({ cards }) => (
    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
        {cards.map(({ label, value, hint, iconKey, bar }) => {
            const Icon = iconMap[iconKey];

            return (
                <div
                    key={label}
                    className="group relative overflow-hidden rounded-xl border border-[#611f69]/25 bg-[#1a0d1c]/90 p-4 shadow-sm"
                >
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${bar}`} />
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a49ba8]">
                                {label}
                            </p>
                            <p className="mt-4 text-3xl font-semibold tracking-tight text-[#f8f8f8]">
                                {value}
                            </p>
                        </div>
                        <div className="flex size-11 items-center justify-center rounded-2xl border border-[#611f69]/30 bg-[#350d36]/40 text-[#d1cbd4] transition group-hover:text-[#36C5F0]">
                            <Icon className="size-5" />
                        </div>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-[#a49ba8]">{hint}</p>
                </div>
            );
        })}
    </div>
);

export const AdminMetricGrid = memo(AdminMetricGridInner);
