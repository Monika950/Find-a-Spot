import express, { Request, Response } from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import carRuter from './routes/cars';

const app = express();
const port = process.env.PORT || 3001;


// Middleware to parse JSON
app.use(express.json());
app.use(cors());
app.use('/auth', authRouter);
app.use('/cars', carRuter);

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
