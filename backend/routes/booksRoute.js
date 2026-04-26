import express from 'express';
import { Book } from '../models/bookModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

const buildSearchFilter = (query) => {
  const filter = {};

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = [
      { title: searchRegex },
      { author: searchRegex },
      { genre: searchRegex },
      { publisher: searchRegex },
    ];
  }

  if (query.genre && query.genre !== 'All') {
    filter.genre = new RegExp(`^${query.genre}$`, 'i');
  }

  if (query.inStock === 'true') {
    filter.inStock = true;
  } else if (query.inStock === 'false') {
    filter.inStock = false;
  }

  return filter;
};

const getSortOrder = (sort) => {
  switch (sort) {
    case 'newest':
      return { publishYear: -1, title: 1 };
    case 'oldest':
      return { publishYear: 1, title: 1 };
    default:
      return { title: 1 };
  }
};

router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, author, publishYear, genre, description, rating, price, coverImage, publisher, inStock } = req.body;

    if (!title || !author || !publishYear) {
      return res.status(400).send({ message: 'Title, author and publish year are required' });
    }

    const newBook = {
      title,
      author,
      publishYear,
      genre,
      description,
      rating,
      price,
      coverImage,
      publisher,
      inStock,
    };

    const book = await Book.create(newBook);
    return res.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: 'Error saving book', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const filter = buildSearchFilter(req.query);
    const sortOrder = getSortOrder(req.query.sort);
    const books = await Book.find(filter).sort(sortOrder);
    return res.status(200).json({ count: books.length, data: books });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: 'Error fetching books', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: 'Error fetching book', error: error.message });
  }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, author, publishYear } = req.body;

    if (!title || !author || !publishYear) {
      return res.status(400).send({ message: 'Title, author and publish year are required' });
    }

    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).send(book);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: 'Error updating book', error: error.message });
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Book.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).send({ message: 'Book deleted successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

export default router;