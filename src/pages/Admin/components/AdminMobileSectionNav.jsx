export const AdminMobileSectionNav = ({
    sections,
    activeSection,
    onSectionChange
}) => (
    <div className="overflow-x-auto lg:hidden">
        <div className="flex min-w-max gap-2 pb-1">
            {sections.map((section) => {
                const isActive = section.key === activeSection;

                return (
                    <button
                        key={section.key}
                        type="button"
                        onClick={() => onSectionChange(section.key)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${isActive
                            ? 'border-[#611f69]/40 bg-[linear-gradient(90deg,#611f69,#2EB67D)] text-white shadow-[0_18px_40px_-24px_rgba(97,31,105,0.55)]'
                            : 'border-[#611f69]/25 bg-[#350d36]/35 text-[#d1cbd4]'
                            }`}
                    >
                        {section.label}
                    </button>
                );
            })}
        </div>
    </div>
);
