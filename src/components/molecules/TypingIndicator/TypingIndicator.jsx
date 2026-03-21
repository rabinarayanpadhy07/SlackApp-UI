import { useSocket } from '@/hooks/context/useSocket';
import { useAuth } from '@/hooks/context/useAuth';

export const TypingIndicator = () => {
    const { typingUsers } = useSocket();
    const { auth } = useAuth();
    
    // Filter out the current user
    const otherTypingUsers = typingUsers?.filter(name => name !== auth?.user?.username) || [];
    
    if (otherTypingUsers.length === 0) return null;
    
    let text = '';
    if (otherTypingUsers.length === 1) {
        text = `${otherTypingUsers[0]} is typing...`;
    } else if (otherTypingUsers.length === 2) {
        text = `${otherTypingUsers[0]} and ${otherTypingUsers[1]} are typing...`;
    } else {
        text = 'Multiple people are typing...';
    }

    return (
        <div className="px-5 pb-1 text-xs text-muted-foreground italic truncate animate-pulse h-4">
            {text}
        </div>
    );
};
