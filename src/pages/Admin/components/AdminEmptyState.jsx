export const AdminEmptyState = ({ title, description }) => (
    <div className="rounded-[26px] border border-dashed border-[#611f69]/35 bg-[#350d36]/25 px-6 py-12 text-center">
        <p className="text-lg font-semibold text-[#f8f8f8]">{title}</p>
        <p className="mt-3 text-sm leading-7 text-[#a49ba8]">{description}</p>
    </div>
);
