import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { shellCardClass } from '../utils/adminDashboardUtils';

export const AdminSectionCard = ({
    title,
    description,
    action,
    contentClassName = 'space-y-4',
    children
}) => (
    <Card className={shellCardClass}>
        <CardHeader className="flex flex-col gap-3 border-b border-[#611f69]/22 bg-[#350d36]/20 px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <CardTitle className="text-xl tracking-tight text-[#f8f8f8]">{title}</CardTitle>
                <CardDescription className="mt-2 max-w-2xl text-sm leading-7 text-[#c9b8cc]/88">
                    {description}
                </CardDescription>
            </div>
            {action ? <div className="sm:shrink-0">{action}</div> : null}
        </CardHeader>
        <CardContent className={`px-4 py-5 sm:px-5 ${contentClassName}`}>{children}</CardContent>
    </Card>
);
