import type { Chicago311RawComplaint, Complaint } from './types';

function parseNumber(value?: string | number) {
  if (typeof value === 'number') {
    return value;
  }

  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isDuplicate(value?: boolean | string) {
  return value === true || value === 'true';
}

export function normalizeComplaint(row: Chicago311RawComplaint): Complaint | null {
  if (!row.sr_number || !row.sr_type || !row.created_date || isDuplicate(row.duplicate)) {
    return null;
  }

  if (row.sr_type === '311 INFORMATION ONLY CALL') {
    return null;
  }

  const lat = parseNumber(row.latitude);
  const lng = parseNumber(row.longitude);

  if (lat === null || lng === null) {
    return null;
  }

  return {
    id: row.sr_number,
    type: row.sr_type,
    status: row.status ?? 'Unknown',
    createdAt: row.created_date,
    address: row.street_address ?? null,
    lat,
    lng,
    communityArea: row.community_area ?? null,
    ward: row.ward ?? null,
  };
}

export function normalizeComplaints(rows: Chicago311RawComplaint[]) {
  return rows.flatMap((row) => {
    const complaint = normalizeComplaint(row);
    return complaint ? [complaint] : [];
  });
}
