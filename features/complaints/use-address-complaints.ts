import { useState } from 'react';

import { chicago311Client } from '@/lib/chicago311/client';
import type { Chicago311Client, Complaint } from '@/lib/chicago311/types';

import { filterComplaintsByType, summarizeComplaintTypes, type ComplaintTypeSummary } from './complaint-type-summary';
import { AddressGeocodingError, geocodeChicagoAddress, type ComplaintCoordinates } from './geocoding';

type AddressComplaintsStatus = 'idle' | 'loading' | 'ready' | 'empty' | 'error';

export type AddressComplaintsState = {
  query: string;
  setQuery: (value: string) => void;
  status: AddressComplaintsStatus;
  isSearching: boolean;
  complaints: Complaint[];
  visibleComplaints: Complaint[];
  complaintTypeSummary: ComplaintTypeSummary[];
  selectedComplaintType: string | null;
  selectComplaintType: (value: string | null) => void;
  totalCount: number | null;
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
  const [isSearching, setIsSearching] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaintType, setSelectedComplaintType] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<ComplaintCoordinates | null>(null);

  async function runSearch() {
    if (isSearching) {
      return;
    }

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setStatus('error');
      setErrorMessage('Enter a Chicago address to load nearby complaints.');
      setComplaints([]);
      setTotalCount(null);
      return;
    }

    setIsSearching(true);
    setStatus('loading');
    setErrorMessage(null);
    setSelectedComplaintType(null);

    try {
      const nextCoordinates = await geocodeAddress(trimmedQuery);
      setCoordinates(nextCoordinates);

      const page = await client.getRecentNearbyComplaintsPage({
        latitude: nextCoordinates.latitude,
        longitude: nextCoordinates.longitude,
        radiusMeters: 800,
        daysBack: 7,
        limit: 25,
      });

      setComplaints(page.complaints);
      setTotalCount(page.totalCount);
      setStatus(page.complaints.length > 0 ? 'ready' : 'empty');
    } catch (error) {
      setComplaints([]);
      setTotalCount(null);
      setStatus('error');

      if (error instanceof AddressGeocodingError) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage(error instanceof Error ? error.message : 'Unable to load Chicago 311 data.');
    } finally {
      setIsSearching(false);
    }
  }

  const complaintTypeSummary = summarizeComplaintTypes(complaints);
  const visibleComplaints = filterComplaintsByType(complaints, selectedComplaintType);

  return {
    query,
    setQuery,
    status,
    isSearching,
    complaints,
    visibleComplaints,
    complaintTypeSummary,
    selectedComplaintType,
    selectComplaintType: setSelectedComplaintType,
    totalCount,
    errorMessage,
    coordinates,
    search: () => {
      void runSearch();
    },
  } satisfies AddressComplaintsState;
}
