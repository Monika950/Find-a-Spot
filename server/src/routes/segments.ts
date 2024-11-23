import express, { Request, Response, NextFunction } from "express";
import { useAuthenticate } from "./auth";
import { getSegments, getParkedCars } from "../database/parkingSegments";
import { distanceBetweenPointAndSegment } from "../utils/segments";

const router = express.Router();

const RADIUS_INMETERS = 0.01 / 60;

router.post("/", useAuthenticate, async (req: Request, res: Response) => {
    try {
        const { location } = req.body;
        if (!location) {
            console.log("No location");
            res.status(400).json({ message: "Position is required." });
            return;
        }
        const [x, y] = [location.latitude, location.longitude]
        if (isNaN(x) || isNaN(y)) {
            res.status(400).json({ message: "Invalid position." });
            return;
        }
        console.log("Location", location);
        const segments = await getSegments();
        console.log(segments.length, "segments");
        segments.filter((segment) => distanceBetweenPointAndSegment([x,y], segment) < RADIUS_INMETERS);
        for (const segment of segments) {
            // const parkedCarsAtSegment = await getParkedCars(segment);
            // const freeSpaces = segment.maxParkingCapacity - parkedCarsAtSegment.length;
            segment.freeParkingCapacity = Math.round(segment.maxParkingCapacity * Math.random());
            // console.log(segment, "segment");
        }
        console.log(segments, "segments");
        res.json(segments);
    } catch (error) {
        console.error("Error in /segments route:", error);
        res.status(500).json({
            message: "Internal server error. Please try again later.",
        });
    }
} );

export default router;