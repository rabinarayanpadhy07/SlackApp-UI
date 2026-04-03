import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';

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
        <DialogContent className="rounded-[28px] border-[#611f69]/35 bg-[linear-gradient(180deg,rgba(74,21,75,0.65),rgba(18,10,20,0.96))] p-6 text-[#f8f8f8] shadow-[0_30px_100px_-44px_rgba(26,13,31,0.95)]">
            <DialogHeader>
                <DialogTitle className="text-xl text-[#f8f8f8]">{title}</DialogTitle>
                <DialogDescription className="text-sm leading-7 text-[#c9b8cc]/92">
                    {description}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button
                    variant="outline"
                    className="border-[#611f69]/35 bg-[#350d36]/40 text-[#ebe6ed] hover:bg-[#611f69]/25"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    className="bg-[#E01E5A] text-white hover:bg-[#c9184a]"
                    onClick={onConfirm}
                    disabled={isSubmitting}
                >
                    {actionLabel}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);
