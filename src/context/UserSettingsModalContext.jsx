import { createContext, useState } from 'react';

const UserSettingsModalContext = createContext();

export const UserSettingsModalContextProvider = ({ children }) => {
    const [openUserSettingsModal, setOpenUserSettingsModal] = useState(false);

    return (
        <UserSettingsModalContext.Provider value={{ openUserSettingsModal, setOpenUserSettingsModal }}>
            {children}
        </UserSettingsModalContext.Provider>
    );
};

export default UserSettingsModalContext;
