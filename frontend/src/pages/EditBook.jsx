import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

const EditBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [genre, setGenre] = useState('General');
  const [publisher, setPublisher] = useState('Independent Press');
  const [rating, setRating] = useState(4.5);
  const [price, setPrice] = useState(12.99);
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [inStock, setInStock] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadBook = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/books/${id}`);
        const book = response.data;
        setTitle(book.title || '');
        setAuthor(book.author || '');
        setPublishYear(book.publishYear || '');
        setGenre(book.genre || 'General');
        setPublisher(book.publisher || 'Independent Press');
        setRating(book.rating ?? 4.5);
        setPrice(book.price ?? 12.99);
        setDescription(book.description || '');
        setCoverImage(book.coverImage || '');
        setInStock(book.inStock ?? true);
      } catch (error) {
        console.error('Error fetching book:', error);
        alert('Unable to load the book.');
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  const handleEditBook = async () => {
    if (!title.trim() || !author.trim() || !publishYear) {
      alert('Title, author, and publish year are required.');
      return;
    }

    const data = {
      title: title.trim(),
      author: author.trim(),
      publishYear: Number(publishYear),
      genre: genre.trim(),
      publisher: publisher.trim(),
      rating: Number(rating),
      price: Number(price),
      description: description.trim(),
      coverImage: coverImage.trim(),
      inStock,
    };

    setLoading(true);
    try {
      await axios.put(`/books/${id}`, data);
      navigate('/');
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Unable to update the book.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6 p-4'>
      <BackButton />
      <div className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg'>
        <h1 className='text-3xl font-semibold text-slate-900'>Edit Book</h1>
        <p className='mt-2 text-slate-600'>Update inventory details with a polished, resume-friendly form.</p>

        {loading && (
          <div className='my-6 flex justify-center'>
            <Spinner />
          </div>
        )}

        <div className='mt-8 grid gap-6 lg:grid-cols-2'>
          <label className='block'>
            <span className='text-sm font-medium text-slate-700'>Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
            />
          </label>

          <label className='block'>
            <span className='text-sm font-medium text-slate-700'>Author</span>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className='mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
            />
          </label>

          <label className='block'>
            <span className='text-sm font-medium text-slate-700'>Publish Year</span>
            <input
              type='number'
              value={publishYear}
              onChange={(e) => setPublishYear(e.target.value)}
              className='mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
            />
          </label>

          <label className='block'>
            <span className='text-sm font-medium text-slate-700'>Genre</span>
            <input
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className='mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
            />
          </label>

          <label className='block'>
            <span className='text-sm font-medium text-slate-700'>Publisher</span>
            <input
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              className='mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
            />
          </label>

          <label className='block'>
            <span className='text-sm font-medium text-slate-700'>Price</span>
            <input
              type='number'
              step='0.01'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className='mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
            />
          </label>

          <label className='block lg:col-span-2'>
            <span className='text-sm font-medium text-slate-700'>Cover Image URL</span>
            <input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className='mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
            />
          </label>

          <label className='block lg:col-span-2'>
            <span className='text-sm font-medium text-slate-700'>Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className='mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
            />
          </label>

          <label className='flex items-center gap-3'>
            <input
              type='checkbox'
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className='h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500'
            />
            <span className='text-sm text-slate-700'>Available in inventory</span>
          </label>

          <label className='block'>
            <span className='text-sm font-medium text-slate-700'>Rating</span>
            <input
              type='number'
              step='0.1'
              min='0'
              max='5'
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className='mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
            />
          </label>
        </div>

        <div className='mt-8 flex justify-end'>
          <button
            onClick={handleEditBook}
            disabled={loading}
            className='rounded-full bg-sky-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300'
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBook;