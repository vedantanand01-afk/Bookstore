import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BiShow } from 'react-icons/bi';
import { MdOutlineDelete } from 'react-icons/md';
import { BsInfoCircle } from 'react-icons/bs';
import { useState } from 'react';
import BookModal from './BookModal';

const BooksSingleCard = ({ book }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className='group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl'>
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
        <button
          onClick={() => setShowModal(true)}
          className='flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100'
        >
          <BiShow className='text-base' /> Preview
        </button>

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
    </div>
  );
};

export default BooksSingleCard;