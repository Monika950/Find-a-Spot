import { MongoClient } from "mongodb";
import { User } from "../types/User";
import { Car } from "../types/Car";
import dotenv from "dotenv";
dotenv.config();

export const getUsersCars = async (user: User) => {
    const client = new MongoClient(process.env.MONGO_URL!);
    await client.connect();
    const db = client.db("FindASpot");
    const collection = db.collection("cars");
    const cars = await collection.find({ owner: user._id }).toArray();
    await client.close();
    return cars;
};

export const addCar = async (car: Car) => {
    const client = new MongoClient(process.env.MONGO_URL!);
    await client.connect();
    const db = client.db("FindASpot");
    const collection = db.collection("cars");
    const result = await collection.insertOne(car);
    await client.close();
    return result.insertedId.toString();
};
