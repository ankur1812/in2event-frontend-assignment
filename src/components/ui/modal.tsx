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
      <div id="modal-container" className="fixed inset-0 flex items-end md:items-center justify-center z-50">
        <div className="flex flex-col overflow-x-hidden overflow-y-auto border border-white bg-black rounded-lg p-6 md:max-w-[66%] w-full h-[90dvh] md:h-auto md:min-h-[60dvh] md:max-h-[90dvh] relative">
          <div className="relative flex items-center justify-center border-b border-white mb-3 text-xl pb-4">
            {title && (
              <div className="flex gap-4 items-center">
                {title == 'Add User' ? <Pencil2Icon className="scale-150" /> : <PersonIcon className="scale-150" />}
               {title}
              </div>
            )}
            <button
              className="absolute top-0 right-2 text-gray-500 text-xl hover:text-gray-700"
              onClick={onClose}
            >
              &times;
            </button>
          </div>
          <div id="modal-body">{children}</div>
        </div>
      </div>
    </>
  );
};

export { Modal };
