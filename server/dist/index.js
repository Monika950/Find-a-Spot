"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware to parse JSON
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Routes
app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});
// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
