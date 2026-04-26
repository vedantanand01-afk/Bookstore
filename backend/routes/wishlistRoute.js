import express from 'express';
import { User } from '../models/userModel.js';
import { Book } from '../models/bookModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    return res.status(200).json(user.wishlist || []);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to fetch wishlist', error: error.message });
  }
});

router.post('/:bookId', async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user.wishlist) {
      user.wishlist = [];
    }
    
    if (!user.wishlist.includes(book._id)) {
      user.wishlist.push(book._id);
      await user.save();
    }

    await user.populate('wishlist');
    return res.status(200).json(user.wishlist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to add wishlist item', error: error.message });
  }
});

router.delete('/:bookId', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.wishlist) {
      user.wishlist = [];
    }
    
    user.wishlist = user.wishlist.filter((bookId) => bookId.toString() !== req.params.bookId);
    await user.save();
    await user.populate('wishlist');
    return res.status(200).json(user.wishlist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to remove wishlist item', error: error.message });
  }
});

export default router;
