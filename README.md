BookNest

A modern bookstore portfolio project built with a React + Vite frontend and Express + MongoDB backend. It includes inventory management, search/filter controls, responsive card/table views, detailed previews, and full CRUD functionality.

## Run the app

### Backend
cd backend
npm install
npm run dev

### Frontend
cd ../frontend
npm install
npm run dev

## Highlights
- Responsive dashboard with analytics cards
- Search, genre filter, and sorting on inventory
- Create, edit, view, and delete books
- Custom bookstore UI designed for resumes
- Clean, maintainable MERN stack codebase

## Features
- **Browsing & Shortlisting**: Browse books in responsive card or table views, view details, and shortlist (wishlist) books for later (see [frontend/src/pages/Wishlist.jsx](frontend/src/pages/Wishlist.jsx#L1)).
- **Dynamic Search & Filtering**: Client-side dynamic search, genre filtering and sorting in the home inventory (see [frontend/src/pages/Home.jsx](frontend/src/pages/Home.jsx#L1)).
- **Authentication (JWT)**: JWT-based authentication endpoints and middleware in the backend. Login/register endpoints return a token and the frontend stores it and sets `Authorization` headers (see [backend/routes/authRoute.js](backend/routes/authRoute.js#L1) and [backend/middleware/authMiddleware.js](backend/middleware/authMiddleware.js#L1)).
- **RESTful APIs**: Full REST APIs for cart and order management with protected routes using the auth middleware (see [backend/routes/cartRoute.js](backend/routes/cartRoute.js#L1) and [backend/routes/orderRoute.js](backend/routes/orderRoute.js#L1)).

## Deployment
- **Frontend (Vercel)**: The frontend is a Vite app with a `build` script (`npm run build`) ready for Vercel. To deploy: push the repository to GitHub, create a Vercel project from the GitHub repo, set the root to `frontend`, and ensure the `BUILD` command is `npm run build` and the `Output Directory` is `dist`.
- **Backend**: Host the backend (Heroku/Render/Railway/etc.) and set the following environment variables: `MONGODB_URL`, `JWT_SECRET`, and `CLIENT_URL` (set `CLIENT_URL` to your Vercel app URL). The backend's `config.js` defaults can be overridden via env.

### AI recommendations (OpenAI + MongoDB Atlas Vector Search)
To enable semantic recommendations you can use OpenAI embeddings and MongoDB Atlas Vector Search.

1. Set environment variables in your backend host or local `.env`:

	- `OPENAI_API_KEY` — API key for OpenAI embeddings
	- `OPENAI_EMBEDDING_MODEL` — optional, defaults to `text-embedding-3-small`
	- `MONGODB_URL`, `JWT_SECRET`, `CLIENT_URL` (existing vars)

2. Create an Atlas Search vector index on the `books` collection for the `embedding` field. See MongoDB Atlas docs ("Vector Search") for exact index creation steps.

3. Endpoints added:

	- `POST /recommend/book/:id/embedding` — generate and store OpenAI embedding for a book.
	- `GET /recommend/book/:id` — return recommendations for a given book (Atlas vector knn preferred, hybrid fallback available).
	- `GET /recommend/user` — simple user-level hybrid recommendations based on wishlist seeds.

4. Notes:

	- Atlas vector search requires a vector index and Atlas cluster that supports vector search.
	- The implementation falls back to an internal hybrid approach (cosine similarity on stored vectors + metadata boosts) if Atlas search isn't available.

## Run locally
See the existing instructions below — the frontend (`npm run dev`) expects the backend running at `http://localhost:5555` unless you override `CLIENT_URL` and the frontend API base URLs.
