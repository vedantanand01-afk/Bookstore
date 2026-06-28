import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BsSearch } from 'react-icons/bs';
import { MdOutlineAddBox } from 'react-icons/md';
import Spinner from '../components/Spinner';
import BooksTable from '../components/home/BooksTable';
import BooksCard from '../components/home/BooksCard';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showType, setShowType] = useState('table');
  const [searchText, setSearchText] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');
  const [sortOption, setSortOption] = useState('newest');

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/books');
        setBooks(response.data.data || []);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const genres = useMemo(() => {
    const unique = new Set(books.map((book) => book.genre || 'General'));
    return ['All', ...Array.from(unique)];
  }, [books]);

  const filteredBooks = useMemo(() => {
    const normalizedSearch = searchText.toLowerCase().trim();
    let result = books.filter((book) => {
      const title = book.title?.toLowerCase() || '';
      const author = book.author?.toLowerCase() || '';
      const genre = book.genre?.toLowerCase() || '';
      return (
        title.includes(normalizedSearch) ||
        author.includes(normalizedSearch) ||
        genre.includes(normalizedSearch)
      );
    });

    if (genreFilter !== 'All') {
      result = result.filter((book) => (book.genre || 'General') === genreFilter);
    }

    return [...result].sort((a, b) => {
      if (sortOption === 'newest') return (b.publishYear || 0) - (a.publishYear || 0);
      if (sortOption === 'oldest') return (a.publishYear || 0) - (b.publishYear || 0);
      return a.title.localeCompare(b.title);
    });
  }, [books, genreFilter, searchText, sortOption]);

  const stats = useMemo(() => {
    const totalBooks = books.length;
    const uniqueAuthors = new Set(books.map((book) => book.author?.trim().toLowerCase())).size;
    const averageRating = books.reduce((sum, book) => sum + (book.rating || 0), 0) / (books.length || 1);
    const averagePrice = books.reduce((sum, book) => sum + (book.price || 0), 0) / (books.length || 1);

    return {
      totalBooks,
      uniqueAuthors,
      averageRating: averageRating.toFixed(1),
      averagePrice: averagePrice.toFixed(2),
    };
  }, [books]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className='space-y-6 pb-16'>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className='rounded-[32px] border border-slate-200 bg-white p-6 shadow-lg'
      >
        <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
          <div className='max-w-2xl'>
            <p className='text-sm uppercase tracking-[0.3em] text-sky-500'>Bookstore Dashboard</p>
            <h1 className='mt-3 text-4xl font-semibold text-slate-900'>Manage your inventory with a modern bookstore UI.</h1>
            <p className='mt-4 max-w-xl text-slate-600'>Search, filter, preview, and update books in a beautiful responsive layout designed for a resume-worthy project.</p>
          </div>
          <Link
            to='/books/create'
            className='inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500'
          >
            <MdOutlineAddBox className='text-lg' />
            Add New Book
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className='mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'
        >
          <div className='rounded-3xl border border-slate-200 bg-slate-50 p-5'>
            <p className='text-sm text-slate-500'>Total books</p>
            <p className='mt-3 text-3xl font-semibold text-slate-900'>{stats.totalBooks}</p>
          </div>
          <div className='rounded-3xl border border-slate-200 bg-slate-50 p-5'>
            <p className='text-sm text-slate-500'>Authors</p>
            <p className='mt-3 text-3xl font-semibold text-slate-900'>{stats.uniqueAuthors}</p>
          </div>
          <div className='rounded-3xl border border-slate-200 bg-slate-50 p-5'>
            <p className='text-sm text-slate-500'>Avg. rating</p>
            <p className='mt-3 text-3xl font-semibold text-slate-900'>{stats.averageRating}</p>
          </div>
          <div className='rounded-3xl border border-slate-200 bg-slate-50 p-5'>
            <p className='text-sm text-slate-500'>Avg. price</p>
            <p className='mt-3 text-3xl font-semibold text-slate-900'>${stats.averagePrice}</p>
          </div>
        </motion.div>

        <div className='mt-8 flex flex-col gap-4 lg:flex-row lg:items-center'>
          <label className='relative flex-1 max-w-xl'>
            <BsSearch className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder='Search by title, author or genre'
              className='w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
            />
          </label>

          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className='rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className='rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
          >
            <option value='newest'>Newest first</option>
            <option value='oldest'>Oldest first</option>
            <option value='title'>Title A–Z</option>
          </select>
        </div>
      </motion.section>

      {loading ? (
        <div className='flex justify-center py-20'>
          <Spinner />
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className='rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600'>No books match your search criteria.</div>
      ) : showType === 'card' ? (
        <BooksCard books={filteredBooks} />
      ) : (
        <BooksTable books={filteredBooks} />
      )}

      <div className='flex items-center justify-center gap-4 pt-4'>
        <button
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${showType === 'table' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          onClick={() => setShowType('table')}
        >
          Table view
        </button>
        <button
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${showType === 'card' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          onClick={() => setShowType('card')}
        >
          Card view
        </button>
      </div>
    </motion.div>
  );
};

export default Home;