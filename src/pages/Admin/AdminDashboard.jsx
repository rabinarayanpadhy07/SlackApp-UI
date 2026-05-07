import { useMemo } from 'react';

import { useFetchWorkspace } from '@/hooks/apis/workspaces/useFetchWorkspace';
import { AdminConfirmationDialog } from './components/AdminConfirmationDialog';
import { AdminContentSkeleton } from './components/AdminContentSkeleton';
import { AdminDashboardLoader } from './components/AdminDashboardLoader';
import { AdminHeader } from './components/AdminHeader';
import { AdminMetricGrid } from './components/AdminMetricGrid';
import { AdminMobileSectionNav } from './components/AdminMobileSectionNav';
import { AdminOverviewActivity } from './components/AdminOverviewActivity';
import { AdminSidebar } from './components/AdminSidebar';
import { AuditTrailSection } from './components/AuditTrailSection';
import { MessageModerationSection } from './components/MessageModerationSection';
import { PaymentsSection } from './components/PaymentsSection';
import { UserManagementSection } from './components/UserManagementSection';
import { WorkspaceOperationsSection } from './components/WorkspaceOperationsSection';
import { useAdminDashboardData } from './hooks/useAdminDashboardData';
import {
    exportAdminRowsToExcel,
    exportAdminRowsToPdf,
    getAdminExportPayload
} from './utils/adminExportUtils';

const renderActiveSection = ({
    activeSection,
    auditLogs,
    auditLogsPagination,
    messages,
    messagesPagination,
    onDeleteMessage,
    onDeleteWorkspace,
    onPageChange,
    onToggleUserAdmin,
    onToggleUserPlan,
    onToggleUserStatus,
    onToggleWorkspaceArchive,
    openConfirmation,
    overview,
    payments,
    paymentsPagination,
    users,
    usersPagination,
    workspaces,
    workspacesPagination,
    isDeletingMessage,
    isDeletingWorkspace,
    isUpdatingUser,
    isUpdatingWorkspace
}) => {
    if (activeSection === 'dashboard') {
        return <AdminOverviewActivity overview={overview} />;
    }

    if (activeSection === 'users') {
        return (
            <UserManagementSection
                users={users}
                pagination={usersPagination}
                onPageChange={onPageChange}
                isUpdating={isUpdatingUser}
                onTogglePlan={onToggleUserPlan}
                onToggleAdmin={onToggleUserAdmin}
                onToggleStatus={(user) =>
                    user.isActive
                        ? openConfirmation({
                            title: 'Suspend user?',
                            description:
                                'This will immediately block the user from normal access until restored.',
                            actionLabel: 'Suspend User',
                            onConfirm: () => onToggleUserStatus(user)
                        })
                        : onToggleUserStatus(user)
                }
            />
        );
    }

    if (activeSection === 'workspaces') {
        return (
            <WorkspaceOperationsSection
                workspaces={workspaces}
                pagination={workspacesPagination}
                onPageChange={onPageChange}
                isUpdating={isUpdatingWorkspace}
                isDeleting={isDeletingWorkspace}
                onToggleArchive={onToggleWorkspaceArchive}
                onDelete={(workspaceId) =>
                    openConfirmation({
                        title: 'Delete workspace?',
                        description:
                            'This permanently removes the workspace and cannot be undone.',
                        actionLabel: 'Delete Workspace',
                        onConfirm: () => onDeleteWorkspace(workspaceId)
                    })
                }
            />
        );
    }

    if (activeSection === 'moderation') {
        return (
            <MessageModerationSection
                messages={messages}
                pagination={messagesPagination}
                onPageChange={onPageChange}
                isDeleting={isDeletingMessage}
                onDelete={(messageId) =>
                    openConfirmation({
                        title: 'Delete message?',
                        description:
                            'This removes the content from the conversation history for users.',
                        actionLabel: 'Delete Message',
                        onConfirm: () => onDeleteMessage(messageId)
                    })
                }
            />
        );
    }

    if (activeSection === 'payments') {
        return (
            <PaymentsSection
                payments={payments}
                pagination={paymentsPagination}
                onPageChange={onPageChange}
            />
        );
    }

    return (
        <AuditTrailSection
            auditLogs={auditLogs}
            pagination={auditLogsPagination}
            onPageChange={onPageChange}
        />
    );
};

