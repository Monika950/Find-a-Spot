import express, { Request, Response, NextFunction } from "express";
import { useAuthenticate } from "./auth";
import { getSegments, getParkedCars } from "../database/parkingSegments";
import { distanceBetweenPointAndSegment } from "../utils/segments";

const router = express.Router();

const RADIUS_INMETERS = 0.1;

router.get("/", useAuthenticate, async (req: Request, res: Response) => {
    try {
        const position =  req.query.position as string;
        if (!position) {
            res.status(400).json({ message: "Position is required." });
            return;
        }
        const [x, y] = position.split(",").map((coord) => parseFloat(coord));
        if (isNaN(x) || isNaN(y)) {
            res.status(400).json({ message: "Invalid position." });
            return;
        }
        const segments = await getSegments();
        segments.filter((segment) => distanceBetweenPointAndSegment([x,y], segment) < RADIUS_INMETERS);
        for (const segment of segments) {
            const parkedCarsAtSegment = await getParkedCars(segment);
            const freeSpaces = segment.maxParkingCapacity - parkedCarsAtSegment.length;
            segment.freeParkingCapacity = freeSpaces;
        }

        res.json(segments);
    } catch (error) {
        console.error("Error in /segments route:", error);
        res.status(500).json({
            message: "Internal server error. Please try again later.",
        });
    }
} );

export default router;