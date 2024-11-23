interface parkingSegment {
    segmentId: number;
    start: geoPoint
    end: geoPoint
    maxParkingCapacity: number;
    freeParkingCapacity: number;
}

type geoPoint = [number, number];