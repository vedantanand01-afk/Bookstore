import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    publishYear: {
      type: Number,
      required: true,
      min: 1500,
      max: new Date().getFullYear(),
    },
    genre: {
      type: String,
      trim: true,
      default: 'General',
    },
    description: {
      type: String,
      trim: true,
      default: 'A beautiful story that belongs on every bookshelf.',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.4,
    },
    price: {
      type: Number,
      min: 0,
      default: 12.99,
    },
    coverImage: {
      type: String,
      trim: true,
      default: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
    },
    publisher: {
      type: String,
      trim: true,
      default: 'Independent Press',
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model('Book', bookSchema);