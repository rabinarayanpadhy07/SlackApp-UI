import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const AdminConfirmationDialog = ({
    actionLabel,
    description,
    isOpen,
    isSubmitting,
    title,
    onCancel,
    onConfirm
}) => (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
        <DialogContent className="rounded-[24px] border-[#dccdde] bg-white p-6">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variant="destructive" onClick={onConfirm} disabled={isSubmitting}>
                    {actionLabel}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);
