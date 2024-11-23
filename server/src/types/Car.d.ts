import { ObjectId } from 'mongodb';

interface Car {
    _id?: ObjectId;
    numberPlate: string;
    description: string;
    owner: ObjectId;
    parkedAt: number | null;
}