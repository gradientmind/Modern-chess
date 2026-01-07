import React, { useState } from 'react';
import { Globe, Users, Bot, BookOpen } from '../icons/Icons';
import { BotMenu } from '../modals/BotMenu';
import { PIECES } from '../pieces/Piece';
import type { BotDifficulty } from '../../types';

interface HomeViewProps {
  onStartGame: (mode: string, config?: { difficulty?: BotDifficulty }) => void;
  onRules: () => void;
  isOnlineEnabled?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({ onStartGame, onRules, isOnlineEnabled = false }) => {
  const [showBotMenu, setShowBotMenu] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="mb-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg viewBox="0 0 45 45" className="w-14 h-14 text-white fill-current">
              {PIECES['w']['n']}
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Modern Chess</h1>
        <p className="text-slate-400">Simple. Fast. Elegant.</p>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <button
          onClick={() => isOnlineEnabled && onStartGame('online-menu')}
          disabled={!isOnlineEnabled}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all ${
            isOnlineEnabled
              ? 'bg-blue-600 hover:bg-blue-500 active:scale-95 text-white'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Globe size={24} /> Play Online
          {!isOnlineEnabled && <span className="text-xs">(Setup Required)</span>}
        </button>
        <button
          onClick={() => onStartGame('pvp')}
          className="w-full py-4 px-6 bg-slate-700 hover:bg-slate-600 active:scale-95 transition-all rounded-xl font-bold text-lg text-slate-100 flex items-center justify-center gap-3"
        >
          <Users size={24} /> Pass & Play
        </button>
        <button
          onClick={() => setShowBotMenu(true)}
          className="w-full py-4 px-6 bg-slate-700 hover:bg-slate-600 active:scale-95 transition-all rounded-xl font-bold text-lg text-slate-100 flex items-center justify-center gap-3"
        >
          <Bot size={24} /> Play vs Bot
        </button>
        <button
          onClick={onRules}
          className="w-full py-4 px-6 bg-transparent border-2 border-slate-700 hover:bg-slate-800 active:scale-95 transition-all rounded-xl font-semibold text-lg text-slate-300 flex items-center justify-center gap-3"
        >
          <BookOpen size={24} /> Rules
        </button>
      </div>

      <BotMenu
        isOpen={showBotMenu}
        onClose={() => setShowBotMenu(false)}
        onSelect={(diff) => {
          setShowBotMenu(false);
          onStartGame('bot', { difficulty: diff });
        }}
      />
    </div>
  );
};
