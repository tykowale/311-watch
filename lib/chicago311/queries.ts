import type { NearbyComplaintsParams } from './types';

const DEFAULT_BASE_URL = 'https://data.cityofchicago.org/resource/v6vf-nfxy.json';

function formatIsoDate(daysBack: number, now: Date) {
  const date = new Date(now);
  date.setUTCDate(date.getUTCDate() - daysBack);
  return date.toISOString().replace('Z', '');
}

function buildNearbyComplaintsWhereClause(params: NearbyComplaintsParams, now: Date) {
  const { latitude, longitude, radiusMeters, daysBack } = params;
  const createdAfter = formatIsoDate(daysBack, now);

  return [
    'duplicate = false',
    'latitude IS NOT NULL',
    'longitude IS NOT NULL',
    "sr_type != '311 INFORMATION ONLY CALL'",
    `created_date >= '${createdAfter}'`,
    `within_circle(location, ${latitude}, ${longitude}, ${radiusMeters})`,
  ].join(' AND ');
}

export function buildRecentNearbyComplaintsUrl(
  params: NearbyComplaintsParams,
  options?: { baseUrl?: string; now?: Date }
) {
  const { limit = 25 } = params;
  const baseUrl = options?.baseUrl ?? DEFAULT_BASE_URL;
  const now = options?.now ?? new Date();
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
    $where: buildNearbyComplaintsWhereClause(params, now),
    $order: 'created_date DESC, sr_number DESC',
    $limit: String(limit),
  });

  return `${baseUrl}?${search.toString()}`;
}

export function buildRecentNearbyComplaintsCountUrl(
  params: NearbyComplaintsParams,
  options?: { baseUrl?: string; now?: Date }
) {
  const baseUrl = options?.baseUrl ?? DEFAULT_BASE_URL;
  const now = options?.now ?? new Date();
  const search = new URLSearchParams({
    $select: 'count(*) as total',
    $where: buildNearbyComplaintsWhereClause(params, now),
  });

  return `${baseUrl}?${search.toString()}`;
}
