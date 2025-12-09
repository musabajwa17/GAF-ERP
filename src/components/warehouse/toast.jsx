"use client"
import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    error: 'bg-gradient-to-r from-red-500 to-red-600',
    info: 'bg-gradient-to-r from-blue-500 to-blue-600'
  };

  return (
    <div className={`fixed top-6 right-6 ${styles[type]} text-white px-6 py-4 rounded-xl shadow-2xl z-[2000] font-semibold`}>
      {message}
    </div>
  );
};

export default Toast;