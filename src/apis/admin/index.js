import axios from '@/config/axiosConfig';

const withParams = (params = {}) => ({
    params
});

export const getAdminOverviewRequest = async () => {
    const response = await axios.get('/admin/overview');
    return response?.data?.data;
};

export const getAdminUsersRequest = async ({ page = 1, limit = 10, search = '' }) => {
    const response = await axios.get(
        '/admin/users',
        withParams({ page, limit, search })
    );
    return response?.data?.data;
};

export const updateAdminUserRequest = async ({
    userId,
    plan,
    isSuperAdmin,
    isActive
}) => {
    const response = await axios.patch(
        `/admin/users/${userId}`,
        { plan, isSuperAdmin, isActive }
    );
    return response?.data?.data;
};

export const getAdminWorkspacesRequest = async ({
    page = 1,
    limit = 10,
    search = ''
}) => {
    const response = await axios.get(
        '/admin/workspaces',
        withParams({ page, limit, search })
    );
    return response?.data?.data;
};

export const deleteAdminWorkspaceRequest = async ({ workspaceId }) => {
    const response = await axios.delete(`/admin/workspaces/${workspaceId}`);
    return response?.data?.data;
};

export const updateAdminWorkspaceRequest = async ({ workspaceId, isArchived }) => {
    const response = await axios.patch(
        `/admin/workspaces/${workspaceId}`,
        { isArchived }
    );
    return response?.data?.data;
};

export const getAdminPaymentsRequest = async ({ page = 1, limit = 10 }) => {
    const response = await axios.get('/admin/payments', withParams({ page, limit }));
    return response?.data?.data;
};

export const getAdminMessagesRequest = async ({
    page = 1,
    limit = 10,
    search = ''
}) => {
    const response = await axios.get(
        '/admin/messages',
        withParams({ page, limit, search })
    );
    return response?.data?.data;
};

export const deleteAdminMessageRequest = async ({ messageId }) => {
    const response = await axios.delete(`/admin/messages/${messageId}`);
    return response?.data?.data;
};

export const getAdminAuditLogsRequest = async ({ page = 1, limit = 10 }) => {
    const response = await axios.get('/admin/audit-logs', withParams({ page, limit }));
    return response?.data?.data;
};
