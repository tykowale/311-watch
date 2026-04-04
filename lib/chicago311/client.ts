import { fetchJson } from './http';
import { normalizeComplaints } from './normalize';
import { buildRecentNearbyComplaintsCountUrl, buildRecentNearbyComplaintsUrl } from './queries';
import type {
  Chicago311Client,
  Chicago311RawComplaint,
  NearbyComplaintsPage,
  NearbyComplaintsParams,
} from './types';

export function createChicago311Client(options?: {
  baseUrl?: string;
  fetchFn?: typeof fetch;
  timeoutMs?: number;
}): Chicago311Client {
  async function getRecentNearbyComplaintsPage(params: NearbyComplaintsParams): Promise<NearbyComplaintsPage> {
    const complaintsUrl = buildRecentNearbyComplaintsUrl(params, { baseUrl: options?.baseUrl });
    const countUrl = buildRecentNearbyComplaintsCountUrl(params, { baseUrl: options?.baseUrl });

    const [rows, countRows] = await Promise.all([
      fetchJson<Chicago311RawComplaint[]>(complaintsUrl, {
        fetchFn: options?.fetchFn,
        timeoutMs: options?.timeoutMs,
      }),
      fetchJson<Array<{ total?: string }>>(countUrl, {
        fetchFn: options?.fetchFn,
        timeoutMs: options?.timeoutMs,
      }),
    ]);

    return {
      complaints: normalizeComplaints(rows),
      totalCount: Number(countRows[0]?.total ?? 0),
    };
  }

  return {
    async getRecentNearbyComplaints(params: NearbyComplaintsParams) {
      const page = await getRecentNearbyComplaintsPage(params);
      return page.complaints;
    },
    getRecentNearbyComplaintsPage,
  };
}

export const chicago311Client = createChicago311Client();
