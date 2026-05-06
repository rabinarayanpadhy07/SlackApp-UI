import { SmilePlus, MessageSquareText, MoreHorizontal, Pin, Trash, Edit, Star, PinOff, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { MessageImageThumbnail } from '@/components/atoms/MessageImageThumbnail/MessageImageThumbnail';
import { MessageRenderer } from '@/components/atoms/MessageRenderer/MessageRenderer';
import { Avatar, AvatarFallback,AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Hint } from '@/components/atoms/Hint/Hint';
import { useAuth } from '@/hooks/context/useAuth';
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace';
import { Editor } from '@/components/atoms/Editor/Edtior';
import { getAvatarUrl } from '@/utils/getAvatarUrl';
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
    author,
    authorId,
    authorImage,
    authorName = 'User',
    createdAt,
    body,
    image,
    reactions = [],
    onAddReaction,
    onRequestAiReply,
    onUseAiReply,
    showAiReplyAction = false,
    isReply = false,
    isEdited = false,
    deletedAt = null,
    isPinned = false,
    stars = []
}) => {
    const { openThread } = useThread();
    const { onlineUsers, socket, currentChannel } = useSocket();
    const { auth } = useAuth();
    const { currentWorkspace } = useCurrentWorkspace();
    
    const [isEditing, setIsEditing] = useState(false);
    const [isFetchingAiReply, setIsFetchingAiReply] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState([]);

    const isOnline = onlineUsers?.includes(authorId);

    const isAuthor = auth?.user?._id === authorId;
    const isWorkspaceAdmin = currentWorkspace?.members?.find(
        (m) => (m.memberId && m.memberId._id ? m.memberId._id === auth?.user?._id : m.memberId === auth?.user?._id) && m.role === 'admin'
    );
    const isStarred = stars?.includes(auth?.user?._id);

    const handleEditSubmit = ({ body }) => {
        socket.emit('EDIT_MESSAGE', { messageId, body, memberId: auth?.user?._id, channelId: currentChannel }, (res) => {
             if(res?.success) setIsEditing(false);
        });
    };
    const handleDelete = () => {
        socket.emit('DELETE_MESSAGE', { messageId, memberId: auth?.user?._id, channelId: currentChannel });
    };
    const handleTogglePin = () => {
        socket.emit('TOGGLE_PIN_MESSAGE', { messageId, memberId: auth?.user?._id, channelId: currentChannel });
    };
    const handleToggleStar = () => {
        socket.emit('TOGGLE_STAR_MESSAGE', { messageId, memberId: auth?.user?._id, channelId: currentChannel });
    };
    const handleAiReply = async () => {
        if (!onRequestAiReply) return;

        setIsFetchingAiReply(true);
        try {
            const suggestions = await onRequestAiReply(messageId);
            setAiSuggestions(Array.isArray(suggestions) ? suggestions : []);
        } finally {
            setIsFetchingAiReply(false);
        }
    };

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
            {!deletedAt && !isEditing && (
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
                {showAiReplyAction && (
                    <Hint label="AI reply">
                        <Button
                            variant="ghost"
                            size="iconSm"
                            onClick={handleAiReply}
                            className="h-8 w-8 text-slate-500 hover:text-slate-800"
                        >
                            {isFetchingAiReply ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        </Button>
                    </Hint>
                )}
                
                {isAuthor && (
                    <Hint label="Edit Message">
                        <Button variant="ghost" size="iconSm" onClick={() => setIsEditing(true)} className="h-8 w-8 text-slate-500 hover:text-slate-800">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </Hint>
                )}
                {(isAuthor || isWorkspaceAdmin) && (
                    <Hint label="Delete Message">
                        <Button variant="ghost" size="iconSm" onClick={handleDelete} className="h-8 w-8 text-rose-500 hover:text-rose-800">
                            <Trash className="h-4 w-4" />
                        </Button>
                    </Hint>
                )}
                <Hint label={isStarred ? "Unstar Message" : "Star Message"}>
                    <Button variant="ghost" size="iconSm" onClick={handleToggleStar} className={`h-8 w-8 ${isStarred ? 'text-yellow-500 hover:text-yellow-600' : 'text-slate-500 hover:text-slate-800'}`}>
                        {isStarred ? <Star className="h-4 w-4 fill-yellow-500" /> : <Star className="h-4 w-4" />}
                    </Button>
                </Hint>
                {isWorkspaceAdmin && (
                    <Hint label={isPinned ? "Unpin Message" : "Pin Message"}>
                        <Button variant="ghost" size="iconSm" onClick={handleTogglePin} className="h-8 w-8 text-slate-500 hover:text-slate-800">
                            {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                        </Button>
                    </Hint>
                )}

                <Hint label="More options">
                    <Button variant="ghost" size="iconSm" className="h-8 w-8 text-slate-500 hover:text-slate-800">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </Hint>
            </div>
            )}

            <div
                className="flex items-start gap-2"
            >

                <button className="relative shrink-0">
                    <Avatar>
                        <AvatarImage  className="rounded-md"  src={getAvatarUrl(author || { profilePicture: authorImage })} />
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
                    {isPinned && (
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1 font-medium">
                            <Pin className="h-3 w-3" /> Pinned
                        </div>
                    )}
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
                        {isEdited && !deletedAt && <span className="text-[10px] text-muted-foreground ml-2">(edited)</span>}
                        {isStarred && !deletedAt && <Star className="h-3 w-3 inline text-yellow-500 ml-2 fill-yellow-500" />}
                    </div>

                    {deletedAt ? (
                        <div className="text-sm italic text-slate-500 mt-1">This message was deleted.</div>
                    ) : isEditing ? (
                        <div className="w-full mt-2">
                            <Editor 
                                variant="update"
                                onSubmit={handleEditSubmit} 
                                onCancel={() => setIsEditing(false)} 
                                defaultValue={body} 
                                workspaceMembers={currentWorkspace?.members} 
                                workspaceChannels={currentWorkspace?.channels} 
                            />
                        </div>
                    ) : (
                        <>
                            <MessageRenderer value={body} />
                            {image && <MessageImageThumbnail url={image} />}
                        </>
                    )}

                    {/* Reactions Display */}
                    {!deletedAt && Object.keys(reactionCounts).length > 0 && (
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

                    {!deletedAt && showAiReplyAction && aiSuggestions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {aiSuggestions.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => onUseAiReply?.(suggestion)}
                                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};
