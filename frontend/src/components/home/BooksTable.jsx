import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';

const BooksTable = ({ books }) => {
  return (
    <div className='overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm'>
      <table className='min-w-full divide-y divide-slate-200'>
        <thead className='bg-slate-50'>
          <tr>
            <th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500'>No</th>
            <th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500'>Title</th>
            <th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hidden sm:table-cell'>Author</th>
            <th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hidden md:table-cell'>Genre</th>
            <th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hidden lg:table-cell'>Published</th>
            <th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hidden lg:table-cell'>Rating</th>
            <th className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500'>Actions</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-slate-100'>
          {books.map((book, index) => (
            <tr key={book._id} className='hover:bg-slate-50'>
              <td className='whitespace-nowrap px-4 py-3 text-sm text-slate-700'>{index + 1}</td>
              <td className='whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900'>{book.title}</td>
              <td className='whitespace-nowrap px-4 py-3 text-sm text-slate-600 hidden sm:table-cell'>{book.author}</td>
              <td className='whitespace-nowrap px-4 py-3 text-sm text-slate-600 hidden md:table-cell'>{book.genre || 'General'}</td>
              <td className='whitespace-nowrap px-4 py-3 text-sm text-slate-600 hidden lg:table-cell'>{book.publishYear}</td>
              <td className='whitespace-nowrap px-4 py-3 text-sm text-slate-600 hidden lg:table-cell'>{book.rating?.toFixed(1) ?? '4.4'}</td>
              <td className='whitespace-nowrap px-4 py-3'>
                <div className='flex flex-wrap items-center justify-center gap-3'>
                  <Link to={`/books/details/${book._id}`} className='text-slate-700 transition hover:text-slate-900'>
                    <BsInfoCircle className='text-xl' />
                  </Link>
                  <Link to={`/books/edit/${book._id}`} className='text-slate-700 transition hover:text-slate-900'>
                    <AiOutlineEdit className='text-xl' />
                  </Link>
                  <Link to={`/books/delete/${book._id}`} className='text-red-600 transition hover:text-red-700'>
                    <MdOutlineDelete className='text-xl' />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BooksTable;