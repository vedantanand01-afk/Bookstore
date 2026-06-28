import { motion } from 'framer-motion';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

const Checkout = () => {
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    setLoading(true);
    setMessage('');
    try {
      await axios.post('/orders', { shippingAddress: address, paymentMethod });
      setMessage('Order placed successfully. Redirecting to history...');
      setTimeout(() => navigate('/orders'), 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className='mx-auto max-w-2xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-lg'>
      <h1 className='text-3xl font-semibold text-slate-900'>Checkout</h1>
      <p className='mt-2 text-slate-600'>Complete your purchase with a shipping address and payment option.</p>

      <div className='mt-8 space-y-6'>
        <label className='block'>
          <span className='text-sm font-medium text-slate-700'>Shipping address</span>
          <textarea
            rows={4}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className='mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
          />
        </label>

        <label className='block'>
          <span className='text-sm font-medium text-slate-700'>Payment method</span>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className='mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
          >
            <option value='stripe'>Stripe</option>
            <option value='razorpay'>Razorpay</option>
            <option value='cod'>Cash on Delivery</option>
          </select>
        </label>

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className='w-full rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300'
        >
          {loading ? 'Placing order…' : 'Place order'}
        </button>

        {message && <p className='rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-700'>{message}</p>}
      </div>
    </motion.div>
  );
};

export default Checkout;
