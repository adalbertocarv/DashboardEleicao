import React from 'react';

type StatusType = 'online' | 'offline' | 'away' | 'busy';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  pulsing?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  label, 
  pulsing = false 
}) => {
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-gray-400';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: StatusType) => {
    if (label) return label;
    
    switch (status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'away':
        return 'Ausente';
      case 'busy':
        return 'Ocupado';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="flex items-center space-x-1.5">
      <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(status)} ${pulsing ? 'animate-pulse-slow' : ''}`}></div>
      <span className="text-xs text-gray-600 font-medium">{getStatusLabel(status)}</span>
    </div>
  );
};

export default StatusBadge;