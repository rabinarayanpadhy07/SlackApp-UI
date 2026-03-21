import { MessageImageThumbnail } from '@/components/atoms/MessageImageThumbnail/MessageImageThumbnail';
import { MessageRenderer } from '@/components/atoms/MessageRenderer/MessageRenderer';
import { Avatar, AvatarFallback,AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Hint } from '@/components/atoms/Hint/Hint';
import { SmilePlus, MessageSquareText, MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useThread } from '@/context/ThreadContext';
import { useSocket } from '@/hooks/context/useSocket';

const COMMON_EMOJIS = ['👍', '❤️', '😂', '🔥', '👀'];

export const Message = ({
    messageId,
    authorId,
    authorImage,
    authorName = 'User',
    createdAt,
    body,
    image,
    reactions = [],
    onAddReaction,
    isReply = false
}) => {
    const { openThread } = useThread();
    const { onlineUsers } = useSocket();

    const isOnline = onlineUsers?.includes(authorId);

    // Group reactions by emoji
    const reactionCounts = reactions.reduce((acc, current) => {
        const emoji = current.body;
        acc[emoji] = (acc[emoji] || 0) + 1;
        return acc;
    }, {});

    return (
        <div
            className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative"
        >

            {/* Hover Action Bar */}
            <div className="absolute top-2 right-5 opacity-0 group-hover:opacity-100 transition-opacity bg-white border rounded-md shadow-sm z-10 flex items-center">
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="iconSm" 
                            className="h-8 w-8 text-slate-500 hover:text-slate-800"
                        >
                            <SmilePlus className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" className="flex flex-row p-1 gap-1 min-w-0 rounded-full bg-white shadow-md border">
                        {COMMON_EMOJIS.map((emoji) => (
                            <DropdownMenuItem 
                                key={emoji}
                                className="h-8 w-8 flex items-center justify-center text-lg cursor-pointer rounded-full hover:bg-slate-100"
                                onClick={() => onAddReaction && onAddReaction(messageId, emoji)}
                            >
                                {emoji}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {!isReply && (
                    <Hint label="Reply in thread">
                        <Button 
                            variant="ghost" 
                            size="iconSm" 
                            className="h-8 w-8 text-slate-500 hover:text-slate-800"
                            onClick={() => openThread(messageId)}
                        >
                            <MessageSquareText className="h-4 w-4" />
                        </Button>
                    </Hint>
                )}
                <Hint label="More options">
                    <Button variant="ghost" size="iconSm" className="h-8 w-8 text-slate-500 hover:text-slate-800">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </Hint>
            </div>

            <div
                className="flex items-start gap-2"
            >

                <button className="relative shrink-0">
                    <Avatar>
                        <AvatarImage  className="rounded-md"  src={authorImage} />
                        <AvatarFallback
                            className="rounded-md bg-sky-500 text-white text-sm"
                        >
                            {authorName ? authorName.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                    </Avatar>
                    {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-10 box-content shadow-sm" />
                    )}
                </button>

                <div
                    className='flex flex-col w-full overflow-hidden'
                >
                    <div
                        className='text-xs'
                    >
                        <button className='font-bold text-primary hover:underline'>
                            {authorName}
                        </button>
                        <span>&nbsp;&nbsp;</span>
                        <button
                            className='text-xs text-muted-foreground hover:underline'
                        >
                            {createdAt || 'Just now'}
                        </button>
                    </div>

                    <MessageRenderer value={body} />
                    {/* Any images if there are */}
                    {image && <MessageImageThumbnail url={image} />}

                    {/* Reactions Display */}
                    {Object.keys(reactionCounts).length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                            {Object.entries(reactionCounts).map(([emoji, count]) => (
                                <button
                                    key={emoji}
                                    onClick={() => onAddReaction && onAddReaction(messageId, emoji)}
                                    className="h-6 px-2 flex items-center gap-1 rounded-full border border-gray-300 bg-gray-100 text-[11px] text-gray-600 font-medium hover:border-gray-500 cursor-pointer"
                                >
                                    <span>{emoji}</span>
                                    <span>{count}</span>
                                </button>
                            ))}
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};