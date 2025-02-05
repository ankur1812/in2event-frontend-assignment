import React from "react";

const Spinner: React.FC = () => {

  return (
    <div className="flex items-center justify-center pointer-events-none min-h-20 flex-col gap-2 animate-pulse w-full">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export { Spinner };
