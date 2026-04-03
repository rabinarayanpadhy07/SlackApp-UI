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

export const AdminMetricGrid = ({ cards }) => (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ label, value, iconKey }) => {
            const Icon = iconMap[iconKey];

            return (
                <div
                    key={label}
                    className="rounded-[26px] border border-white/10 bg-white/10 p-5 shadow-[0_18px_60px_-32px_rgba(15,23,42,0.55)] backdrop-blur"
                >
                    <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.16em] text-white/62">
                            {label}
                        </p>
                        <Icon className="size-4 text-white/78" />
                    </div>
                    <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
                </div>
            );
        })}
    </div>
);
