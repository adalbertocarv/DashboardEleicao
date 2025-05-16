import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  icon,
  action,
  children,
  className = '',
}) => {
  return (
    <div className={`card ${className}`}>
      {(title || subtitle || icon || action) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icon && <div className="text-blue-900">{icon}</div>}
            <div>
              {title && <h3 className="text-base font-medium text-gray-900">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;