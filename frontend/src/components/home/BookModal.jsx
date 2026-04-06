import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const BookModal = ({ book, onClose }) => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4' onClick={onClose}>
      <div
        onClick={(event) => event.stopPropagation()}
        className='w-full max-w-4xl rounded-[28px] bg-white p-6 shadow-2xl'
      >
        <AiOutlineClose onClick={onClose} className='absolute right-6 top-6 cursor-pointer text-3xl text-slate-500 transition hover:text-slate-900' />

        <div className='grid gap-6 lg:grid-cols-[320px_minmax(0,_1fr)]'>
          <div className='overflow-hidden rounded-[28px] bg-slate-100'>
            <img src={book.coverImage} alt={book.title} className='h-full w-full object-cover' />
          </div>

          <div>
            <p className='text-sm uppercase tracking-[0.3em] text-sky-500'>{book.genre || 'General'}</p>
            <h2 className='mt-3 text-3xl font-semibold text-slate-900'>{book.title}</h2>
            <p className='mt-3 text-sm text-slate-600'>{book.description}</p>

            <div className='mt-6 grid gap-4 sm:grid-cols-2'>
              <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4'>
                <p className='text-sm text-slate-500'>Author</p>
                <p className='mt-2 font-semibold text-slate-900'>{book.author}</p>
              </div>
              <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4'>
                <p className='text-sm text-slate-500'>Publisher</p>
                <p className='mt-2 font-semibold text-slate-900'>{book.publisher || 'Independent Press'}</p>
              </div>
              <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4'>
                <p className='text-sm text-slate-500'>Rating</p>
                <p className='mt-2 font-semibold text-slate-900'>{book.rating?.toFixed(1) ?? '4.4'}</p>
              </div>
              <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4'>
                <p className='text-sm text-slate-500'>Price</p>
                <p className='mt-2 font-semibold text-slate-900'>${book.price?.toFixed(2) ?? '12.99'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-6 grid gap-4 sm:grid-cols-2'>
          <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4'>
            <p className='text-sm text-slate-500'>Published</p>
            <p className='mt-2 font-semibold text-slate-900'>{book.publishYear}</p>
          </div>
          <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4'>
            <p className='text-sm text-slate-500'>Availability</p>
            <p className='mt-2 font-semibold text-slate-900'>{book.inStock ? 'In stock' : 'Out of stock'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;