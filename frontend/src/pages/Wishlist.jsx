import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5555/wishlist');
        setWishlist(response.data);
      } catch (err) {
        setError('Unable to load wishlist. Please sign in and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = async (bookId) => {
    try {
      const response = await axios.delete(`http://localhost:5555/wishlist/${bookId}`);
      setWishlist(response.data);
    } catch (err) {
      setError('Unable to remove item from wishlist.');
    }
  };

  if (loading) {
    return (
      <div className='p-4'>
        <Spinner />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className='space-y-6 p-4'>
      <div className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg'>
        <h1 className='text-3xl font-semibold text-slate-900'>Wishlist</h1>
        <p className='mt-2 text-slate-600'>Keep your favorite books saved for later.</p>
      </div>

      {error && (
        <div className='rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700'>{error}</div>
      )}

      {wishlist.length === 0 ? (
        <div className='rounded-[28px] border border-slate-200 bg-slate-50 p-10 text-center shadow-lg'>
          <p className='text-lg text-slate-700'>Your wishlist is empty.</p>
          <Link to='/' className='mt-4 inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-500'>Browse books</Link>
        </div>
      ) : (
        <div className='grid gap-6 lg:grid-cols-2'>
          {wishlist.map((book) => (
            <div key={book._id} className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
              <div className='flex gap-4'>
                <img src={book.coverImage} alt={book.title} className='h-28 w-20 rounded-3xl object-cover' />
                <div className='flex-1'>
                  <Link to={`/books/details/${book._id}`} className='text-xl font-semibold text-slate-900 hover:text-sky-600'>
                    {book.title}
                  </Link>
                  <p className='mt-1 text-sm text-slate-600'>{book.author}</p>
                  <p className='mt-3 text-sm text-slate-500'>{book.genre || 'General'}</p>
                  <p className='mt-2 text-lg font-semibold text-slate-900'>${book.price?.toFixed(2) ?? '0.00'}</p>
                </div>
                <button
                  onClick={() => handleRemove(book._id)}
                  className='rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400'
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Wishlist;
