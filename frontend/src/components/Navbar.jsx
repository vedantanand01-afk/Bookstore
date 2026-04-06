import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className='bg-gradient-to-r from-slate-900 via-slate-800 to-sky-700 text-white shadow-xl'>
      <div className='max-w-7xl mx-auto flex flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:justify-between'>
        <div>
          <Link to='/' className='text-2xl font-semibold tracking-tight'>BookNest</Link>
          <p className='text-sm text-slate-200/80 mt-1'>A modern bookstore management dashboard for inventory, analytics, search, and CRUD workflows.</p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <Link to='/' className='rounded-full bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20'>Browse Books</Link>
          <Link to='/books/create' className='rounded-full bg-sky-500 px-4 py-2 text-sm text-slate-900 font-semibold transition hover:bg-sky-400'>Add Book</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
