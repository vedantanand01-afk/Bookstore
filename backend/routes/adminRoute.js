import express from 'express';
import { User } from '../models/userModel.js';
import { Book } from '../models/bookModel.js';
import { Order } from '../models/orderModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to fetch users', error: error.message });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').populate('items.book');
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to fetch orders', error: error.message });
  }
});

router.get('/sales', async (req, res) => {
  try {
    const sales = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalOrders: { $sum: 1 },
          totalBooksSold: { $sum: '$items.quantity' },
        },
      },
    ]);
    return res.status(200).json(sales[0] || { totalRevenue: 0, totalOrders: 0, totalBooksSold: 0 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to fetch sales metrics', error: error.message });
  }
});

router.delete('/user/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to delete user', error: error.message });
  }
});

router.put('/order/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('items.book');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to update order status', error: error.message });
  }
});

export default router;
