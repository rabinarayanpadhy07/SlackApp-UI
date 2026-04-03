import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const AdminPagination = ({ pagination, onPageChange }) => {
    if (!pagination || pagination.totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/78">
            <p>
                Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-white/10 bg-white/10 text-white hover:bg-white/15"
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                >
                    <ChevronLeft className="size-4" />
                    Previous
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-white/10 bg-white/10 text-white hover:bg-white/15"
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                >
                    Next
                    <ChevronRight className="size-4" />
                </Button>
            </div>
        </div>
    );
};
