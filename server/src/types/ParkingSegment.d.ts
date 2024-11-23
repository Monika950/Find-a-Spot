interface parkingSegment {
    segmentId: number;
    start: {
        longitude: number;
        latitude: number;
    }
    end: {
        longitude: number;
        latitude: number;
    }
    maxParkingCapacity: number;
}