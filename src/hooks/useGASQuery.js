import { useQuery } from '@tanstack/react-query';
import { fetchGAS, gasQueryKey } from '../utils/gasClient';

/**
 * Hook untuk pemakaian baru. Halaman lama masih memakai fetchGAS langsung,
 * tetapi tetap mendapat cache/dedup karena fetchGAS kini berbasis QueryClient.
 */
export function useGASQuery(action, payload = {}, options = {}) {
  return useQuery({
    queryKey: gasQueryKey(action, payload),
    queryFn: () => fetchGAS(action, payload),
    ...options,
  });
}
