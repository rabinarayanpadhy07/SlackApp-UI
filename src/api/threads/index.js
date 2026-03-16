import axios from '@/config/axiosConfig';

export const getThreadMessagesRequest = async ({ workspaceId, threadId, token }) => {
    try {
        const response = await axios.get(`/workspaces/${workspaceId}/threads/${threadId}/messages`, {
            headers: {
                'x-access-token': token
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching thread messages:', error);
        throw error;
    }
};
