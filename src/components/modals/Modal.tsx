import React from 'react';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full border border-slate-700 overflow-hidden transform transition-all">
        {children}
      </div>
    </div>
  );
};
