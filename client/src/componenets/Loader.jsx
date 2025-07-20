import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-white">
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 border-4 border-dashed border-primary rounded-full animate-spin"></div>
        <p className="text-sm text-gray-600 mt-4">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
