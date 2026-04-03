export const AdminEmptyState = ({ title, description }) => (
    <div className="rounded-[24px] border border-dashed border-[#d8cadc] bg-[#fbf8fb] px-6 py-10 text-center">
        <p className="font-medium text-[#311333]">{title}</p>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
);
