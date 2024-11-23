import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUser, createUser } from "../database/user";
import { User } from "../types/User";

const router = express.Router();

// Secret for JWT signing
const JWT_SECRET = "your_jwt_secret_key"; // Replace with a secure key

router.post("/signup", async (req: Request, res: Response) => {
    try {
        const { password, phoneNumber, email } = req.body;
        res.set("Content-Type", "application/json");
        // Validate request payload
        if (!email || !password || !phoneNumber) {
            res.status(400).json({
                message: "Email, password, and phone number are required.",
            });
            return;
        }

        // Check if user already exists (Replace this logic with database integration)
        const existingUser = await findUser(email);
        if (existingUser) {
            res.status(409).json({ message: "User already exists." });
            return;
        }
        // Hash the password securely
        const passwordHash = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser: User = {
            email,
            passwordHash,
            phoneNumber,
        };

        createUser(newUser);

        const token = jwt.sign(
            { _id: newUser._id, username: newUser.email },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Return success response
        res.status(201).json({
            message: "User registered successfully.",
            token,
        });
    } catch (error) {
        console.error("Error in /signup route:", error);
        res.status(500).json({
            message: "Internal server error. Please try again later.",
        });
    }
});

// LOGIN Route
router.post("/login", async (req: Request, res: Response) => {
    const { password, email } = req.body;

    if (!email || !password) {
        res.status(400).json({
            message: "Username and password are required.",
        });
        return;
    }

    // Find user in database (replace with DB query)
    const user = await findUser(email);
    if (!user) {
        res.status(404).json({ message: "Email or password is incorrect." });
        return;
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT Token
    const token = jwt.sign({ _id: user._id, username: user.email }, JWT_SECRET, {
        expiresIn: "24h",
    });

    res.status(200).json({ message: "Login successful.", token });
});

// Middleware to protect routes
export const useAuthenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"
    if (!token) {
        res.status(401).json({ message: "Authorization token required." });
        return
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as User;
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};

export default router;
