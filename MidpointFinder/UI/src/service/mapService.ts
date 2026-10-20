import axios from "axios";
import { Coordinate } from "../types/types";

export function getPathBetweenTwoCoordinates(payload: [Coordinate, Coordinate], travelMode: string) {
  // Example payload: [[lat1, lng1], [lat2, lng2]]
  return axios.post("http://localhost:8081/api/routes/path", payload, { params: { travelMode } });
}

export function getMidpoint(payload: [Coordinate, Coordinate], travelMode: string) {
  // Example payload: [[lat1, lng1], [lat2, lng2]]
  return axios.post("http://localhost:8081/api/routes/midpoint", payload, { params: { travelMode } });
}

export function getCoordFromString(coordString: string): Promise<{ status: number; data: [number, number] }> {
    return axios.get(`http://localhost:8081/api/getCoordinatesFromLocation/${coordString}`)
}

export function getAutocompleteSuggestions(coordString: string) {
    return axios.get(`http://localhost:8081/api/getAutoCompleteSuggestions/${coordString}`)
}