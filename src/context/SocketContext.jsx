import { createContext, useState } from 'react';
import { io } from 'socket.io-client';

import { useChannelMessages } from '@/hooks/context/useChannelMessages';

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {

    const [currentChannel, setCurrentChannel] = useState(null);
    const { messageList, setMessageList } = useChannelMessages();

    const socket = io(import.meta.env.VITE_BACKEND_SOCKET_URL);

    socket.on('NewMessageReceived', (data) => {
        console.log('New message received', data);
        if (!data.parentMessage) {
            setMessageList((prev) => [...prev, data]);
        }
    });

    socket.on('REACTION_ADDED', (updatedMessage) => {
        console.log('Reaction added/updated:', updatedMessage);
        setMessageList((prev) => 
            prev.map((msg) => 
                msg._id === updatedMessage._id ? updatedMessage : msg
            )
        );
    });

    async function joinChannel(channelId) {
        socket.emit('JoinChannel', { channelId }, (data) => {
            console.log('Successfully joined the channel', data);
            setCurrentChannel(data?.data);
        });
    }

    return (
        <SocketContext.Provider value={{socket, joinChannel, currentChannel}}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;