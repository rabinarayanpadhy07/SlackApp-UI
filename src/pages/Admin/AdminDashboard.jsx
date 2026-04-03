import { AdminConfirmationDialog } from './components/AdminConfirmationDialog';
import { AdminContentSkeleton } from './components/AdminContentSkeleton';
import { AdminDashboardLoader } from './components/AdminDashboardLoader';
import { AdminHeader } from './components/AdminHeader';
import { AdminMetricGrid } from './components/AdminMetricGrid';
import { AdminMobileSectionNav } from './components/AdminMobileSectionNav';
import { AdminOverviewActivity } from './components/AdminOverviewActivity';
import { AdminOverviewHero } from './components/AdminOverviewHero';
import { AdminSidebar } from './components/AdminSidebar';
import { AuditTrailSection } from './components/AuditTrailSection';
import { MessageModerationSection } from './components/MessageModerationSection';
import { PaymentsSection } from './components/PaymentsSection';
import { UserManagementSection } from './components/UserManagementSection';
import { WorkspaceOperationsSection } from './components/WorkspaceOperationsSection';
import { useAuth } from '@/hooks/context/useAuth';
import { useAdminDashboardData } from './hooks/useAdminDashboardData';

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
                                'Are you sure? This action cannot be undone from the user side.',
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
                            'Are you sure? This action cannot be undone.',
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
                            'Are you sure? This action cannot be undone.',
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
    const { auth } = useAuth();
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
        onDeleteMessage,
        onDeleteWorkspace,
        onToggleUserAdmin,
        onToggleUserPlan,
        onToggleUserStatus,
        onToggleWorkspaceArchive,
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
        <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#6a1f6a,_#481349_42%,_#25092b_100%)] text-slate-100">
            <div className="flex h-full">
                <AdminSidebar
                    sections={sections}
                    activeSection={activeSection}
                    onSectionChange={changeSection}
                />

                <div className="flex min-w-0 flex-1 flex-col">
                    <AdminHeader
                        activeSectionLabel={activeSectionLabel}
                        canSearch={canSearch}
                        isSectionFetching={isSectionFetching}
                        profile={auth?.user}
                        searchValue={currentSearch}
                        searchPlaceholder={searchPlaceholder}
                        onSearchChange={(event) => setCurrentSearch(event.target.value)}
                    />

                    <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 lg:px-6">
                        <div className="mx-auto max-w-7xl space-y-6">
                            <AdminMobileSectionNav
                                sections={sections}
                                activeSection={activeSection}
                                onSectionChange={changeSection}
                            />

                            {activeSection === 'dashboard' && (
                                <AdminOverviewHero metrics={metrics} cards={cards} />
                            )}

                            <AdminMetricGrid cards={cards} />
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
