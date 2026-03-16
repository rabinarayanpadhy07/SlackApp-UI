export const Drafts = () => {

    // TODO: Integrate with backend drafts API to load and manage saved drafts.

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h1 className="text-base font-semibold text-foreground">
                    Drafts &amp; Sends
                </h1>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-3">
                {/* Future-ready container for saved draft list */}
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-sm">
                    You don&apos;t have any saved drafts yet.
                </div>
            </div>
        </div>
    );
};

