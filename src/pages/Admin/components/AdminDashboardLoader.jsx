import { Loader2 } from 'lucide-react';

export const AdminDashboardLoader = () => (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_#6a1f6a,_#481349_42%,_#25092b_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(54,197,240,0.12),transparent_24%),radial-gradient(circle_at_84%_14%,rgba(46,182,125,0.14),transparent_22%),radial-gradient(circle_at_84%_82%,rgba(224,30,90,0.16),transparent_24%)]" />
        <div className="relative flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm text-white shadow-[0_24px_80px_-36px_rgba(0,0,0,0.72)] backdrop-blur">
            <Loader2 className="size-4 animate-spin" />
            Preparing Slack admin control center
        </div>
    </div>
);
