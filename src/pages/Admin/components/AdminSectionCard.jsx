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
        <CardHeader className="border-b border-white/10 bg-white/5">
            <CardTitle className="text-white">{title}</CardTitle>
            <CardDescription className="text-white/68">{description}</CardDescription>
            {action}
        </CardHeader>
        <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
);
