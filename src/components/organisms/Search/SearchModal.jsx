import { useState } from 'react';
import { SearchIcon, Loader2Icon, HashIcon, MessageSquareIcon, UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/hooks/apis/search/useSearch';

export const SearchModal = ({ open, setOpen, workspace }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const { results, isSearching } = useSearch({
        workspaceId: workspace?._id,
        query
    });

    const handleClose = () => {
        setOpen(false);
        setQuery('');
    };

    const handleNavigate = (path) => {
        handleClose();
        navigate(path);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden outline-none">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle className="sr-only">Search Workspace</DialogTitle>
                    <div className="flex items-center gap-2">
                        <SearchIcon className="size-5 text-muted-foreground" />
                        <Input 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={`Search ${workspace?.name || 'Workspace'}`}
                            className="bg-transparent border-none shadow-none focus-visible:ring-0 text-base"
                            autoFocus
                        />
                        {isSearching && <Loader2Icon className="size-5 animate-spin text-muted-foreground mr-2" />}
                    </div>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto px-4 py-2">
                    {query.length < 2 && (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            Type at least 2 characters to search for messages, channels, or people.
                        </div>
                    )}
                    
                    {query.length >= 2 && !isSearching && 
                     results.messages?.length === 0 && 
                     results.channels?.length === 0 && 
                     results.users?.length === 0 && (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            No results found for &quot;{query}&quot;
                        </div>
                    )}

                    {query.length >= 2 && results.channels?.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Channels</h3>
                            {results.channels.map(channel => (
                                <div 
                                    key={channel._id} 
                                    onClick={() => handleNavigate(`/workspaces/${workspace._id}/channels/${channel._id}`)}
                                    className="flex items-center gap-2 p-2 hover:bg-black/5 rounded-md cursor-pointer"
                                >
                                    <HashIcon className="size-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">{channel.name}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {query.length >= 2 && results.users?.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">People</h3>
                            {results.users.map(user => (
                                <div 
                                    key={user._id}
                                    onClick={() => handleNavigate(`/workspaces/${workspace._id}/members/${user._id}`)}
                                    className="flex items-center gap-2 p-2 hover:bg-black/5 rounded-md cursor-pointer"
                                >
                                    <UserIcon className="size-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">{user.username}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {query.length >= 2 && results.messages?.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Messages</h3>
                            {results.messages.map(msg => (
                                <div 
                                    key={msg._id}
                                    onClick={() => handleNavigate(`/workspaces/${workspace._id}/channels/${msg.channelId}`)}
                                    className="flex flex-col gap-1 p-2 hover:bg-black/5 rounded-md cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <MessageSquareIcon className="size-4 text-muted-foreground" />
                                        <span className="text-xs font-medium">{msg.senderId?.username}</span>
                                    </div>
                                    <span className="text-sm line-clamp-1 text-muted-foreground select-none" dangerouslySetInnerHTML={{ __html: msg.body }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
