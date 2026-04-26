import express from 'express';
import { Review } from '../models/reviewModel.js';
import { Book } from '../models/bookModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/book/:bookId', async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId }).populate('user', 'name');
    return res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to fetch reviews', error: error.message });
  }
});

router.post('/book/:bookId', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const review = await Review.findOneAndUpdate(
      { book: req.params.bookId, user: req.user._id },
      { rating, comment },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const aggregate = await Review.aggregate([
      { $match: { book: book._id } },
      { $group: { _id: '$book', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (aggregate.length > 0) {
      const { avgRating } = aggregate[0];
      book.rating = Number(avgRating.toFixed(1));
      await book.save();
    }

    return res.status(201).json(review);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to submit review', error: error.message });
  }
});

export default router;
