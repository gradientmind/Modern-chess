import React from 'react';
import { Globe, Copy } from '../icons/Icons';

interface WaitingModalProps {
  gameId: string;
  onCancel: () => void;
}

export const WaitingModal: React.FC<WaitingModalProps> = ({ gameId, onCancel }) => {
  const copyCode = () => {
    navigator.clipboard.writeText(gameId);
  };

  return (
    <div className="absolute inset-0 z-40 bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="animate-pulse-slow mb-8">
        <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 mx-auto">
          <Globe size={40} />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Waiting for Player...</h2>
      <p className="text-slate-400 mb-8">Share this code with your friend</p>

      <button
        onClick={copyCode}
        className="flex items-center gap-3 bg-slate-800 border-2 border-slate-700 rounded-xl px-6 py-4 mb-8 hover:bg-slate-700 hover:border-slate-600 transition-all group"
      >
        <span className="font-mono text-3xl font-bold tracking-widest text-white">{gameId}</span>
        <Copy className="text-slate-400 group-hover:text-white" />
      </button>

      <button onClick={onCancel} className="text-slate-500 hover:text-slate-300 font-semibold">
        Cancel
      </button>
    </div>
  );
};
