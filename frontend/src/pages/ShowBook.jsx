import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineHeart } from 'react-icons/ai';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';
import { useAuth } from '../context/AuthContext';

const ShowBook = () => {
  const { id } = useParams();
  const { user, token, loading: authLoading } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);

  const fetchBook = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5555/books/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5555/reviews/book/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchBook();
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!rating || !comment.trim()) {
      setReviewError('Please add a rating and a comment.');
      return;
    }

    setReviewLoading(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      await axios.post(`http://localhost:5555/reviews/book/${id}`, {
        rating,
        comment: comment.trim(),
      });
      setReviewSuccess('Review submitted successfully.');
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      setReviewError(error.response?.data?.message || 'Unable to submit review.');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      if (token && authLoading) return;
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
      if (token && authLoading) return;
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

  if (loading) {
    return (
      <div className='p-4'>
        <BackButton />
        <div className='my-10 flex justify-center'>
          <Spinner />
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className='p-4'>
        <BackButton />
        <div className='rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm'>Book not found.</div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className='space-y-6 p-4'>
      <BackButton />
      <div className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg'>
        <div className='grid gap-6 lg:grid-cols-[320px_minmax(0,_1fr)]'>
          <div className='overflow-hidden rounded-[28px] bg-slate-100'>
            <img src={book.coverImage} alt={book.title} className='h-full w-full object-cover' />
          </div>

          <div>
            <p className='text-sm uppercase tracking-[0.3em] text-sky-500'>{book.genre || 'General'}</p>
            <h1 className='mt-3 text-4xl font-semibold text-slate-900'>{book.title}</h1>
            <p className='mt-3 text-sm text-slate-600'>{book.description}</p>

            <div className='mt-6 grid gap-4 sm:grid-cols-2'>
              <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4'>
                <p className='text-sm text-slate-500'>Author</p>
                <p className='mt-2 font-semibold text-slate-900'>{book.author}</p>
              </div>
              <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4'>
                <p className='text-sm text-slate-500'>Publisher</p>
                <p className='mt-2 font-semibold text-slate-900'>{book.publisher}</p>
              </div>
              <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4'>
                <p className='text-sm text-slate-500'>Price</p>
                <p className='mt-2 font-semibold text-slate-900'>${book.price?.toFixed(2) ?? '12.99'}</p>
              </div>
              <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4'>
                <p className='text-sm text-slate-500'>Rating</p>
                <p className='mt-2 font-semibold text-slate-900'>{book.rating?.toFixed(1) ?? '4.4'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-8 grid gap-4 sm:grid-cols-2'>
          <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4'>
            <p className='text-sm text-slate-500'>Published</p>
            <p className='mt-2 font-semibold text-slate-900'>{book.publishYear || 'N/A'}</p>
          </div>
          <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4'>
            <p className='text-sm text-slate-500'>Inventory</p>
            <p className='mt-2 font-semibold text-slate-900'>{book.inStock ? 'In stock' : 'Out of stock'}</p>
          </div>
          <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4'>
            <p className='text-sm text-slate-500'>Created</p>
            <p className='mt-2 font-semibold text-slate-900'>{new Date(book.createdAt).toLocaleString()}</p>
          </div>
          <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4'>
            <p className='text-sm text-slate-500'>Updated</p>
            <p className='mt-2 font-semibold text-slate-900'>{new Date(book.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        <div className='mt-8 flex flex-wrap gap-3'>
          <button
            onClick={handleAddToCart}
            disabled={adding || (token && authLoading)}
            className='rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300'
          >
            {added ? 'Added to cart' : adding ? 'Adding...' : 'Add to cart'}
          </button>
          <button
            onClick={handleAddToWishlist}
            disabled={wishlistLoading || (token && authLoading)}
            className='flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400'
          >
            <AiOutlineHeart className='text-base' />
            {wishlistAdded ? 'Saved' : wishlistLoading ? 'Saving...' : 'Add to wishlist'}
          </button>
        </div>
      </div>

      <div className='space-y-6'>
        <div className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg'>
          <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h2 className='text-2xl font-semibold text-slate-900'>Customer reviews</h2>
              <p className='mt-1 text-sm text-slate-500'>{reviews.length} review{reviews.length === 1 ? '' : 's'}</p>
            </div>
            <span className='rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600'>Average {book.rating?.toFixed(1) ?? '4.4'}</span>
          </div>

          <div className='mt-6 space-y-4'>
            {reviews.length === 0 ? (
              <div className='rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-600'>
                No reviews yet. Be the first to review this book.
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className='rounded-3xl border border-slate-200 bg-slate-50 p-5'>
                  <div className='flex items-center justify-between gap-4'>
                    <p className='font-semibold text-slate-900'>{review.user?.name ?? 'Anonymous'}</p>
                    <span className='rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700'>{review.rating} / 5</span>
                  </div>
                  <p className='mt-3 text-sm leading-6 text-slate-600'>{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg'>
          <h2 className='text-2xl font-semibold text-slate-900'>Leave your review</h2>
          <p className='mt-2 text-sm text-slate-600'>Share your experience to help other readers choose their next favorite book.</p>

          {reviewError && <div className='mt-4 rounded-3xl bg-rose-50 p-4 text-sm text-rose-700'>{reviewError}</div>}
          {reviewSuccess && <div className='mt-4 rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-700'>{reviewSuccess}</div>}

          {user ? (
            <form onSubmit={handleReviewSubmit} className='mt-6 space-y-4'>
              <div className='grid gap-4 sm:grid-cols-[1fr_120px]'>
                <label className='block'>
                  <span className='text-sm font-medium text-slate-700'>Rating</span>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className='mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100'
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>{value} stars</option>
                    ))}
                  </select>
                </label>

                <label className='block'>
                  <span className='text-sm font-medium text-slate-700'>Comment</span>
                  <input
                    type='text'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder='Share a quick note'
                    className='mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100'
                  />
                </label>
              </div>

              <button
                type='submit'
                disabled={reviewLoading}
                className='rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300'
              >
                {reviewLoading ? 'Submitting...' : 'Submit review'}
              </button>
            </form>
          ) : (
            <p className='mt-4 text-sm text-slate-600'>Login to leave a review for this book.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ShowBook;