import { cn } from "@/lib/utils";
import { PersonIcon, Pencil2Icon } from "@radix-ui/react-icons";
import React, { ReactNode, useEffect, useRef, useState } from "react";

interface ModalProps {
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  const [visible, setVisible] = useState<boolean>(true);

  const closeModal = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  }

  const checkOutsideClick = (e: Event) => {
     e.target?.id === 'modal-backdrop' || e.target?.id === 'modal-container' && closeModal();
  }

  const checkKeyInput = (e: Event) => {
    if (e.key === 'Escape') closeModal();
  }

  useEffect( () => {
    document.addEventListener('click', checkOutsideClick);
    document.addEventListener('keydown', checkKeyInput);
    document.body.style.overflow = 'hidden';
    return () => {
        document.removeEventListener('click', checkOutsideClick);
        document.removeEventListener('click', checkKeyInput);
        document.body.style.overflow = 'initial';
    }
  }, [])

  return (
    <>
      <div
        id="modal-backdrop"
        className={cn(
          "fixed inset-0 bg-black bg-opacity-80 z-50", 
            {"md:!animate-exitModal": !visible }, 
            {"md:!animate-enterModal": visible }
          )} 
      />
      <div id="modal-container" className="fixed inset-0 flex items-end md:items-center justify-center z-50 shadow-lg">
        <div className={
          cn(
            "flex flex-col border border-white bg-black rounded-sm md:max-w-[60%] w-full h-[90dvh] md:h-auto md:min-h-[70dvh] md:max-h-[90dvh] relative",
            {"animate-enterModal_mobile md:!animate-enterModal": visible},
            {"animate-exitModal_mobile md:!animate-exitModal": !visible}
          )}>
          <div id="modal-header" className=" flex items-center justify-center px-4 py-8 border-b border-white text-xl h-12">
            <div className="flex gap-4 items-center">
              {title == 'Add User' ? <Pencil2Icon className="scale-150" /> : <PersonIcon className="scale-150" />}
              {title}
            </div>
            <button onClick={closeModal} className="absolute top-1 right-3 text-gray-500 text-xl hover:text-gray-700">
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
