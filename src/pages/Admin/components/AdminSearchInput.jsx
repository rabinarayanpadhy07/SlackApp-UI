import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';

export const AdminSearchInput = ({
    compact = false,
    disabled = false,
    value,
    onChange,
    placeholder
}) => (
    <div className="relative w-full">
        <Search
            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[#a49ba8] ${compact ? 'left-2.5 size-3.5' : 'left-4 size-4'}`}
        />
        <Input
            disabled={disabled}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={
                compact
                    ? 'h-9 rounded-lg border-[#611f69]/30 bg-[#350d36]/35 py-2 pl-9 text-sm text-[#f8f8f8] placeholder:text-[#7c7280] focus-visible:ring-[#611f69]/45'
                    : 'h-12 rounded-[22px] border-[#611f69]/30 bg-[#350d36]/35 pl-11 text-[#f8f8f8] placeholder:text-[#7c7280] focus-visible:ring-[#611f69]/45'
            }
        />
    </div>
);
