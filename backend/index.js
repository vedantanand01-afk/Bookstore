import express from "express";
import { PORT, mongoDBURL } from './config.js';
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";
import booksRoute from './routes/booksRoute.js';
import cors from 'cors';
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to handle CORS
// Option 1: Allow all origins (not recommended for production) with Default of cors(*)
app.use(cors());
// Option 2: Allow specific origins
// app.use(
//   cors({
//     origin: ['http://localhost:3000'], // Replace with your frontend URL
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type'],
//   })
// );

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/books', booksRoute);

// Connect to MongoDB and start the server

mongoose
  .connect(mongoDBURL)
  .then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});
