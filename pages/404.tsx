import React from 'react';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500">
      <div className="text-center text-white p-8 rounded-lg">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-8">Page Not Found</h2>
        <Link 
          href="/"
          className="px-6 py-3 bg-white text-pink-500 rounded-full font-semibold hover:bg-opacity-90 transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
