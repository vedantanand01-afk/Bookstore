import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className='sticky top-0 z-50 bg-slate-950/95 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-700 text-white shadow-xl backdrop-blur-md'
    >
      <div className='max-w-7xl mx-auto flex flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:justify-between'>
        <div>
          <Link to='/' className='text-2xl font-semibold tracking-tight'>BookNest</Link>
          <p className='text-sm text-slate-200/80 mt-1'>A modern bookstore management dashboard for inventory, analytics, search, and CRUD workflows.</p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <Link to='/' className='rounded-full bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20'>Browse Books</Link>
          <Link to='/cart' className='rounded-full bg-sky-500 px-4 py-2 text-sm text-slate-900 font-semibold transition hover:bg-sky-400'>Cart</Link>
          {user ? (
            <>
              <Link to='/wishlist' className='rounded-full bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20'>Wishlist</Link>
              <Link to='/orders' className='rounded-full bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20'>Orders</Link>
              {user.role === 'admin' && (
                <Link to='/admin' className='rounded-full bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20'>Admin</Link>
              )}
              <button onClick={logout} className='rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400'>Logout</button>
            </>
          ) : (
            <>
              <Link to='/login' className='rounded-full bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20'>Login</Link>
              <Link to='/register' className='rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200'>Sign up</Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
