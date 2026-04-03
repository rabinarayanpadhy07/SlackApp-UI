export const AdminContentSkeleton = () => (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#3e1141]/72 p-5 shadow-[0_24px_80px_-34px_rgba(9,4,12,0.75)] backdrop-blur">
        <div className="animate-pulse space-y-4">
            <div className="h-6 w-48 rounded-full bg-white/10" />
            <div className="h-4 w-72 rounded-full bg-white/8" />
            <div className="grid gap-4 xl:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-[24px] border border-white/10 bg-white/8 p-5"
                    >
                        <div className="h-5 w-32 rounded-full bg-white/10" />
                        <div className="mt-4 h-4 w-full rounded-full bg-white/8" />
                        <div className="mt-3 h-4 w-4/5 rounded-full bg-white/8" />
                        <div className="mt-6 h-10 w-36 rounded-full bg-white/10" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);
