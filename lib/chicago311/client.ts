import { fetchJson } from './http';
import { normalizeComplaints } from './normalize';
import { buildRecentNearbyComplaintsUrl } from './queries';
import type { Chicago311Client, Chicago311RawComplaint, NearbyComplaintsParams } from './types';

export function createChicago311Client(options?: {
  baseUrl?: string;
  fetchFn?: typeof fetch;
  timeoutMs?: number;
}): Chicago311Client {
  return {
    async getRecentNearbyComplaints(params: NearbyComplaintsParams) {
      const url = buildRecentNearbyComplaintsUrl(params, { baseUrl: options?.baseUrl });
      const rows = await fetchJson<Chicago311RawComplaint[]>(url, {
        fetchFn: options?.fetchFn,
        timeoutMs: options?.timeoutMs,
      });

      return normalizeComplaints(rows);
    },
  };
}

export const chicago311Client = createChicago311Client();
