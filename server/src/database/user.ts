import { MongoClient } from "mongodb";
import { User } from "../types/User";
import dotenv from "dotenv";
dotenv.config();

export const findUser = async (email: string) : Promise<User> => {
  const client = new MongoClient(process.env.MONGO_URL!);
  await client.connect();
  const db = client.db("FindASpot");
  const collection = db.collection("users");
  const user = await collection.findOne({ email }) as User;
  await client.close();
  return user;
};

export const createUser = async (user: User) => {
  const client = new MongoClient(process.env.MONGO_URL!);
  await client.connect();
  const db = client.db("FindASpot");
  const collection = db.collection("users");
  await collection.insertOne(user);
  await client.close();
};