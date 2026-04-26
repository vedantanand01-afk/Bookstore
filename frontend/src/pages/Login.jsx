import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className='mx-auto max-w-lg rounded-[28px] border border-slate-200 bg-white p-8 shadow-lg'>
      <h1 className='text-3xl font-semibold text-slate-900'>Sign in to BookNest</h1>
      <p className='mt-2 text-slate-600'>Access your cart, wishlist, and order history.</p>

      {error && <div className='mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700'>{error}</div>}

      <form onSubmit={handleSubmit} className='mt-8 space-y-5'>
        <label className='block'>
          <span className='text-sm font-medium text-slate-700'>Email</span>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
            required
          />
        </label>
        <label className='block'>
          <span className='text-sm font-medium text-slate-700'>Password</span>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
            required
          />
        </label>
        <button
          type='submit'
          disabled={loading}
          className='w-full rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300'
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className='mt-6 text-center text-sm text-slate-600'>
        New to BookNest? <Link to='/register' className='font-semibold text-sky-600 hover:text-sky-500'>Create an account</Link>
      </p>
    </motion.div>
  );
};

export default Login;
