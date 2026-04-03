import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';

export const AdminSearchInput = ({
    disabled = false,
    value,
    onChange,
    placeholder
}) => (
    <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/45" />
        <Input
            disabled={disabled}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="h-11 rounded-2xl border-white/10 bg-white/8 pl-9 text-white placeholder:text-white/45"
        />
    </div>
);
