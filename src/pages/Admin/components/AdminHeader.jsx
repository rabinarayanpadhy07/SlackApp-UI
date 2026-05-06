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
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-[#350d36] bg-[#120a14] px-3 sm:gap-4 sm:px-4 lg:px-6">
            <nav
                className="flex min-w-0 shrink-0 items-center gap-1 text-sm text-[#a49ba8]"
                aria-label="Breadcrumb"
            >
                <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className="truncate font-medium text-[#c9b8cc] transition hover:text-[#f8f8f8]"
                >
                    Admin
                </button>
                <ChevronRight className="size-4 shrink-0 text-[#611f69]" aria-hidden />
                <span className="flex min-w-0 items-center gap-2 font-semibold text-[#f8f8f8]">
                    <span className="truncate">{activeSectionLabel}</span>
                    {isSectionFetching ? (
                        <span
                            className="size-1.5 shrink-0 animate-pulse rounded-full bg-[#2EB67D]"
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
                    <div className="h-9 rounded-lg border border-dashed border-[#611f69]/30 bg-[#350d36]/20 px-3 text-xs leading-9 text-[#7c7280]">
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
                            className="size-9 text-[#d1cbd4] hover:bg-[#611f69]/20 hover:text-[#f8f8f8]"
                            onClick={handleExportExcel}
                            title="Export Excel"
                        >
                            <FileSpreadsheetIcon className="size-4" />
                        </Button>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-9 text-[#d1cbd4] hover:bg-[#611f69]/20 hover:text-[#f8f8f8]"
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
                            className="flex max-w-[200px] items-center gap-2 rounded-lg border border-[#611f69]/30 bg-[#350d36]/40 py-1.5 pl-1.5 pr-2 text-left transition hover:bg-[#611f69]/25"
                        >
                            <Avatar className="size-8 border border-[#611f69]/40">
                                <AvatarImage src={getAvatarUrl(user)} />
                                <AvatarFallback className="bg-[#611f69] text-xs font-semibold text-white">
                                    {getInitials(displayName || email)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="hidden min-w-0 flex-1 sm:block">
                                <span className="block truncate text-xs font-semibold text-[#f8f8f8]">
                                    {displayName}
                                </span>
                                <span className="block truncate text-[10px] text-[#a49ba8]">
                                    Super admin
                                </span>
                            </span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-56 border-[#611f69]/35 bg-[#1a0d1c] text-[#f8f8f8]"
                    >
                        <DropdownMenuLabel className="font-normal">
                            <span className="text-xs text-[#a49ba8]">Signed in</span>
                            <span className="block truncate text-sm text-[#ebe6ed]">{email}</span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-[#611f69]/30" />
                        <DropdownMenuItem
                            className="cursor-pointer focus:bg-[#611f69]/30"
                            onClick={() => navigate('/home')}
                        >
                            <HomeIcon className="mr-2 size-4" />
                            App home
                        </DropdownMenuItem>
                        {firstWorkspaceId ? (
                            <DropdownMenuItem
                                className="cursor-pointer focus:bg-[#611f69]/30"
                                onClick={() => navigate(`/workspaces/${firstWorkspaceId}`)}
                            >
                                Open workspace
                            </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuSeparator className="bg-[#611f69]/30" />
                        <DropdownMenuItem
                            className="cursor-pointer text-[#fb9fb8] focus:bg-[#E01E5A]/20 focus:text-[#fce7f0]"
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
