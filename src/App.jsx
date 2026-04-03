import './App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Modals } from '@/components/organisms/Modals/Modals';
import { AppContextProvider } from '@/context/AppContextProvider';
import { AppRoutes } from '@/Routes';
import { Toaster } from 'sonner';

import { TooltipProvider } from '@/components/ui/tooltip';

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
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <TooltipProvider>
          <AppRoutes />
          <Modals />
        </TooltipProvider>
        {/* <WorkspacePreferencesModal /> */}
      </AppContextProvider>
      <Toaster position="bottom-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
