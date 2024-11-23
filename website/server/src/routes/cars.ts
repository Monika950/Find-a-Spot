import express, { Request, Response, NextFunction } from "express";
import { useAuthenticate } from "./auth";

const router = express.Router();

// GET /cars
router.get("/", useAuthenticate, async (req: Request, res: Response) => {
  try {
    // Replace this logic with database integration
    const cars = [
      { id: 1, make: "Toyota", model: "Corolla", year: 2018 },
      { id: 2, make: "Honda", model: "Civic", year: 2019 },
    ];
    res.json(cars);
  } catch (error) {
    console.error("Error in /cars route:", error);
    res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
});