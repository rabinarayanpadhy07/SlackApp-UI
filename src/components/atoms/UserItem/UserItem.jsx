import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { cva } from 'class-variance-authority';
import { Link } from 'react-router-dom';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace';
import { useSocket } from '@/hooks/context/useSocket';
import { cn } from '@/lib/utils';
import { getAvatarUrl } from '@/utils/getAvatarUrl';

const userItemVariants = cva(
    'flex items-center gap-1.5 justify-start font-normal h-7 px-4 mt-2 text-sm',
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

export const UserItem = ({
    id,
    label = 'Member',
    user,
    variant
}) => {
    const { currentWorkspace } = useCurrentWorkspace();
    const { onlineUsers } = useSocket();
    const isOnline = onlineUsers?.includes(id);

    const workspaceId = currentWorkspace?._id;

    if (!workspaceId) {
        return null;
    }

    return (
        <Button
            className={cn(userItemVariants({variant}))}
            variant="transparent"
            size="sm"
            asChild
        >
            <Link to={`/workspaces/${workspaceId}/members/${id}`} className="flex items-center gap-1.5 w-full">
                <div className="relative shrink-0">
                    <Avatar className="h-5 w-5 rounded-md">
                        <AvatarImage src={getAvatarUrl(user)} className='rounded-md' />
                        <AvatarFallback
                            className='rounded-md bg-sky-500 text-white text-xs'
                        >
                            {label.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    {isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-[10px] h-[10px] bg-green-500 rounded-full border-[1.5px] border-slack-dark ring-1 ring-white/10 shadow-sm" />
                    )}
                </div>
                <span className='text-sm truncate'>
                    {label}
                </span>
            </Link>
        </Button>
    );
};
