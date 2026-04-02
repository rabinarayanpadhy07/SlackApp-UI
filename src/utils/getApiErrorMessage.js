export const getApiErrorMessage = (error, fallback = 'Something went wrong.') => {
    const detail = error?.err ?? error?.response?.data?.err;
    const message = error?.message ?? error?.response?.data?.message;

    if (Array.isArray(detail) && detail.length > 0) {
        return detail.join(', ');
    }

    if (typeof detail === 'string' && detail.trim()) {
        return detail;
    }

    if (typeof message === 'string' && message.trim()) {
        return message;
    }

    return fallback;
};
