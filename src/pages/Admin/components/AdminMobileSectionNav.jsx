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
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${isActive
                            ? 'bg-white text-[#4a154b]'
                            : 'bg-white/10 text-white/72'
                            }`}
                    >
                        {section.label}
                    </button>
                );
            })}
        </div>
    </div>
);
