import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    visible && message && (
      <div
        className="fixed top-4 right-4 px-3 py-2 bg-emerald-500 text-white rounded shadow-lg animate-fadeInOut transition-opacity duration-2000 ease-in-out">
        {message}
      </div>
    )
  );
};

export default Toast;
