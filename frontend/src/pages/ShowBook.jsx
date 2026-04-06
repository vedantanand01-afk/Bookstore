import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';

const ShowBook = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchBook();
  }, [id]);

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
    <div className='space-y-6 p-4'>
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
            <p className='mt-2 font-semibold text-slate-900'>{book.publishYear}</p>
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
      </div>
    </div>
  );
};

export default ShowBook;