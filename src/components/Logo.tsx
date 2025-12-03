import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => {
  return (
    <Link to="/" className="flex items-center space-x-3 group transition-all duration-300">
      <div className="relative">
        <img 
          src="/yat-logo.png"
          alt="Yubisaki Assistive Technology (YAT) Logo"
          className={`${className} object-contain rounded-full shadow-md transition-transform duration-300 group-hover:scale-105`}
        />
        <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </div>
      <div className="block">
        <span className="text-2xl font-bold text-gray-900 tracking-tight">Yubisaki</span>
        <span className="text-base text-gray-600 block -mt-1 font-medium">Assistive Technology</span>
      </div>
    </Link>
  );
};

export default Logo;
