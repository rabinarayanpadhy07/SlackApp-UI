export const AdminPill = ({ tone = 'slate', children }) => {
    const tones = {
        slate: 'border-white/[0.12] bg-white/[0.06] text-[#d1cbd4]',
        sky: 'border-[#611f69]/45 bg-[#611f69]/22 text-[#e8d4eb]',
        amber: 'border-[#ECB22E]/35 bg-[#ECB22E]/12 text-[#fde68a]',
        emerald: 'border-[#2EB67D]/35 bg-[#2EB67D]/12 text-[#b8efd4]',
        rose: 'border-[#E01E5A]/35 bg-[#E01E5A]/12 text-[#fbcfe8]'
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${tones[tone]}`}
        >
            {children}
        </span>
    );
};
