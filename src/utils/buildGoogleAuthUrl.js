import { APP_ORIGIN, BACKEND_API_URL } from '@/config/runtimeConfig';

export const buildGoogleAuthUrl = () => {
    const url = new URL(`${BACKEND_API_URL}/users/google`);
    url.searchParams.set('origin', APP_ORIGIN);
    return url.toString();
};
