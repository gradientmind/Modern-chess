import React from 'react';
import { Modal } from './Modal';
import { Bot, Zap, Brain } from '../icons/Icons';
import type { BotDifficulty } from '../../types';

interface BotMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (difficulty: BotDifficulty) => void;
}

export const BotMenu: React.FC<BotMenuProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={true}>
      <div className="p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          ✕
        </button>
        <h3 className="text-xl font-bold text-white mb-6 text-center">Select Difficulty</h3>
        <div className="space-y-3">
          <button
            onClick={() => onSelect(1)}
            className="w-full py-4 px-4 bg-slate-700 hover:bg-green-600 rounded-xl flex items-center gap-4 transition-all group"
          >
            <div className="w-10 h-10 bg-slate-600 group-hover:bg-green-500 rounded-lg flex items-center justify-center text-slate-300 group-hover:text-white">
              <Bot size={24} />
            </div>
            <div className="text-left">
              <div className="font-bold text-white">Easy</div>
              <div className="text-xs text-slate-400 group-hover:text-green-100">
                Simple material trades
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelect(2)}
            className="w-full py-4 px-4 bg-slate-700 hover:bg-yellow-600 rounded-xl flex items-center gap-4 transition-all group"
          >
            <div className="w-10 h-10 bg-slate-600 group-hover:bg-yellow-500 rounded-lg flex items-center justify-center text-slate-300 group-hover:text-white">
              <Zap size={24} />
            </div>
            <div className="text-left">
              <div className="font-bold text-white">Medium</div>
              <div className="text-xs text-slate-400 group-hover:text-yellow-100">
                Looks 2 moves ahead
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelect(3)}
            className="w-full py-4 px-4 bg-slate-700 hover:bg-red-600 rounded-xl flex items-center gap-4 transition-all group"
          >
            <div className="w-10 h-10 bg-slate-600 group-hover:bg-red-500 rounded-lg flex items-center justify-center text-slate-300 group-hover:text-white">
              <Brain size={24} />
            </div>
            <div className="text-left">
              <div className="font-bold text-white">Hard</div>
              <div className="text-xs text-slate-400 group-hover:text-red-100">
                Positional strategy
              </div>
            </div>
          </button>
        </div>
      </div>
    </Modal>
  );
};
