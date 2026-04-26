import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AiOutlineEdit, AiOutlineHeart } from 'react-icons/ai';
import { BiShow } from 'react-icons/bi';
import { MdOutlineDelete } from 'react-icons/md';
import { BsInfoCircle } from 'react-icons/bs';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import BookModal from './BookModal';

const BooksSingleCard = ({ book }) => {
  const { user, token, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      if (token && loading) return;
      window.location.href = '/login';
      return;
    }

    setAdding(true);
    try {
      await axios.post('http://localhost:5555/cart/add', { bookId: book._id, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error('Add to cart failed', err);
    } finally {
      setAdding(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      if (token && loading) return;
      window.location.href = '/login';
      return;
    }

    setWishlistLoading(true);
    try {
      await axios.post(`http://localhost:5555/wishlist/${book._id}`);
      setWishlistAdded(true);
      setTimeout(() => setWishlistAdded(false), 1500);
    } catch (err) {
      console.error('Add to wishlist failed', err);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.35 }}
      className='group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'
    >
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0'>
          <p className='text-sm text-slate-500'>{book.genre || 'General'}</p>
          <h3 className='mt-2 text-xl font-semibold text-slate-900'>{book.title}</h3>
          <p className='mt-2 text-sm text-slate-600'>{book.author}</p>
        </div>
        <div className='h-24 w-24 overflow-hidden rounded-3xl bg-slate-100'>
          <img src={book.coverImage} alt={book.title} className='h-full w-full object-cover' />
        </div>
      </div>

      <div className='mt-4 flex flex-wrap gap-2'>
        <span className='rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700'>Rating {book.rating?.toFixed(1) ?? '4.4'}</span>
        <span className='rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'>${book.price?.toFixed(2) ?? '12.99'}</span>
        <span className='rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700'>{book.inStock ? 'In Stock' : 'Out of Stock'}</span>
      </div>

      <p className='mt-4 max-h-16 overflow-hidden text-sm leading-6 text-slate-600'>{book.description}</p>

      <div className='mt-6 flex flex-wrap items-center justify-between gap-3'>
        <div className='flex flex-wrap gap-3'>
          <button
            onClick={() => setShowModal(true)}
            className='flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100'
          >
            <BiShow className='text-base' /> Preview
          </button>
          <button
            onClick={handleAddToCart}
            disabled={adding || (token && loading)}
            className='rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300'
          >
            {added ? 'Added' : adding ? 'Adding...' : 'Add to cart'}
          </button>
          <button
            onClick={handleAddToWishlist}
            disabled={wishlistLoading || (token && loading)}
            className='flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400'
          >
            <AiOutlineHeart className='text-base' />
            {wishlistAdded ? 'Saved' : wishlistLoading ? 'Saving...' : 'Wishlist'}
          </button>
        </div>

        <div className='flex items-center gap-3 text-slate-700'>
          <Link to={`/books/details/${book._id}`}>
            <BsInfoCircle className='text-2xl transition hover:text-slate-900' />
          </Link>
          <Link to={`/books/edit/${book._id}`}>
            <AiOutlineEdit className='text-2xl transition hover:text-slate-900' />
          </Link>
          <Link to={`/books/delete/${book._id}`}>
            <MdOutlineDelete className='text-2xl transition hover:text-red-700' />
          </Link>
        </div>
      </div>

      {showModal && <BookModal book={book} onClose={() => setShowModal(false)} />}
    </motion.div>
  );
};

export default BooksSingleCard;