import axios from '@/config/axiosConfig';

const withToken = (token) => ({
    headers: {
        'x-access-token': token
    }
});

export const getAdminOverviewRequest = async ({ token }) => {
    const response = await axios.get('/admin/overview', withToken(token));
    return response?.data?.data;
};

export const getAdminUsersRequest = async ({ token }) => {
    const response = await axios.get('/admin/users', withToken(token));
    return response?.data?.data;
};

export const updateAdminUserRequest = async ({
    token,
    userId,
    plan,
    isSuperAdmin,
    isActive
}) => {
    const response = await axios.patch(
        `/admin/users/${userId}`,
        { plan, isSuperAdmin, isActive },
        withToken(token)
    );
    return response?.data?.data;
};

export const getAdminWorkspacesRequest = async ({ token }) => {
    const response = await axios.get('/admin/workspaces', withToken(token));
    return response?.data?.data;
};

export const deleteAdminWorkspaceRequest = async ({ token, workspaceId }) => {
    const response = await axios.delete(`/admin/workspaces/${workspaceId}`, withToken(token));
    return response?.data?.data;
};

export const updateAdminWorkspaceRequest = async ({ token, workspaceId, isArchived }) => {
    const response = await axios.patch(
        `/admin/workspaces/${workspaceId}`,
        { isArchived },
        withToken(token)
    );
    return response?.data?.data;
};

export const getAdminPaymentsRequest = async ({ token }) => {
    const response = await axios.get('/admin/payments', withToken(token));
    return response?.data?.data;
};

export const getAdminMessagesRequest = async ({ token, search = '' }) => {
    const response = await axios.get('/admin/messages', {
        ...withToken(token),
        params: {
            search
        }
    });
    return response?.data?.data;
};

export const deleteAdminMessageRequest = async ({ token, messageId }) => {
    const response = await axios.delete(`/admin/messages/${messageId}`, withToken(token));
    return response?.data?.data;
};

export const getAdminAuditLogsRequest = async ({ token }) => {
    const response = await axios.get('/admin/audit-logs', withToken(token));
    return response?.data?.data;
};
