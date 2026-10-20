export interface Coordinate {
    latitude: number;
    longitude: number;
}

export interface Path {
    distance: number;
    duration: number;
    wayPoints: [number, number][];
};