export const Auth = ({ children }) => {
    // Layout for auth related pages
    return (
        <div
            className="flex min-h-[100svh] items-center justify-center bg-slack px-4 py-6 sm:px-6 sm:py-8"
        >
            <div className="w-full max-w-sm sm:max-w-md">
                {children}
            </div>
        </div>
    );
};
