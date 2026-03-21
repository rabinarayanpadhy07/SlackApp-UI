import { createContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/context/useAuth';

import { useChannelMessages } from '@/hooks/context/useChannelMessages';

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {

    const [currentChannel, _setCurrentChannel] = useState(null);
    const currentChannelRef = useRef(null);
    const setCurrentChannel = (val) => {
        currentChannelRef.current = val;
        _setCurrentChannel(val);
    };

    const [typingUsers, setTypingUsers] = useState([]);
    const { messageList, setMessageList } = useChannelMessages();

    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { auth } = useAuth();
    const [onlineUsers, setOnlineUsers] = useState([]);

    // Persist single socket connection across re-renders
    const [socket] = useState(() => io(import.meta.env.VITE_BACKEND_SOCKET_URL));

    useEffect(() => {
        const handleNewMessage = (data) => {
            console.log('New message received', data);
            if (!data.parentMessage) {
                setMessageList((prev) => [...prev, data]);
                
                if (currentChannelRef.current !== data.channelId) {
                    toast({
                        title: `New message from ${data.senderId?.username || 'someone'}`,
                        description: data.body ? data.body.replace(/<[^>]*>?/gm, '') : 'Sent an image',
                    });

                    queryClient.setQueryData(['unreadChannels', data.workspaceId], (oldData) => {
                        if (!oldData) return {};
                        const currentUnread = oldData[data.channelId] || 0;
                        return {
                            ...oldData,
                            [data.channelId]: currentUnread + 1
                        };
                    });
                }
            }
        };

        const handleReaction = (updatedMessage) => {
            console.log('Reaction added/updated:', updatedMessage);
            setMessageList((prev) => 
                prev.map((msg) => 
                    msg._id === updatedMessage._id ? updatedMessage : msg
                )
            );
        };

        const handleTypingStart = (data) => {
            setTypingUsers((prev) => {
                if (!prev.includes(data.username)) {
                    return [...prev, data.username];
                }
                return prev;
            });
        };

        const handleTypingStop = (data) => {
            setTypingUsers((prev) => prev.filter(u => u !== data.username));
        };

        const handleActiveUsers = (users) => {
            setOnlineUsers(users);
        };

        const handleStatusChanged = ({ userId, isOnline }) => {
            setOnlineUsers(prev => {
                if (isOnline && !prev.includes(userId)) return [...prev, userId];
                if (!isOnline) return prev.filter(u => u !== userId);
                return prev;
            });
        };

        const handleMentionReceived = (data) => {
            console.log('Mention received:', data);
            toast({
                title: `Mentioned by ${data.message.senderId?.username}`,
                description: `You were mentioned in a recent message.`,
            });
        };

        socket.on('NewMessageReceived', handleNewMessage);
        socket.on('REACTION_ADDED', handleReaction);
        socket.on('user_typing_start', handleTypingStart);
        socket.on('user_typing_stop', handleTypingStop);
        socket.on('active_users_list', handleActiveUsers);
        socket.on('user_status_changed', handleStatusChanged);
        socket.on('NewMentionReceived', handleMentionReceived);

        // Register user presence
        if (auth?.user?._id) {
            socket.emit('register_user', { userId: auth.user._id });
        }

        return () => {
            socket.off('NewMessageReceived', handleNewMessage);
            socket.off('REACTION_ADDED', handleReaction);
            socket.off('user_typing_start', handleTypingStart);
            socket.off('user_typing_stop', handleTypingStop);
            socket.off('active_users_list', handleActiveUsers);
            socket.off('user_status_changed', handleStatusChanged);
            socket.off('NewMentionReceived', handleMentionReceived);
        };
    }, [socket, queryClient, toast, setMessageList, auth]);

    async function joinChannel(channelId) {
        socket.emit('JoinChannel', { channelId }, (data) => {
            console.log('Successfully joined the channel', data);
            setCurrentChannel(data?.data);
        });
    }

    return (
        <SocketContext.Provider value={{
            socket,
            joinChannel,
            currentChannel,
            messageList,
            typingUsers,
            onlineUsers
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;