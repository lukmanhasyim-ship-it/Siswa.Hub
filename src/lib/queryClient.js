import { QueryClient } from '@tanstack/react-query';

// Cache data GAS hidup di memori tab, bukan di localStorage/service worker.
// Data sensitif siswa sengaja tidak dipersistensi ke storage.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 15 * 60_000,
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});
