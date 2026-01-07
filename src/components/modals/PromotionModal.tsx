import React from 'react';
import { Modal } from './Modal';
import { Piece } from '../pieces/Piece';
import type { PieceColor, PieceType } from '../../types';

interface PromotionModalProps {
  color: PieceColor;
  onPromote: (piece: PieceType) => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({ color, onPromote }) => {
  const pieces: PieceType[] = ['q', 'r', 'n', 'b'];

  return (
    <Modal isOpen={true}>
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold text-white mb-6">Promote Pawn</h3>
        <div className="flex justify-center gap-4">
          {pieces.map((p) => (
            <button
              key={p}
              onClick={() => onPromote(p)}
              className="w-16 h-16 bg-slate-700 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors shadow-lg border border-slate-600 hover:border-blue-400"
            >
              <div className="w-12 h-12">
                <Piece type={p} color={color} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};
