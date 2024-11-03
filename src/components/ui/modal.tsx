import { PersonIcon, Pencil2Icon } from "@radix-ui/react-icons";
import React, { ReactNode, useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, children }) => {

  const checkOutsideClick = (e: Event) => {
     e.target?.id === 'modal-backdrop' || e.target?.id === 'modal-container' && onClose();
  }

  const checkKeyInput = (e: Event) => {
    if (e.key === 'Escape') onClose();
  }

  useEffect( () => {
    document.addEventListener('click', checkOutsideClick);
    document.addEventListener('keydown', checkKeyInput);
    return () => {
        document.removeEventListener('click', checkOutsideClick);
        document.removeEventListener('click', checkKeyInput);
    }
  }, [])

  useEffect( () => {
    // Just a simple styling update to avoid document scroll in background
    document.body.style.overflow = isOpen ? 'hidden' : 'initial'
  }, [isOpen])

  if (!isOpen) return null;

  return (
    <>
      <div id="modal-backdrop" className="fixed inset-0 bg-black bg-opacity-50 z-50" />
      <div id="modal-container" className="fixed inset-0 flex items-end md:items-center justify-center z-50 shadow-lg">
        <div className="flex flex-col border border-white bg-black rounded-sm md:max-w-[66%] w-full h-[90dvh] md:h-auto md:min-h-[70dvh] md:max-h-[90dvh] relative">
          <div id="modal-header" className=" flex items-center justify-center px-4 py-8 border-b border-white text-xl h-12">
            <div className="flex gap-4 items-center">
              {title == 'Add User' ? <Pencil2Icon className="scale-150" /> : <PersonIcon className="scale-150" />}
              {title}
            </div>
            <button onClick={onClose} className="absolute top-1 right-3 text-gray-500 text-xl hover:text-gray-700">
              &times;
            </button>
          </div>
          <div id="modal-body" className="overflow-x-hidden overflow-y-auto px-8 py-4">{children}</div>
        </div>
      </div>
    </>
  );
};

export { Modal };
