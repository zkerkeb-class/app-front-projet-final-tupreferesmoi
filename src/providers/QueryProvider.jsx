import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // Données considérées comme fraîches pendant 5 minutes
            cacheTime: 1000 * 60 * 30, // Cache conservé pendant 30 minutes
            refetchOnWindowFocus: false, // Désactive le refetch automatique au focus
            retry: 1, // Réessaie une fois en cas d'échec
        },
    },
});

export const QueryProvider = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
        </QueryClientProvider>
    );
}; 