import { ObjectId } from "mongodb";

interface User {
    _id?: ObjectId;
    passwordHash: string;
    email: string;
    phoneNumber: string;
}
