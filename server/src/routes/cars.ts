import express, { Request, Response, NextFunction } from "express";
import { useAuthenticate } from "./auth";
import { getUsersCars, addCar } from "../database/cars";
import { getSegments } from "../database/parkingSegments";
import { findNerestSegmentToPoint } from "../utils/segments";

const router = express.Router();

// GET /cars
router.get("/", useAuthenticate, async (req: Request, res: Response) => {
  try {
    const cars = await getUsersCars(req.user);
    res.json(cars);
  } catch (error) {
    console.error("Error in /cars route:", error);
    res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
});

router.put("/", useAuthenticate, async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const { description, numberPlate} = req.body;
        const userCars = await getUsersCars(req.user);
        const carExists = userCars.find((car) => car.numberPlate === numberPlate);
        if (carExists) {
            res.status(400).json({ message: "Car already exists." });
            return;
        }

        if (!numberPlate) {
            res.status(400).json({ message: "Number plate are required." });
            return;
        }
        const car = {
            owner: req.user._id!,
            description,
            numberPlate,
            parkedAt: null,
        };
        const carid = await addCar(car);
        res.status(201).json({ message: "Car added successfully.", _id: carid });
    } catch (error) {
        console.error("Error in /cars route:", error);
        res.status(500).json({
        message: "Internal server error. Please try again later.",
        });
    }
    }
);

router.post("/park", useAuthenticate, async (req: Request, res: Response) => {
    try {
        const { numberPlate, location } = req.body;
        if (!numberPlate || !location) {
            res.status(400).json({ message: "Number plate and location are required." });
            return;
        }
        const segments = await getSegments();

        const segment = findNerestSegmentToPoint(segments, location);
        const userCars = await getUsersCars(req.user);
        const car = userCars.find((car) => car.numberPlate === numberPlate);
        if (!car) {
            res.status(400).json({ message: "Car not found." });
            return;
        }
        if (car.parkedAt) {
            res.status(400).json({ message: "Car is already parked." });
            return;
        }
        if (!segment) {
            res.status(500).json({ message: "No parking segments found." });
            return;
        }
        car.parkedAt = segment!.segmentId;
        res.json({ message: "Car parked successfully." });
    } catch (error) {
        console.error("Error in /cars/park route:", error);
        res.status(500).json({
        message: "Internal server error. Please try again later.",
        });
    }
} );

export default router;