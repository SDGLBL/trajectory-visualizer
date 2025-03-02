import React from 'react';

interface StatusChipProps {
  status: string;
  label: string;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, label, className = '' }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'failure':
        return 'bg-red-500';
      case 'cancelled':
        return 'bg-orange-500';
      case 'in_progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor()} ${className}`}>
      {label}
    </span>
  );
};

export default StatusChip; 