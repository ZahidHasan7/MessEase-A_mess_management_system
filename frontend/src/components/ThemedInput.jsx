import React from 'react';

const ThemedInput = ({ id, type, placeholder, value, onChange, className = '' }) => (
  <input
    id={id}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#fe5b56] focus:ring-2 focus:ring-[#fe5b56]/50 text-white outline-none transition-all duration-300 ${className}`}
  />
);

export default ThemedInput;