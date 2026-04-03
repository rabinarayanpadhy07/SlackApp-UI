export const AdminContentSkeleton = () => (
    <div className="overflow-hidden rounded-[32px] border border-[#611f69]/25 bg-[linear-gradient(180deg,rgba(53,13,54,0.45),rgba(18,10,20,0.88))] p-5 shadow-[0_28px_80px_-40px_rgba(26,13,31,0.92)] backdrop-blur-2xl">
        <div className="animate-pulse space-y-5">
            <div className="h-6 w-52 rounded-full bg-[#611f69]/25" />
            <div className="h-4 w-80 rounded-full bg-[#611f69]/18" />
            <div className="grid gap-4 xl:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-[26px] border border-[#611f69]/22 bg-[#350d36]/30 p-5"
                    >
                        <div className="h-5 w-32 rounded-full bg-[#611f69]/22" />
                        <div className="mt-4 h-4 w-full rounded-full bg-[#611f69]/15" />
                        <div className="mt-3 h-4 w-4/5 rounded-full bg-[#611f69]/15" />
                        <div className="mt-6 h-10 w-40 rounded-full bg-[#611f69]/22" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);
