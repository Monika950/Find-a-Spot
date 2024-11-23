import express, { Request, Response, NextFunction } from "express";
import { useAuthenticate } from "./auth";
import { getUsersCars, addCar } from "../database/cars";

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
            owner: req.user._id,
            description,
            numberPlate,
            parkedAt: null,
        };
        await addCar(car);
        res.status(201).json({ message: "Car added successfully." });
    } catch (error) {
        console.error("Error in /cars route:", error);
        res.status(500).json({
        message: "Internal server error. Please try again later.",
        });
    }
    }
);

export default router;