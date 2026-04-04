import * as Location from 'expo-location';

export class AddressGeocodingError extends Error {
  constructor(message = 'We could not locate that Chicago address.') {
    super(message);
  }
}

export type ComplaintCoordinates = {
  latitude: number;
  longitude: number;
};

export async function geocodeChicagoAddress(address: string): Promise<ComplaintCoordinates> {
  const query = address.toLowerCase().includes('chicago') ? address : `${address}, Chicago, IL`;
  const results = await Location.geocodeAsync(query);

  const firstResult = results[0];

  if (!firstResult) {
    throw new AddressGeocodingError();
  }

  return {
    latitude: firstResult.latitude,
    longitude: firstResult.longitude,
  };
}
