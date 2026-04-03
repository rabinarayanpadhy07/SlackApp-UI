import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const AdminPagination = ({ pagination, onPageChange }) => {
    if (!pagination || pagination.totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex flex-col gap-3 rounded-[24px] border border-[#611f69]/25 bg-[#350d36]/35 px-4 py-4 text-sm text-[#d1cbd4] sm:flex-row sm:items-center sm:justify-between">
            <p>
                Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-[#611f69]/35 bg-[#350d36]/40 text-[#ebe6ed] hover:bg-[#611f69]/25"
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                >
                    <ChevronLeft className="size-4" />
                    Previous
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-[#611f69]/35 bg-[#350d36]/40 text-[#ebe6ed] hover:bg-[#611f69]/25"
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
