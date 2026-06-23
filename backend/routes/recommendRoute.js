import express from 'express';
import { Book } from '../models/bookModel.js';
import { createEmbedding, cosineSimilarity } from '../utils/embeddings.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Optionally protect recommendation endpoints if you want personalized recommendations
router.use(authMiddleware);

// Generate or update embedding for a single book
router.post('/book/:id/embedding', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const text = `${book.title} -- ${book.author} -- ${book.genre} -- ${book.description}`;
    const { embedding, model } = await createEmbedding(text);
    book.embedding = embedding;
    book.embeddingModel = model;
    await book.save();
    return res.status(200).json({ message: 'Embedding saved', embeddingModel: model });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Embedding generation failed', error: error.message });
  }
});

// Recommend books similar to a given book id using Atlas Vector Search if available
router.get('/book/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Prefer Atlas Vector Search knn aggregation if the book already has an embedding
    if (book.embedding && book.embedding.length > 0) {
      try {
        // Use aggregation with $search (Atlas Search with vector index required)
        const agg = [
          {
            $search: {
              knnBeta: {
                vector: book.embedding,
                path: 'embedding',
                k: 10,
              },
            },
          },
          { $limit: 10 },
          { $project: { title: 1, author: 1, genre: 1, coverImage: 1, score: { $meta: 'searchScore' } } },
        ];

        const results = await Book.aggregate(agg);
        // Filter out the query book if present
        const filtered = results.filter((b) => b._id.toString() !== book._id.toString());
        if (filtered.length > 0) return res.status(200).json({ source: 'vector', items: filtered });
      } catch (err) {
        // fall through to hybrid fallback
        console.warn('Atlas vector search failed or not available:', err.message || err);
      }
    }

    // Hybrid fallback: combine cosine similarity (if other embeddings exist) and metadata (genre/author)
    const candidates = await Book.find({ _id: { $ne: book._id } }).lean().limit(500);
    const scored = candidates.map((c) => {
      let score = 0;
      // vector similarity when available
      if (book.embedding && book.embedding.length > 0 && c.embedding && c.embedding.length > 0) {
        score += 0.7 * cosineSimilarity(book.embedding, c.embedding);
      }
      // same genre boost
      if (c.genre && book.genre && c.genre === book.genre) score += 0.15;
      // same author boost
      if (c.author && book.author && c.author === book.author) score += 0.1;
      // popularity by rating
      score += (c.rating || 0) * 0.01;
      return { ...c, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, 10).map(({ score, ...rest }) => rest);
    return res.status(200).json({ source: 'hybrid', items: top });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Recommendation failed', error: error.message });
  }
});

// Simple user-level recommendations: use wishlist + recently viewed to recommend similar books
router.get('/user', async (req, res) => {
  try {
    const user = req.user;
    // collect seed books from wishlist and recently viewed (if you track them)
    const seedIds = (user.wishlist || []).map((id) => id.toString()).slice(-5);
    if (seedIds.length === 0) {
      // cold-start: return top-rated books
      const popular = await Book.find({}).sort({ rating: -1 }).limit(10).lean();
      return res.status(200).json({ source: 'popular', items: popular });
    }

    // fetch seed embeddings
    const seeds = await Book.find({ _id: { $in: seedIds } }).lean();
    const seedEmbedding = seeds.reduce((acc, s) => {
      if (s.embedding && s.embedding.length) {
        if (!acc) return s.embedding.slice();
        for (let i = 0; i < s.embedding.length; i++) acc[i] = (acc[i] || 0) + s.embedding[i];
      }
      return acc;
    }, null);

    if (seedEmbedding) {
      // normalize by count
      for (let i = 0; i < seedEmbedding.length; i++) seedEmbedding[i] /= seeds.length;
      // attempt Atlas knn search
      try {
        const agg = [
          { $search: { knnBeta: { vector: seedEmbedding, path: 'embedding', k: 12 } } },
          { $limit: 12 },
          { $project: { title: 1, author: 1, genre: 1, coverImage: 1, score: { $meta: 'searchScore' } } },
        ];
        const results = await Book.aggregate(agg);
        const filtered = results.filter((b) => !(seedIds.includes(b._id.toString())));
        if (filtered.length > 0) return res.status(200).json({ source: 'vector-user', items: filtered });
      } catch (err) {
        console.warn('Atlas vector user search failed:', err.message || err);
      }

      // hybrid fallback
      const candidates = await Book.find({ _id: { $nin: seedIds } }).lean().limit(500);
      const scored = candidates.map((c) => {
        let score = 0;
        if (c.embedding && c.embedding.length) score += 0.8 * cosineSimilarity(seedEmbedding, c.embedding);
        if (seeds.some(s => s.genre && s.genre === c.genre)) score += 0.1;
        score += (c.rating || 0) * 0.01;
        return { ...c, score };
      });
      scored.sort((a, b) => b.score - a.score);
      return res.status(200).json({ source: 'hybrid-user', items: scored.slice(0, 10).map(({ score, ...rest }) => rest) });
    }

    // fallback: popular
    const popular = await Book.find({}).sort({ rating: -1 }).limit(10).lean();
    return res.status(200).json({ source: 'popular', items: popular });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'User recommendation failed', error: error.message });
  }
});

export default router;
