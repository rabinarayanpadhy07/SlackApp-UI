import defaultAvatar from '@/assets/default-avatar.png';

export const getAvatarUrl = (user) => {
    return user?.profilePicture || defaultAvatar;
};
