import { Coordinate } from "../types/types";

export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters.toFixed(0)} m`;
  }
  if (meters < 10000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds.toFixed(0)} sec`;
  }
  if (seconds < 3600) {
    return `${(seconds / 60).toFixed(0)} min`;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};

export const getLatLngObj = (arr: [number, number]): Coordinate => {
  return {
    latitude: arr[0],
    longitude: arr[1],
  };
};
