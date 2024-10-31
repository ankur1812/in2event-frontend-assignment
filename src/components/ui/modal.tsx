import React, { ReactNode, useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  // const modalRef = useRef(null)

  // Simple click handler to check if mouse is clicked outside the modal body
  const checkOutsideClick = (e: Event) => {
    // TODO Update logic
    // debugger;
    //  e.target?.id !== 'modal-header' && e.target?.id !== 'modal-body' && onClose && onClose();
  }

  useEffect( () => {
    document.addEventListener('click', checkOutsideClick);
    return () => {
        document.removeEventListener('click', checkOutsideClick);
    }
  }, [])

  if (!isOpen) return null;

  return (
    <>
      <div id="backdrop" className="fixed inset-0 bg-black bg-opacity-50 z-50" />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div id="modal-header" className="bg-black rounded-lg p-6 max-w-lg w-full relative">
          <button
            className="absolute top-2 right-2 text-gray-500 text-xl hover:text-gray-700"
            onClick={onClose}
          >
            &times;
          </button>
          <div id="modal-body">{children}</div>
        </div>
      </div>
    </>
  );
};

export { Modal };
