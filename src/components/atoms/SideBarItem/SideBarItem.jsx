import { cva } from 'class-variance-authority';
import { Link, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const sideBarItemVariants = cva(
    'flex items-center justify-start gap-1.5 font-normal h-7 px-[20px] text-sm overflow-hidden',
    {
        variants: {
            variant: {
                default: 'text-white/80 hover:text-white hover:bg-white/10',
                active: 'text-white bg-white/20 font-medium'
            }
        },
        defaultVariants: 'default'
    }
);


export const SideBarItem = ({
    label,
    id, // channelId
    icon: Icon,
    variant,
    to,
    unreadCount
}) => {


    const {workspaceId} = useParams();

    const href = to || `/workspaces/${workspaceId}/channels/${id}`;

    return (
        <Button
            variant="transparent"
            size="sm"
            className={cn(sideBarItemVariants({variant}))}
        >
            <Link
                className='flex items-center gap-1.5 w-full'
                to={href}
            >
                <Icon className='size-3.5 mr-1 shrink-0' />
                <span className={cn('text-sm flex-1 truncate text-left', unreadCount > 0 && 'font-bold text-white')} >{label}</span>
                {unreadCount > 0 && (
                    <span className="text-[10px] bg-red-500 text-white rounded-full px-1.5 py-0.5 ml-auto font-bold shrink-0 leading-none">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </Link>
        </Button>
    );
};