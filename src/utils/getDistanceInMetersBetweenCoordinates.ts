import { Coordinates } from "../types/Coordinates";

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function getDistanceInMetersBetweenCoordinates(
  first: Coordinates,
  second: Coordinates,
): number {
  const earthRadius = 6371000; // in meters
  const dLat = deg2rad(second.latitude - first.latitude);
  const dLon = deg2rad(second.longitude - second.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(first.latitude)) *
      Math.cos(deg2rad(first.longitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;
  return Math.round(distance);
}
