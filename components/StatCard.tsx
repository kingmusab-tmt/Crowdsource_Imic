
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive = true }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</h4>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-bold text-white">{value}</p>
        {change && (
          <span className={`ml-2 text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
