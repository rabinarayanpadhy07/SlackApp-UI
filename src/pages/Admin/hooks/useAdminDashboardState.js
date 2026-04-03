import { useMemo, useState } from 'react';

const SECTION_SEARCH_PLACEHOLDERS = {
    'audit-logs': 'Search is not needed for audit logs yet',
    dashboard: 'Search a section from the sidebar',
    moderation: 'Search messages by body, sender, or channel',
    payments: 'Search is not needed for payments yet',
    users: 'Search users by name, email, plan, or status',
    workspaces: 'Search workspaces by name, description, or status'
};

const DEFAULT_PAGES = {
    'audit-logs': 1,
    dashboard: 1,
    moderation: 1,
    payments: 1,
    users: 1,
    workspaces: 1
};

export const ADMIN_SECTIONS = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'users', label: 'Users' },
    { key: 'workspaces', label: 'Workspaces' },
    { key: 'moderation', label: 'Moderation' },
    { key: 'payments', label: 'Payments' },
    { key: 'audit-logs', label: 'Audit Logs' }
];

export const useAdminDashboardState = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [searches, setSearches] = useState({
        moderation: '',
        users: '',
        workspaces: ''
    });
    const [pages, setPages] = useState(DEFAULT_PAGES);
    const [confirmation, setConfirmation] = useState({
        actionLabel: '',
        description: '',
        isOpen: false,
        onConfirm: null,
        title: ''
    });

    const activeSectionLabel = useMemo(
        () =>
            ADMIN_SECTIONS.find((section) => section.key === activeSection)?.label ||
            'Dashboard',
        [activeSection]
    );

    const canSearch = ['users', 'workspaces', 'moderation'].includes(activeSection);
    const currentSearch = searches[activeSection] || '';
    const currentPage = pages[activeSection] || 1;

    const setCurrentSearch = (value) => {
        if (!canSearch) return;

        setSearches((previous) => ({
            ...previous,
            [activeSection]: value
        }));
        setPages((previous) => ({
            ...previous,
            [activeSection]: 1
        }));
    };

    const setCurrentPage = (page) => {
        setPages((previous) => ({
            ...previous,
            [activeSection]: page
        }));
    };

    const changeSection = (sectionKey) => {
        setActiveSection(sectionKey);
    };

    const openConfirmation = (config) => {
        setConfirmation({
            actionLabel: config.actionLabel,
            description: config.description,
            isOpen: true,
            onConfirm: config.onConfirm,
            title: config.title
        });
    };

    const closeConfirmation = () => {
        setConfirmation({
            actionLabel: '',
            description: '',
            isOpen: false,
            onConfirm: null,
            title: ''
        });
    };

    return {
        activeSection,
        activeSectionLabel,
        canSearch,
        confirmation,
        currentPage,
        currentSearch,
        sections: ADMIN_SECTIONS,
        searchPlaceholder: SECTION_SEARCH_PLACEHOLDERS[activeSection],
        changeSection,
        closeConfirmation,
        openConfirmation,
        setCurrentPage,
        setCurrentSearch
    };
};
