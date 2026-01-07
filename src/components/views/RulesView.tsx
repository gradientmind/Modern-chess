import React from 'react';
import { ChevronLeft } from '../icons/Icons';

interface RulesViewProps {
  onBack: () => void;
}

export const RulesView: React.FC<RulesViewProps> = ({ onBack }) => (
  <div className="flex flex-col h-full bg-slate-900 text-slate-200 p-4 max-w-2xl mx-auto overflow-y-auto">
    <button
      onClick={onBack}
      className="flex items-center text-blue-400 mb-6 font-semibold hover:text-blue-300 transition-colors"
    >
      <ChevronLeft size={20} className="mr-1" /> Back
    </button>
    <h2 className="text-3xl font-bold mb-6 text-white">How to Play</h2>
    <div className="space-y-6">
      <section>
        <h3 className="text-xl font-bold text-blue-400 mb-2">The Goal</h3>
        <p className="leading-relaxed">
          Checkmate the opponent's King. This happens when the King is under attack ("in check") and
          cannot escape.
        </p>
      </section>
      <section>
        <h3 className="text-xl font-bold text-blue-400 mb-2">Piece Movement</h3>
        <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
          <li>
            <strong className="text-white">Pawn:</strong> Moves forward 1 square (or 2 on first
            move). Captures diagonally.
          </li>
          <li>
            <strong className="text-white">Rook:</strong> Moves horizontally or vertically any
            distance.
          </li>
          <li>
            <strong className="text-white">Knight:</strong> Moves in an 'L' shape. The only piece
            that can jump over others.
          </li>
          <li>
            <strong className="text-white">Bishop:</strong> Moves diagonally any distance.
          </li>
          <li>
            <strong className="text-white">Queen:</strong> Moves in any direction (straight or
            diagonal) any distance.
          </li>
          <li>
            <strong className="text-white">King:</strong> Moves 1 square in any direction.
          </li>
        </ul>
      </section>
    </div>
  </div>
);
