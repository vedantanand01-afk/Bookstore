import React from 'react';

const Spinner = () => {
  return (
    <div className='flex items-center justify-center'>
      <div className='h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500' />
    </div>
  );
};

export default Spinner