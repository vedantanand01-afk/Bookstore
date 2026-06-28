import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

const DeleteBook = () => {
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [book, setBook] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleDeleteBook = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/books/${id}`);
      navigate('/');
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Unable to delete the book.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className='space-y-6 p-4'>
      <BackButton />
      <div className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg'>
        <h1 className='text-3xl font-semibold text-slate-900'>Delete Book</h1>
        <p className='mt-2 text-slate-600'>Confirm removal of this item from inventory.</p>

        {loading ? (
          <div className='my-10 flex justify-center'>
            <Spinner />
          </div>
        ) : !book ? (
          <div className='mt-8 rounded-3xl border border-rose-200 bg-rose-50 p-6 text-slate-700'>Book not found.</div>
        ) : (
          <div className='mt-8 space-y-6'>
            <div className='rounded-3xl border border-slate-200 bg-slate-50 p-6'>
              <p className='text-sm uppercase tracking-[0.3em] text-slate-500'>Title</p>
              <p className='mt-2 text-xl font-semibold text-slate-900'>{book.title}</p>
              <p className='mt-1 text-sm text-slate-600'>{book.author}</p>
            </div>
            <button
              onClick={handleDeleteBook}
              disabled={deleting}
              className='w-full rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:bg-rose-300'
            >
              {deleting ? 'Deleting…' : 'Yes, delete this book'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteBook