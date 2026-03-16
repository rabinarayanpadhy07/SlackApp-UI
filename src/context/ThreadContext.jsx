import { createContext, useState, useContext } from 'react';

const ThreadContext = createContext();

export const ThreadContextProvider = ({ children }) => {
    const [activeThreadMessageId, setActiveThreadMessageId] = useState(null);

    const openThread = (messageId) => setActiveThreadMessageId(messageId);
    const closeThread = () => setActiveThreadMessageId(null);

    return (
        <ThreadContext.Provider value={{
            activeThreadMessageId,
            openThread,
            closeThread
        }}>
            {children}
        </ThreadContext.Provider>
    );
};

export const useThread = () => useContext(ThreadContext);
