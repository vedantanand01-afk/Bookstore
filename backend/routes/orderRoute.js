import express from 'express';
import { Order } from '../models/orderModel.js';
import { Cart } from '../models/cartModel.js';
import { Book } from '../models/bookModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'none' } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.book');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const items = cart.items.map((item) => ({
      book: item.book._id,
      quantity: item.quantity,
      price: item.book.price || 0,
    }));

    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const order = await Order.create({
      user: req.user._id,
      items,
      totalPrice,
      status: 'pending',
      shippingAddress: shippingAddress || '',
      paymentMethod,
      paymentStatus: paymentMethod === 'none' ? 'pending' : 'paid',
    });

    await Cart.findOneAndDelete({ user: req.user._id });
    return res.status(201).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to place order', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.book');
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to fetch orders', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate('items.book');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to fetch order', error: error.message });
  }
});

export default router;
