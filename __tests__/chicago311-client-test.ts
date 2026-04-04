import { createChicago311Client } from '@/lib/chicago311/client';
import { normalizeComplaint } from '@/lib/chicago311/normalize';
import { buildRecentNearbyComplaintsCountUrl, buildRecentNearbyComplaintsUrl } from '@/lib/chicago311/queries';

describe('Chicago 311 client', () => {
  test('builds a nearby complaints query with minimal filters', () => {
    const url = buildRecentNearbyComplaintsUrl(
      {
        latitude: 41.88,
        longitude: -87.63,
        radiusMeters: 800,
        daysBack: 7,
        limit: 10,
      },
      {
        baseUrl: 'https://example.test/311.json',
        now: new Date('2026-04-05T00:00:00.000Z'),
      }
    );

    expect(url).toContain('https://example.test/311.json?');
    expect(url).toContain('duplicate+%3D+false');
    expect(url).toContain('sr_type+%21%3D+%27311+INFORMATION+ONLY+CALL%27');
    expect(url).toContain('within_circle%28location%2C+41.88%2C+-87.63%2C+800%29');
    expect(url).toContain('created_date+%3E%3D+%272026-03-29T00%3A00%3A00.000%27');
  });

  test('builds a nearby complaints count query with matching filters', () => {
    const url = buildRecentNearbyComplaintsCountUrl(
      {
        latitude: 41.88,
        longitude: -87.63,
        radiusMeters: 800,
        daysBack: 7,
        limit: 10,
      },
      {
        baseUrl: 'https://example.test/311.json',
        now: new Date('2026-04-05T00:00:00.000Z'),
      }
    );

    expect(url).toContain('%24select=count%28*%29+as+total');
    expect(url).toContain('duplicate+%3D+false');
    expect(url).toContain('within_circle%28location%2C+41.88%2C+-87.63%2C+800%29');
  });

  test('normalizes a Socrata row into an app complaint', () => {
    expect(
      normalizeComplaint({
        sr_number: 'SR-1',
        sr_type: 'Pothole in Street Complaint',
        status: 'Open',
        created_date: '2026-04-04T12:00:00.000',
        street_address: '100 N STATE ST',
        latitude: '41.1',
        longitude: '-87.1',
        community_area: '32',
        ward: '42',
        duplicate: false,
      })
    ).toEqual({
      id: 'SR-1',
      type: 'Pothole in Street Complaint',
      status: 'Open',
      createdAt: '2026-04-04T12:00:00.000',
      address: '100 N STATE ST',
      lat: 41.1,
      lng: -87.1,
      communityArea: '32',
      ward: '42',
    });
  });

  test('filters noisy rows out of the app model', () => {
    expect(
      normalizeComplaint({
        sr_number: 'SR-2',
        sr_type: '311 INFORMATION ONLY CALL',
        created_date: '2026-04-04T12:00:00.000',
        latitude: '41.1',
        longitude: '-87.1',
        duplicate: false,
      })
    ).toBeNull();

    expect(
      normalizeComplaint({
        sr_number: 'SR-3',
        sr_type: 'Graffiti Removal Request',
        created_date: '2026-04-04T12:00:00.000',
        latitude: '41.1',
        longitude: '-87.1',
        duplicate: 'true',
      })
    ).toBeNull();
  });

  test('returns normalized complaints from the API client', async () => {
    const fetchFn: typeof fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            sr_number: 'SR-4',
            sr_type: 'Street Light Out',
            status: 'Completed',
            created_date: '2026-04-04T12:00:00.000',
            latitude: '41.2',
            longitude: '-87.2',
            duplicate: false,
          },
        ],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ total: '42' }],
      } as Response);

    const client = createChicago311Client({
      baseUrl: 'https://example.test/311.json',
      fetchFn,
      timeoutMs: 100,
    });

    await expect(
      client.getRecentNearbyComplaints({
        latitude: 41.88,
        longitude: -87.63,
        radiusMeters: 800,
        daysBack: 7,
      })
    ).resolves.toEqual([
      {
        id: 'SR-4',
        type: 'Street Light Out',
        status: 'Completed',
        createdAt: '2026-04-04T12:00:00.000',
        address: null,
        lat: 41.2,
        lng: -87.2,
        communityArea: null,
        ward: null,
      },
    ]);
  });

  test('returns first-page complaints with total count', async () => {
    const fetchFn: typeof fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            sr_number: 'SR-5',
            sr_type: 'Tree Debris Clean-Up Request',
            status: 'Open',
            created_date: '2026-04-04T12:00:00.000',
            latitude: '41.2',
            longitude: '-87.2',
            duplicate: false,
          },
        ],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ total: '88' }],
      } as Response);

    const client = createChicago311Client({
      baseUrl: 'https://example.test/311.json',
      fetchFn,
      timeoutMs: 100,
    });

    await expect(
      client.getRecentNearbyComplaintsPage({
        latitude: 41.88,
        longitude: -87.63,
        radiusMeters: 800,
        daysBack: 7,
      })
    ).resolves.toEqual({
      complaints: [
        {
          id: 'SR-5',
          type: 'Tree Debris Clean-Up Request',
          status: 'Open',
          createdAt: '2026-04-04T12:00:00.000',
          address: null,
          lat: 41.2,
          lng: -87.2,
          communityArea: null,
          ward: null,
        },
      ],
      totalCount: 88,
    });
  });
});
