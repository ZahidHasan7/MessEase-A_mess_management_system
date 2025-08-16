import React from 'react';

const StatCard = ({ title, value, icon, color, currency = '৳' }) => {
  const colors = {
    red: 'from-red-500 to-rose-500',
    blue: 'from-sky-500 to-indigo-500',
    green: 'from-green-500 to-emerald-500',
    yellow: 'from-amber-500 to-yellow-500',
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} p-5 rounded-2xl shadow-lg text-white transform hover:-translate-y-1 transition-transform duration-300`}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <p className="text-lg font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{currency}{value}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;