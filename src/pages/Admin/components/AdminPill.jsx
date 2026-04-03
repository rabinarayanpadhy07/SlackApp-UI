export const AdminPill = ({ tone = 'slate', children }) => {
    const tones = {
        slate: 'bg-slate-100 text-slate-700',
        sky: 'bg-sky-100 text-sky-700',
        amber: 'bg-amber-100 text-amber-700',
        emerald: 'bg-emerald-100 text-emerald-700',
        rose: 'bg-rose-100 text-rose-700'
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${tones[tone]}`}
        >
            {children}
        </span>
    );
};
