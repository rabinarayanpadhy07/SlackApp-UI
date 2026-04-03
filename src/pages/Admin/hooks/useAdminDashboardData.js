import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
    getAdminAuditLogsRequest,
    getAdminMessagesRequest,
    getAdminOverviewRequest,
    getAdminPaymentsRequest,
    getAdminUsersRequest,
    getAdminWorkspacesRequest
} from '@/apis/admin';
import { getAdminMetricCards } from '../utils/adminDashboardUtils';
import { useAdminDashboardMutations } from './useAdminDashboardMutations';
import { useAdminDashboardState } from './useAdminDashboardState';

const SHARED_QUERY_OPTIONS = {
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000
};

const EMPTY_PAGINATED = {
    items: [],
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    }
};

export const useAdminDashboardData = () => {
    const state = useAdminDashboardState();
    const mutations = useAdminDashboardMutations();
    const { activeSection, currentPage, currentSearch } = state;

    const overviewQuery = useQuery({
        queryKey: ['admin-overview'],
        queryFn: getAdminOverviewRequest,
        ...SHARED_QUERY_OPTIONS
    });

    const usersQuery = useQuery({
        queryKey: ['admin-users', currentPage, currentSearch],
        queryFn: () =>
            getAdminUsersRequest({
                page: currentPage,
                limit: 10,
                search: currentSearch
            }),
        enabled: activeSection === 'users',
        placeholderData: (previousData) => previousData,
        ...SHARED_QUERY_OPTIONS
    });

    const workspacesQuery = useQuery({
        queryKey: ['admin-workspaces', currentPage, currentSearch],
        queryFn: () =>
            getAdminWorkspacesRequest({
                page: currentPage,
                limit: 10,
                search: currentSearch
            }),
        enabled: activeSection === 'workspaces',
        placeholderData: (previousData) => previousData,
        ...SHARED_QUERY_OPTIONS
    });

    const messagesQuery = useQuery({
        queryKey: ['admin-messages', currentPage, currentSearch],
        queryFn: () =>
            getAdminMessagesRequest({
                page: currentPage,
                limit: 10,
                search: currentSearch
            }),
        enabled: activeSection === 'moderation',
        placeholderData: (previousData) => previousData,
        ...SHARED_QUERY_OPTIONS
    });

    const paymentsQuery = useQuery({
        queryKey: ['admin-payments', currentPage],
        queryFn: () =>
            getAdminPaymentsRequest({
                page: currentPage,
                limit: 10
            }),
        enabled: activeSection === 'payments',
        placeholderData: (previousData) => previousData,
        ...SHARED_QUERY_OPTIONS
    });

    const auditLogsQuery = useQuery({
        queryKey: ['admin-audit-logs', currentPage],
        queryFn: () =>
            getAdminAuditLogsRequest({
                page: currentPage,
                limit: 10
            }),
        enabled: activeSection === 'audit-logs',
        placeholderData: (previousData) => previousData,
        ...SHARED_QUERY_OPTIONS
    });

    const overview = useMemo(() => overviewQuery.data || {}, [overviewQuery.data]);
    const metrics = useMemo(() => overview.metrics || {}, [overview]);
    const cards = useMemo(() => getAdminMetricCards(metrics), [metrics]);

    const activeQuery = {
        'audit-logs': auditLogsQuery,
        dashboard: overviewQuery,
        moderation: messagesQuery,
        payments: paymentsQuery,
        users: usersQuery,
        workspaces: workspacesQuery
    }[activeSection];

    const usersData = usersQuery.data || EMPTY_PAGINATED;
    const workspacesData = workspacesQuery.data || EMPTY_PAGINATED;
    const messagesData = messagesQuery.data || EMPTY_PAGINATED;
    const paymentsData = paymentsQuery.data || EMPTY_PAGINATED;
    const auditLogsData = auditLogsQuery.data || EMPTY_PAGINATED;

    return {
        ...state,
        cards,
        metrics,
        overview,
        users: usersData.items,
        usersPagination: usersData.pagination,
        workspaces: workspacesData.items,
        workspacesPagination: workspacesData.pagination,
        messages: messagesData.items,
        messagesPagination: messagesData.pagination,
        payments: paymentsData.items,
        paymentsPagination: paymentsData.pagination,
        auditLogs: auditLogsData.items,
        auditLogsPagination: auditLogsData.pagination,
        isBootstrapping: overviewQuery.isLoading && !overviewQuery.data,
        isSectionFetching:
            activeSection !== 'dashboard' &&
            Boolean(activeQuery?.isFetching && activeQuery?.data),
        isSectionLoading:
            activeSection !== 'dashboard' &&
            Boolean(activeQuery?.isLoading && !activeQuery?.data),
        isSubmittingConfirmation:
            mutations.isDeletingMessage ||
            mutations.isDeletingWorkspace ||
            mutations.isUpdatingUser ||
            mutations.isUpdatingWorkspace,
        ...mutations
    };
};
