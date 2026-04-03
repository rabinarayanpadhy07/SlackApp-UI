import './App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { AppErrorFallback } from '@/components/AppErrorFallback';
import { Modals } from '@/components/organisms/Modals/Modals';
import { AppContextProvider } from '@/context/AppContextProvider';
import { AppRoutes } from '@/Routes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ClientErrorBoundary, reportClientError } from '@/lib/monitoring';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

function App() {
  return (
    <ClientErrorBoundary
      fallback={<AppErrorFallback />}
      onError={(error, componentStack) => {
        reportClientError(error, {
          source: 'react.error-boundary',
          componentStack
        });
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <TooltipProvider>
            <AppRoutes />
            <Modals />
          </TooltipProvider>
        </AppContextProvider>
        <Toaster position="bottom-right" richColors />
      </QueryClientProvider>
    </ClientErrorBoundary>
  );
}

export default App;
