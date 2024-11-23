import { MongoClient } from "mongodb";
import { Car } from "../types/Car";
import dotenv from "dotenv";
dotenv.config();


export async function getSegments() : Promise<parkingSegment[]> {
    
    const client = new MongoClient(process.env.MONGO_URL!);
    await client.connect();
    const db = client.db("FindASpot");
    const collection = db.collection("segments");
    const segments = await collection.find().toArray() as unknown as parkingSegment[];
    await client.close();
    return segments;
}

export async function getParkedCars(segment: parkingSegment) : Promise<Car[]> {
    const client = new MongoClient(process.env.MONGO_URL!);
    await client.connect();
    const db = client.db("FindASpot");
    const collection = db.collection("cars");
    const cars = await collection.find({ parkedAt: segment.segmentId }).toArray() as unknown as Car[];
    await client.close();
    return cars;
}