export const AdminDashboard = () => {
    const {
        activeSection,
        activeSectionLabel,
        auditLogs,
        auditLogsPagination,
        canSearch,
        cards,
        changeSection,
        closeConfirmation,
        confirmation,
        currentSearch,
        isBootstrapping,
        isDeletingMessage,
        isDeletingWorkspace,
        isSectionFetching,
        isSectionLoading,
        isSubmittingConfirmation,
        isUpdatingUser,
        isUpdatingWorkspace,
        messages,
        messagesPagination,
        metrics,
        deleteMessage: onDeleteMessage,
        deleteWorkspace: onDeleteWorkspace,
        toggleUserAdmin: onToggleUserAdmin,
        toggleUserPlan: onToggleUserPlan,
        toggleUserStatus: onToggleUserStatus,
        toggleWorkspaceArchive: onToggleWorkspaceArchive,
        openConfirmation,
        overview,
        payments,
        paymentsPagination,
        searchPlaceholder,
        sections,
        setCurrentPage,
        setCurrentSearch,
        users,
        usersPagination,
        workspaces,
        workspacesPagination
    } = useAdminDashboardData();

    const exportPayload = useMemo(() => getAdminExportPayload(activeSection, {
        auditLogs,
        messages,
        metrics,
        payments,
        users,
        workspaces
    }), [activeSection, auditLogs, messages, metrics, payments, users, workspaces]);

    const { workspaces: userWorkspaces } = useFetchWorkspace();
    const firstWorkspaceId = userWorkspaces?.[0]?._id;

    if (isBootstrapping) {
        return <AdminDashboardLoader />;
    }

    const handleConfirmAction = async () => {
        try {
            await confirmation.onConfirm?.();
            closeConfirmation();
        } catch {
            // Mutation hooks already surface user-facing errors.
        }
    };

    return (
        <div className="relative flex h-dvh min-h-0 w-full min-w-0 flex-col overflow-hidden bg-[#0a0a0a] text-slate-200 lg:flex-row">
            {/* Background Ambient Glows */}
            <div className="absolute top-0 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-purple-600/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none z-0"></div>
            <div className="absolute bottom-0 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-blue-600/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none z-0"></div>

            <div className="relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col lg:flex-row">
                <AdminSidebar
                    sections={sections}
                    activeSection={activeSection}
                    onSectionChange={changeSection}
                    metrics={metrics}
                />

                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-white/5 bg-transparent lg:border-l">
                    <AdminHeader
                        activeSectionLabel={activeSectionLabel}
                        canExport={Boolean(exportPayload?.rows?.length)}
                        canSearch={canSearch}
                        currentSearch={currentSearch}
                        firstWorkspaceId={firstWorkspaceId}
                        isSectionFetching={isSectionFetching}
                        onExportExcel={() => exportAdminRowsToExcel(exportPayload)}
                        onExportPdf={() => exportAdminRowsToPdf(exportPayload)}
                        onSearchChange={setCurrentSearch}
                        searchPlaceholder={searchPlaceholder}
                    />

                    <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto [contain:content]">
                        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-5 sm:px-5 sm:py-6 lg:gap-6 lg:px-6 lg:pb-8">
                            <AdminMobileSectionNav
                                sections={sections}
                                activeSection={activeSection}
                                onSectionChange={changeSection}
                            />

                            <section aria-label="Key metrics">
                                <h2 className="sr-only">Platform metrics</h2>
                                <AdminMetricGrid cards={cards} />
                            </section>

                            <section aria-label="Section content" className="min-h-[200px]">
                            {isSectionLoading ? (
                                <AdminContentSkeleton />
                            ) : (
                                renderActiveSection({
                                    activeSection,
                                    auditLogs,
                                    auditLogsPagination,
                                    isDeletingMessage,
                                    isDeletingWorkspace,
                                    isUpdatingUser,
                                    isUpdatingWorkspace,
                                    messages,
                                    messagesPagination,
                                    onDeleteMessage,
                                    onDeleteWorkspace,
                                    onPageChange: setCurrentPage,
                                    onToggleUserAdmin,
                                    onToggleUserPlan,
                                    onToggleUserStatus,
                                    onToggleWorkspaceArchive,
                                    openConfirmation,
                                    overview,
                                    payments,
                                    paymentsPagination,
                                    users,
                                    usersPagination,
                                    workspaces,
                                    workspacesPagination
                                })
                            )}
                            </section>
                        </div>
                    </main>
                </div>
            </div>

            <AdminConfirmationDialog
                title={confirmation.title}
                description={confirmation.description}
                actionLabel={confirmation.actionLabel}
                isOpen={confirmation.isOpen}
                isSubmitting={isSubmittingConfirmation}
                onCancel={closeConfirmation}
                onConfirm={handleConfirmAction}
            />
        </div>
    );
};
