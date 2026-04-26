import express from 'express';
import { Cart } from '../models/cartModel.js';
import { Book } from '../models/bookModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.book');
    return res.status(200).json(cart || { user: req.user._id, items: [] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to fetch cart', error: error.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { bookId, quantity = 1 } = req.body;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ book: bookId, quantity }],
      });
    } else {
      const existingItem = cart.items.find((item) => item.book.toString() === bookId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ book: bookId, quantity });
      }
      await cart.save();
    }

    await cart.populate('items.book');
    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to update cart', error: error.message });
  }
});

router.put('/item', async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find((item) => item.book.toString() === bookId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.book');
    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to update cart item', error: error.message });
  }
});

router.delete('/item/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.book.toString() !== bookId);
    await cart.save();
    await cart.populate('items.book');
    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to remove cart item', error: error.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    return res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to clear cart', error: error.message });
  }
});

export default router;
