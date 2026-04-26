import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';

const Cart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5555/cart');
        setCart(response.data);
      } catch (err) {
        setError('Unable to load cart. Sign in and try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user]);

  const handleRemove = async (bookId) => {
    try {
      const response = await axios.delete(`http://localhost:5555/cart/item/${bookId}`);
      setCart(response.data);
    } catch (err) {
      setError('Unable to remove item.');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className='rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-lg'>
        <p className='text-lg text-slate-700'>Your cart is empty.</p>
        <Link to='/' className='mt-4 inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-500'>Browse books</Link>
      </div>
    );
  }

  const total = cart.items.reduce((sum, item) => sum + (item.book.price || 0) * item.quantity, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className='space-y-6'>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }} className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg'>
        <h1 className='text-3xl font-semibold text-slate-900'>Your Cart</h1>
        <p className='mt-2 text-slate-600'>Review your items before checkout.</p>
      </motion.div>

      <div className='grid gap-6 lg:grid-cols-[1.3fr_0.7fr]'>
        <div className='space-y-4'>
          {cart.items.map((item) => (
            <motion.div key={item.book._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.33 }} className='rounded-3xl border border-slate-200 bg-slate-50 p-5'>
              <div className='flex gap-4'>
                <img src={item.book.coverImage} alt={item.book.title} className='h-24 w-20 rounded-3xl object-cover' />
                <div className='flex-1'>
                  <h2 className='text-xl font-semibold text-slate-900'>{item.book.title}</h2>
                  <p className='mt-1 text-sm text-slate-600'>{item.book.author}</p>
                  <p className='mt-2 text-sm text-slate-700'>Quantity: {item.quantity}</p>
                  <p className='mt-2 font-semibold text-slate-900'>${(item.book.price || 0).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleRemove(item.book._id)}
                  className='self-start rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400'
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.33, delay: 0.05 }} className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg'>
          <p className='text-sm uppercase tracking-[0.3em] text-slate-500'>Order summary</p>
          <div className='mt-6 space-y-4'>
            <div className='flex items-center justify-between text-sm text-slate-600'>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4'>
              <p className='text-sm text-slate-500'>Estimated shipping and taxes will be calculated at checkout.</p>
            </div>
            <Link
              to='/checkout'
              className='mt-4 inline-flex w-full justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-500'
            >
              Proceed to checkout
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cart;
