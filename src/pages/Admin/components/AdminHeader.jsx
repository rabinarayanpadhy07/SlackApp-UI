import { ChevronRight, ShieldCheck } from 'lucide-react';

import { AdminSearchInput } from './AdminSearchInput';

export const AdminHeader = ({
    activeSectionLabel,
    canSearch,
    isSectionFetching,
    profile,
    searchValue,
    searchPlaceholder,
    onSearchChange
}) => (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#481349]/88 px-4 py-4 backdrop-blur lg:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/50">
                    <span>Admin</span>
                    <ChevronRight className="size-3.5" />
                    <span>{activeSectionLabel}</span>
                    {isSectionFetching && (
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/72">
                            Updating
                        </span>
                    )}
                </div>
                <h1 className="mt-2 text-2xl font-semibold text-white">{activeSectionLabel}</h1>
            </div>

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                <div className="min-w-[280px] xl:min-w-[360px]">
                    <AdminSearchInput
                        value={searchValue}
                        onChange={onSearchChange}
                        placeholder={searchPlaceholder}
                        disabled={!canSearch}
                    />
                </div>

                <div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/8 px-4 py-3 text-white">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-white/12">
                        <ShieldCheck className="size-5 text-[#ecb22e]" />
                    </div>
                    <div>
                        <p className="font-medium">{profile?.username || 'Super Admin'}</p>
                        <p className="text-sm text-white/58">{profile?.email || 'Admin account'}</p>
                    </div>
                </div>
            </div>
        </div>
    </header>
);
