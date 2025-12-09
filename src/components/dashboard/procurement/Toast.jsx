import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-6 h-6" />,
    error: <XCircle className="w-6 h-6" />,
    info: <Info className="w-6 h-6" />
  };

  const styles = {
    success: "bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/50",
    error: "bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/50",
    info: "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50"
  };

  return (
    <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl text-white font-semibold animate-slideInRight ${styles[type]}`}>
      {icons[type]}
      <span>{message}</span>
    </div>
  );
}