import type { NearbyComplaintsParams } from './types';

const DEFAULT_BASE_URL = 'https://data.cityofchicago.org/resource/v6vf-nfxy.json';

function formatIsoDate(daysBack: number, now: Date) {
  const date = new Date(now);
  date.setUTCDate(date.getUTCDate() - daysBack);
  return date.toISOString();
}

export function buildRecentNearbyComplaintsUrl(
  params: NearbyComplaintsParams,
  options?: { baseUrl?: string; now?: Date }
) {
  const { latitude, longitude, radiusMeters, daysBack, limit = 25 } = params;
  const baseUrl = options?.baseUrl ?? DEFAULT_BASE_URL;
  const now = options?.now ?? new Date();
  const createdAfter = formatIsoDate(daysBack, now);
  const search = new URLSearchParams({
    $select: [
      'sr_number',
      'sr_type',
      'status',
      'created_date',
      'last_modified_date',
      'closed_date',
      'street_address',
      'latitude',
      'longitude',
      'community_area',
      'ward',
      'zip_code',
      'duplicate',
      'parent_sr_number',
      'origin',
    ].join(','),
    $where: [
      'duplicate = false',
      'latitude IS NOT NULL',
      'longitude IS NOT NULL',
      "sr_type != '311 INFORMATION ONLY CALL'",
      `created_date >= '${createdAfter}'`,
      `within_circle(location, ${latitude}, ${longitude}, ${radiusMeters})`,
    ].join(' AND '),
    $order: 'created_date DESC, sr_number DESC',
    $limit: String(limit),
  });

  return `${baseUrl}?${search.toString()}`;
}
