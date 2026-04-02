import { useContext } from 'react';

import UserSettingsModalContext from '@/context/UserSettingsModalContext';

export const useUserSettingsModal = () => {
    return useContext(UserSettingsModalContext);
};
