import type { Coordinates } from "../types/Coordinates";
import { getDistanceInMetersBetweenCoordinates } from "./getDistanceInMetersBetweenCoordinates";

export function getDistanceInSecondsBetweenCoordinates(
  first: Coordinates,
  second: Coordinates,
): number {
  const averageWalkingSpeed = 1.3; // Average human walking speed in meters per second
  const distanceInMeters = getDistanceInMetersBetweenCoordinates(first, second);
  const timeInMinutes = distanceInMeters / averageWalkingSpeed;
  return Math.round(timeInMinutes);
}
