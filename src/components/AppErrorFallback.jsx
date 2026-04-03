import { Button } from '@/components/ui/button';

export const AppErrorFallback = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-white/70">
          We logged the issue. Refresh the page to try again.
        </p>
        <Button className="mt-6" onClick={() => globalThis.location?.reload()}>
          Reload app
        </Button>
      </div>
    </div>
  );
};
