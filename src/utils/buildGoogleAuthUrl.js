export const buildGoogleAuthUrl = () => {
    const url = new URL(`${import.meta.env.VITE_BACKEND_API_URL}/users/google`);
    url.searchParams.set('origin', window.location.origin);
    return url.toString();
};
