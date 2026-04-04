import * as Location from 'expo-location';

export class LocationPermissionError extends Error {
  constructor() {
    super('Location access is required to load nearby complaints.');
  }
}

export type DeviceCoordinates = {
  latitude: number;
  longitude: number;
};

export async function requestCurrentCoordinates(): Promise<DeviceCoordinates> {
  const permission = await Location.requestForegroundPermissionsAsync();

  if (permission.status !== Location.PermissionStatus.GRANTED) {
    throw new LocationPermissionError();
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}
