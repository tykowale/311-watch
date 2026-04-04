import { useState } from 'react';

import { chicago311Client } from '@/lib/chicago311/client';
import type { Chicago311Client, Complaint } from '@/lib/chicago311/types';

import { AddressGeocodingError, geocodeChicagoAddress, type ComplaintCoordinates } from './geocoding';

type AddressComplaintsStatus = 'idle' | 'loading' | 'ready' | 'empty' | 'error';

export type AddressComplaintsState = {
  query: string;
  setQuery: (value: string) => void;
  status: AddressComplaintsStatus;
  complaints: Complaint[];
  errorMessage: string | null;
  coordinates: ComplaintCoordinates | null;
  search: () => void;
};

export function useAddressComplaints(options?: {
  client?: Chicago311Client;
  geocodeAddress?: (address: string) => Promise<ComplaintCoordinates>;
  initialQuery?: string;
}) {
  const client = options?.client ?? chicago311Client;
  const geocodeAddress = options?.geocodeAddress ?? geocodeChicagoAddress;
  const [query, setQuery] = useState(options?.initialQuery ?? '1 E State St');
  const [status, setStatus] = useState<AddressComplaintsStatus>('idle');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<ComplaintCoordinates | null>(null);

  async function runSearch() {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setStatus('error');
      setErrorMessage('Enter a Chicago address to load nearby complaints.');
      setComplaints([]);
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    try {
      const nextCoordinates = await geocodeAddress(trimmedQuery);
      setCoordinates(nextCoordinates);

      const nextComplaints = await client.getRecentNearbyComplaints({
        latitude: nextCoordinates.latitude,
        longitude: nextCoordinates.longitude,
        radiusMeters: 800,
        daysBack: 7,
        limit: 25,
      });

      setComplaints(nextComplaints);
      setStatus(nextComplaints.length > 0 ? 'ready' : 'empty');
    } catch (error) {
      setComplaints([]);
      setStatus('error');

      if (error instanceof AddressGeocodingError) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage(error instanceof Error ? error.message : 'Unable to load Chicago 311 data.');
    }
  }

  return {
    query,
    setQuery,
    status,
    complaints,
    errorMessage,
    coordinates,
    search: () => {
      void runSearch();
    },
  } satisfies AddressComplaintsState;
}
