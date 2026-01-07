import React from 'react';
import { Modal } from './Modal';
import { Trophy, Eye, RotateCcw } from '../icons/Icons';
import type { GameResult } from '../../types';

interface GameOverModalProps {
  result: GameResult;
  onRestart: () => void;
  onExit: () => void;
  onViewBoard: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  result,
  onRestart,
  onExit,
  onViewBoard,
}) => {
  let title = '';
  let message = '';

  if (result.winner) {
    title = 'Checkmate!';
    message = result.winner === 'w' ? 'White Wins' : 'Black Wins';
  } else if (result.draw) {
    title = 'Draw';
    message = result.reason || 'Stalemate';
  }

  return (
    <Modal isOpen={true}>
      <div className="p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4 text-yellow-500">
          <Trophy size={32} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        <p className="text-slate-400 text-lg mb-8">{message}</p>
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} /> Play Again
          </button>
          <button
            onClick={onViewBoard}
            className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold text-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <Eye size={20} /> View Board
          </button>
          <button
            onClick={onExit}
            className="w-full py-3 px-4 bg-transparent hover:bg-slate-800 rounded-xl font-semibold text-slate-400 transition-colors"
          >
            Exit to Menu
          </button>
        </div>
      </div>
    </Modal>
  );
};
