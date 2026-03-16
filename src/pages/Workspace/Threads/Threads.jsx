export const Threads = () => {

    // TODO: Integrate with backend threads API to load user conversations and thread metadata.

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h1 className="text-base font-semibold text-foreground">
                    Threads
                </h1>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-3">
                {/* Future-ready list container for threads */}
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-sm">
                    You have no thread activity yet.
                </div>
            </div>
        </div>
    );
};

