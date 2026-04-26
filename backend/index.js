import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import mongoose from 'mongoose';
import { PORT, mongoDBURL, CLIENT_URL } from './config.js';
import booksRoute from './routes/booksRoute.js';
import authRoute from './routes/authRoute.js';
import cartRoute from './routes/cartRoute.js';
import orderRoute from './routes/orderRoute.js';
import wishlistRoute from './routes/wishlistRoute.js';
import adminRoute from './routes/adminRoute.js';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: [CLIENT_URL],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
// Option 2: Allow specific origins
// app.use(
//   cors({
//     origin: ['http://localhost:3000'], // Replace with your frontend URL
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type'],
//   })
// );

app.get('/', (req, res) => {
  res.json({ message: 'BookNest API is running' });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use('/auth', authRoute);
app.use('/books', booksRoute);
app.use('/cart', cartRoute);
app.use('/orders', orderRoute);
app.use('/wishlist', wishlistRoute);
app.use('/admin', adminRoute);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Connect to MongoDB and start the server

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
