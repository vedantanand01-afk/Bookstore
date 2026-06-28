import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/orders');
        setOrders(response.data);
      } catch (err) {
        setError('Unable to load order history. Please sign in first.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className='rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700'>{error}</p>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className='space-y-6'>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }} className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg'>
        <h1 className='text-3xl font-semibold text-slate-900'>Order history</h1>
        <p className='mt-2 text-slate-600'>Track the progress of your recent purchases.</p>
      </motion.div>

      {orders.length === 0 ? (
        <div className='rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-center text-slate-700'>You have not placed any orders yet.</div>
      ) : (
        <div className='space-y-4'>
          {orders.map((order) => (
            <motion.div key={order._id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm'>
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <p className='text-sm text-slate-500'>Order ID</p>
                  <p className='text-sm font-semibold text-slate-900'>{order._id}</p>
                </div>
                <div>
                  <p className='text-sm text-slate-500'>Status</p>
                  <p className='text-sm font-semibold text-slate-900'>{order.status}</p>
                </div>
                <div>
                  <p className='text-sm text-slate-500'>Total</p>
                  <p className='text-sm font-semibold text-slate-900'>${order.totalPrice.toFixed(2)}</p>
                </div>
              </div>
              <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                {order.items.map((item) => (
                  <div key={item.book._id} className='rounded-3xl border border-slate-200 bg-slate-50 p-4'>
                    <p className='font-semibold text-slate-900'>{item.book.title}</p>
                    <p className='text-sm text-slate-600'>{item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Orders;
