// components/Modal.js

import { useState } from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden  shadow-lg">
      <div className="fixed inset-0 backdrop-blur-md backdrop-filter"></div>

      <div className="bg-secondary relative max-w-md rounded-lg border-2 border-solid border-emerald-500 p-6 shadow-md">
        <button
          onClick={onClose}
          className="text-primary absolute right-0 top-0 mr-4 mt-4  hover:text-gray-700 focus:outline-none"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
