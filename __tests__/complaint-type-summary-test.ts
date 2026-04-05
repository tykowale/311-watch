import { filterComplaintsByType, summarizeComplaintTypes } from '@/features/complaints/complaint-type-summary';

const complaints = [
  {
    id: 'SR-1',
    type: 'Pothole in Street Complaint',
    status: 'Open',
    createdAt: '2026-04-04T12:00:00.000Z',
    address: '100 N STATE ST',
    lat: 41.88,
    lng: -87.63,
    communityArea: '32',
    ward: '42',
  },
  {
    id: 'SR-2',
    type: 'Street Light Out',
    status: 'Open',
    createdAt: '2026-04-04T12:00:00.000Z',
    address: '200 N STATE ST',
    lat: 41.88,
    lng: -87.63,
    communityArea: '32',
    ward: '42',
  },
  {
    id: 'SR-3',
    type: 'Pothole in Street Complaint',
    status: 'Closed',
    createdAt: '2026-04-04T12:00:00.000Z',
    address: '300 N STATE ST',
    lat: 41.88,
    lng: -87.63,
    communityArea: '32',
    ward: '42',
  },
];

describe('complaint type summary', () => {
  test('builds top complaint type counts from current results', () => {
    expect(summarizeComplaintTypes(complaints)).toEqual([
      { type: 'Pothole in Street Complaint', count: 2 },
      { type: 'Street Light Out', count: 1 },
    ]);
  });

  test('filters the current result set by selected type', () => {
    expect(filterComplaintsByType(complaints, 'Street Light Out')).toEqual([complaints[1]]);
    expect(filterComplaintsByType(complaints, null)).toEqual(complaints);
  });
});
