import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ShowBook from './pages/ShowBook';
import CreateBooks from './pages/CreateBooks';
import EditBook from './pages/EditBook';
import DeleteBook from './pages/DeleteBook';
import Home from './pages/Home';

const App = () => {
  return (
    <div className='min-h-screen bg-slate-50 text-slate-900'>
      <Navbar />
      <main className='max-w-7xl mx-auto px-4 py-6'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/books/create' element={<CreateBooks />} />
          <Route path='/books/details/:id' element={<ShowBook />} />
          <Route path='/books/edit/:id' element={<EditBook />} />
          <Route path='/books/delete/:id' element={<DeleteBook />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;