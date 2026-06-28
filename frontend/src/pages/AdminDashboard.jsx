import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMetrics = async () => {
      setLoading(true);
      try {
        const [salesRes, ordersRes] = await Promise.all([
          axios.get('/admin/sales'),
          axios.get('/admin/orders'),
        ]);
        setStats(salesRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        setError('Unable to load admin metrics.');
      } finally {
        setLoading(false);
      }
    };
    loadMetrics();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className='rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700'>{error}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className='space-y-6'>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg'>
        <h1 className='text-3xl font-semibold text-slate-900'>Admin dashboard</h1>
        <p className='mt-2 text-slate-600'>Sales metrics, orders, and inventory management tools.</p>
      </motion.div>

      <div className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-3xl border border-slate-200 bg-slate-50 p-6'>
          <p className='text-sm text-slate-500'>Total revenue</p>
          <p className='mt-3 text-3xl font-semibold text-slate-900'>${stats.totalRevenue?.toFixed(2) ?? '0.00'}</p>
        </div>
        <div className='rounded-3xl border border-slate-200 bg-slate-50 p-6'>
          <p className='text-sm text-slate-500'>Orders</p>
          <p className='mt-3 text-3xl font-semibold text-slate-900'>{stats.totalOrders ?? 0}</p>
        </div>
        <div className='rounded-3xl border border-slate-200 bg-slate-50 p-6'>
          <p className='text-sm text-slate-500'>Books sold</p>
          <p className='mt-3 text-3xl font-semibold text-slate-900'>{stats.totalBooksSold ?? 0}</p>
        </div>
      </div>

      <div className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg'>
        <h2 className='text-xl font-semibold text-slate-900'>Recent orders</h2>
        <div className='mt-4 space-y-3'>
          {orders.slice(0, 4).map((order) => (
            <motion.div key={order._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} className='rounded-3xl border border-slate-200 bg-slate-50 p-4'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <p className='text-sm text-slate-500'>Order</p>
                  <p className='font-semibold text-slate-900'>{order._id}</p>
                </div>
                <p className='text-sm text-slate-500'>{order.status}</p>
              </div>
              <div className='mt-3 grid gap-2 sm:grid-cols-2'>
                <span className='text-sm text-slate-700'>Total: ${order.totalPrice.toFixed(2)}</span>
                <span className='text-sm text-slate-700'>User: {order.user?.name || order.user?.email}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
