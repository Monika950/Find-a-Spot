// src/types/express.d.ts or src/express.d.ts

import { JwtPayload } from "jsonwebtoken"; // Import JwtPayload type from jwt library

declare global {
    namespace Express {
        interface Request {
            user?: User; // Add the user property with the JwtPayload type
        }
    }
}
