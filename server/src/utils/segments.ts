export function distanceBetweenPointAndSegment(point: geoPoint, segment: parkingSegment) {
    const { start, end } = segment;
    const [x1, y1] = start;
    const [x2, y2] = end;
    const [x0, y0] = point;
    const numerator = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1);
    const denominator = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
    return numerator / denominator;
}

export function findNerestSegmentToPoint(segments: parkingSegment[], point:geoPoint) {
    let nearestSegment = null as parkingSegment | null;
    let nearestDistance = Infinity;
    for (const segment of segments) {
        const distance = distanceBetweenPointAndSegment(point, segment);
        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestSegment = segment;
        }
    }
    return nearestSegment;
}