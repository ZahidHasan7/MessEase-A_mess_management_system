import React from 'react';

const GradientButton = ({ children, onClick, className = '', type = 'button', disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-2.5 rounded-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-[#fe5b56] to-[#f3aaa9] hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

export default GradientButton;