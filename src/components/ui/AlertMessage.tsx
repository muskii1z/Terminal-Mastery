'use client';

import React from 'react';

export interface AlertMessageProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  className?: string;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  type,
  title,
  message,
  className = ''
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: 'var(--accent-green)',
          color: 'white',
          borderColor: 'var(--accent-green)',
          iconColor: 'white'
        };
      case 'error':
        return {
          backgroundColor: 'var(--error-red)',
          color: 'white',
          borderColor: 'var(--error-red)',
          iconColor: 'white'
        };
      case 'warning':
        return {
          backgroundColor: 'var(--bg-tertiary)',
          color: 'var(--accent-orange)',
          borderColor: 'var(--accent-orange)',
          iconColor: 'var(--accent-orange)'
        };
      case 'info':
        return {
          backgroundColor: 'var(--bg-tertiary)',
          color: 'var(--accent-blue)',
          borderColor: 'var(--accent-blue)',
          iconColor: 'var(--accent-blue)'
        };
      default:
        return {};
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      className={`rounded-md border p-4 ${className}`}
      style={{
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        borderColor: styles.borderColor
      }}
    >
      <div className="flex items-start">
        <div style={{ color: styles.iconColor }} className="mr-3 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          <p className="text-sm leading-5">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlertMessage;