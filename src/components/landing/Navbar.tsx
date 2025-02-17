import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-white hover:text-gray-200">
            <Logo />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-gray-200">Features</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-gray-200">Pricing</a>
            <a href="#about" className="text-sm text-gray-400 hover:text-gray-200">About</a>
            <Link to="/" className="text-sm text-gray-400 hover:text-gray-200">Sign in</Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}