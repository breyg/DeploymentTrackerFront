import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  console.log('Modal component rendering', { isOpen, title }); // Debug temporal
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;