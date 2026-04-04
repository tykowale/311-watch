export type Chicago311RawComplaint = {
  sr_number?: string;
  sr_type?: string;
  status?: string;
  created_date?: string;
  last_modified_date?: string;
  closed_date?: string;
  street_address?: string;
  latitude?: string | number;
  longitude?: string | number;
  community_area?: string;
  ward?: string;
  zip_code?: string;
  duplicate?: boolean | string;
  parent_sr_number?: string;
  origin?: string;
};

export type NearbyComplaintsParams = {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  daysBack: number;
  limit?: number;
};

export type Complaint = {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  address: string | null;
  lat: number;
  lng: number;
  communityArea: string | null;
  ward: string | null;
};

export type Chicago311Client = {
  getRecentNearbyComplaints: (params: NearbyComplaintsParams) => Promise<Complaint[]>;
};
