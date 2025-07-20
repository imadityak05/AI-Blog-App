import React from 'react';

const NewsLetter = () => {
  return (
    <div className="flex flex-col items-center w-full lg:w-full px-4 py-12 md:py-16 mx-2 lg:mx-auto text-gray-800">
      <div className="flex flex-col justify-center items-center text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Stay Inspired</h1>
        <p className="text-base md:text-lg text-gray-600 mt-3 max-w-2xl">
          Join our newsletter and be the first to discover new updates, exclusive offers, and inspiration.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 w-full max-w-md">
        <input
          type="email"
          className="px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-all duration-200"
          placeholder="Enter your email"
          aria-label="Email address"
        />
        <button 
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg w-full sm:w-auto transition-colors duration-200 shadow-md hover:shadow-lg"
          aria-label="Subscribe to newsletter"
        >
          Subscribe
          <svg
            className="w-4 h-4 text-white"
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 12H5m14 0l-4 4m4-4l-4-4"
            />
          </svg>
        </button>
      </div>

      <p className="text-gray-500 text-xs mt-6 text-center max-w-md">
        By subscribing, you agree to our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> and consent to receive updates.
      </p>
    </div>
  );
};

export default NewsLetter;
