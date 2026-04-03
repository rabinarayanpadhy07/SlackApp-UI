import { Loader2 } from 'lucide-react';

export const AdminDashboardLoader = () => (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a060c]">
        <div className="absolute inset-0 bg-[linear-gradient(165deg,#1a0d1c_0%,#0a060c_55%)]" />
        <div className="relative flex items-center gap-3 rounded-full border border-[#611f69]/35 bg-[#350d36]/45 px-5 py-3 text-sm text-[#f8f8f8] shadow-sm">
            <Loader2 className="size-4 animate-spin text-[#36C5F0]" />
            Preparing your super admin workspace
        </div>
    </div>
);
