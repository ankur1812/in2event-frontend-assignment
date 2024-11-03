import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  isError: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, isError }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(!!message);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    visible && message && (
      <div
        className={cn("fixed z-50 top-4 right-4 px-3 py-2 text-white rounded shadow-lg animate-fadeInOut transition-opacity duration-2000 ease-in-out", (isError ? "bg-destructive" : "bg-emerald-500"))}>
        {message}
      </div>
    )
  );
};

export default Toast;
