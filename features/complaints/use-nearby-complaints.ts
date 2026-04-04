import { useCallback, useEffect, useState } from 'react';

import { chicago311Client } from '@/lib/chicago311/client';
import type { Chicago311Client, Complaint } from '@/lib/chicago311/types';

import { LocationPermissionError, requestCurrentCoordinates, type DeviceCoordinates } from './location';

type NearbyComplaintsStatus = 'loading' | 'ready' | 'empty' | 'error' | 'permission-denied';

export type NearbyComplaintsState = {
  status: NearbyComplaintsStatus;
  complaints: Complaint[];
  errorMessage: string | null;
  coordinates: DeviceCoordinates | null;
  refresh: () => void;
  requestLocationAccess: () => void;
};

export function useNearbyComplaints(options?: {
  client?: Chicago311Client;
  getCoordinates?: () => Promise<DeviceCoordinates>;
}) {
  const client = options?.client ?? chicago311Client;
  const getCoordinates = options?.getCoordinates ?? requestCurrentCoordinates;
  const [status, setStatus] = useState<NearbyComplaintsStatus>('loading');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<DeviceCoordinates | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    setErrorMessage(null);

    try {
      const currentCoordinates = await getCoordinates();
      setCoordinates(currentCoordinates);

      const nextComplaints = await client.getRecentNearbyComplaints({
        latitude: currentCoordinates.latitude,
        longitude: currentCoordinates.longitude,
        radiusMeters: 800,
        daysBack: 7,
        limit: 25,
      });

      setComplaints(nextComplaints);
      setStatus(nextComplaints.length > 0 ? 'ready' : 'empty');
    } catch (error) {
      setComplaints([]);

      if (error instanceof LocationPermissionError) {
        setStatus('permission-denied');
        return;
      }

      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load Chicago 311 data.');
    }
  }, [client, getCoordinates]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    status,
    complaints,
    errorMessage,
    coordinates,
    refresh: () => {
      void load();
    },
    requestLocationAccess: () => {
      void load();
    },
  } satisfies NearbyComplaintsState;
}
