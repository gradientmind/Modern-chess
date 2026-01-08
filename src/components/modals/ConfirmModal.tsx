import React from 'react';
import { Modal } from './Modal';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal isOpen={true}>
      <div className="p-6 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 mb-6">{message}</p>
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 rounded-xl font-bold text-white transition-colors"
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold text-slate-200 transition-colors"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
