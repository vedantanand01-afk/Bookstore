import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import RequireAdmin from './components/RequireAdmin';
import ShowBook from './pages/ShowBook';
import CreateBooks from './pages/CreateBooks';
import EditBook from './pages/EditBook';
import DeleteBook from './pages/DeleteBook';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  return (
    <AuthProvider>
      <div className='min-h-screen bg-slate-50 text-slate-900'>
        <Navbar />
        <main className='max-w-7xl mx-auto px-4 py-6'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/cart' element={<RequireAuth><Cart /></RequireAuth>} />
            <Route path='/checkout' element={<RequireAuth><Checkout /></RequireAuth>} />
            <Route path='/wishlist' element={<RequireAuth><Wishlist /></RequireAuth>} />
            <Route path='/orders' element={<RequireAuth><Orders /></RequireAuth>} />
            <Route path='/admin' element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path='/books/create' element={<CreateBooks />} />
            <Route path='/books/details/:id' element={<ShowBook />} />
            <Route path='/books/edit/:id' element={<EditBook />} />
            <Route path='/books/delete/:id' element={<DeleteBook />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
};

export default App;