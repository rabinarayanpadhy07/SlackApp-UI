import {
    ChevronRight,
    DownloadIcon,
    FileSpreadsheetIcon,
    HomeIcon,
    LogOutIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/context/useAuth';
import { getAvatarUrl } from '@/utils/getAvatarUrl';
import { AdminSearchInput } from './AdminSearchInput';
import { getInitials } from '../utils/adminDashboardUtils';

export const AdminHeader = ({
    activeSectionLabel,
    canExport,
    canSearch,
    currentSearch,
    firstWorkspaceId,
    isSectionFetching,
    onExportExcel,
    onExportPdf,
    onSearchChange,
    searchPlaceholder
}) => {
    const navigate = useNavigate();
    const { auth, logout } = useAuth();
    const user = auth?.user;
    const email = user?.email || user?.username || 'Admin';
    const displayName = user?.username || user?.email?.split('@')[0] || 'Admin';

    const handleLogout = async () => {
        await logout();
        navigate('/auth/signin', { replace: true });
    };

    const handleExportExcel = async () => {
        const didExport = await onExportExcel?.();
        if (!didExport) {
            toast.info('Nothing to export in this section yet.');
        }
    };

    const handleExportPdf = async () => {
        const didExport = await onExportPdf?.();
        if (!didExport) {
            toast.info('Nothing to export in this section yet.');
        }
    };

    return (
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md px-3 sm:gap-4 sm:px-4 lg:px-6 z-10 relative">
            <nav
                className="flex min-w-0 shrink-0 items-center gap-1 text-sm text-slate-400"
                aria-label="Breadcrumb"
            >
                <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className="truncate font-medium text-slate-300 transition hover:text-slate-100"
                >
                    Admin
                </button>
                <ChevronRight className="size-4 shrink-0 text-white/20" aria-hidden />
                <span className="flex min-w-0 items-center gap-2 font-semibold text-slate-200">
                    <span className="truncate">{activeSectionLabel}</span>
                    {isSectionFetching ? (
                        <span
                            className="size-1.5 shrink-0 animate-pulse rounded-full bg-purple-500"
                            title="Syncing"
                        />
                    ) : null}
                </span>
            </nav>

            <div className="mx-auto min-w-0 max-w-xl flex-1 px-2">
                {canSearch ? (
                    <AdminSearchInput
                        compact
                        value={currentSearch}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder={searchPlaceholder}
                    />
                ) : (
                    <div className="h-9 rounded-lg border border-dashed border-white/10 bg-white/5 px-3 text-xs leading-9 text-slate-500">
                        Search available on Users, Workspaces, and Moderation.
                    </div>
                )}
            </div>

            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                {canExport ? (
                    <>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-9 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                            onClick={handleExportExcel}
                            title="Export Excel"
                        >
                            <FileSpreadsheetIcon className="size-4" />
                        </Button>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-9 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                            onClick={handleExportPdf}
                            title="Export PDF"
                        >
                            <DownloadIcon className="size-4" />
                        </Button>
                    </>
                ) : null}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex max-w-[200px] items-center gap-2 rounded-lg border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-2 text-left transition hover:bg-white/10"
                        >
                            <Avatar className="size-8 border border-white/10">
                                <AvatarImage src={getAvatarUrl(user)} />
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-xs font-semibold text-white">
                                    {getInitials(displayName || email)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="hidden min-w-0 flex-1 sm:block">
                                <span className="block truncate text-xs font-semibold text-slate-200">
                                    {displayName}
                                </span>
                                <span className="block truncate text-[10px] text-slate-400">
                                    Super admin
                                </span>
                            </span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-56 border-white/10 bg-[#121212] text-slate-200"
                    >
                        <DropdownMenuLabel className="font-normal">
                            <span className="text-xs text-slate-400">Signed in</span>
                            <span className="block truncate text-sm text-slate-300">{email}</span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem
                            className="cursor-pointer focus:bg-white/10"
                            onClick={() => navigate('/home')}
                        >
                            <HomeIcon className="mr-2 size-4" />
                            App home
                        </DropdownMenuItem>
                        {firstWorkspaceId ? (
                            <DropdownMenuItem
                                className="cursor-pointer focus:bg-white/10"
                                onClick={() => navigate(`/workspaces/${firstWorkspaceId}`)}
                            >
                                Open workspace
                            </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem
                            className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-300"
                            onClick={handleLogout}
                        >
                            <LogOutIcon className="mr-2 size-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};
