import React, { useState } from 'react';
import { Chess } from 'chess.js';
import { ChevronLeft, Globe } from '../icons/Icons';
import {
  auth,
  db,
  APP_ID,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from '../../config/firebase';
import type { OnlineConfig, GameData } from '../../types';

interface OnlineMenuProps {
  onBack: () => void;
  onStartGame: (mode: 'online', config: OnlineConfig) => void;
}

export const OnlineMenu: React.FC<OnlineMenuProps> = ({ onBack, onStartGame }) => {
  const [gameIdInput, setGameIdInput] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  const handleCreate = async () => {
    if (!auth || !db) {
      setError('Firebase not configured');
      return;
    }

    setCreating(true);
    setError('');
    const user = auth.currentUser;
    if (!user) {
      setError('Connecting to server...');
      setCreating(false);
      return;
    }

    const newGameId = Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
      const gameData: GameData = {
        fen: new Chess().fen(),
        turn: 'w',
        history: [],
        white: user.uid,
        black: null,
        lastMove: null,
        status: 'waiting',
        createdAt: Date.now(),
        drawOffer: null,
      };

      await setDoc(
        doc(db, 'artifacts', APP_ID, 'public', 'data', 'games', newGameId),
        gameData
      );
      onStartGame('online', { gameId: newGameId, playerColor: 'w' });
    } catch (err) {
      console.error(err);
      setError('Create failed: ' + (err as Error).message);
      setCreating(false);
    }
  };

  const handleJoin = async () => {
    if (!auth || !db) {
      setError('Firebase not configured');
      return;
    }

    setJoining(true);
    setError('');

    const user = auth.currentUser;
    if (!user) {
      setError('Connecting to server...');
      setJoining(false);
      return;
    }

    const cleanId = gameIdInput.trim().toUpperCase();
    if (cleanId.length !== 6) {
      setError('Invalid Code');
      setJoining(false);
      return;
    }

    try {
      const gameRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'games', cleanId);
      const gameSnap = await getDoc(gameRef);

      if (!gameSnap.exists()) {
        setError('Game not found');
        setJoining(false);
        return;
      }

      const gameData = gameSnap.data() as GameData;

      if (gameData.status === 'finished') {
        setError('Game is over');
        setJoining(false);
        return;
      }

      if (gameData.white === user.uid) {
        onStartGame('online', { gameId: cleanId, playerColor: 'w' });
        return;
      }

      if (!gameData.black) {
        await updateDoc(gameRef, {
          black: user.uid,
          status: 'active',
        });
        onStartGame('online', { gameId: cleanId, playerColor: 'b' });
        return;
      }

      if (gameData.black === user.uid) {
        onStartGame('online', { gameId: cleanId, playerColor: 'b' });
        return;
      }

      setError('Game is full');
      setJoining(false);
    } catch (err) {
      console.error(err);
      setError('Join failed: ' + (err as Error).message);
      setJoining(false);
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-6 bg-slate-900">
      <button onClick={onBack} className="absolute top-6 left-6 text-slate-400 hover:text-white">
        <ChevronLeft size={24} />
      </button>

      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Play Online</h2>
          <p className="text-slate-400">Play with a friend on a different device</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-center text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleCreate}
            disabled={creating || joining}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {creating ? (
              'Creating...'
            ) : (
              <>
                <Globe size={20} /> Create New Game
              </>
            )}
          </button>

          <div className="flex items-center gap-4 text-slate-500 text-sm font-bold uppercase">
            <span className="flex-1 h-px bg-slate-700"></span> OR{' '}
            <span className="flex-1 h-px bg-slate-700"></span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="ENTER CODE"
              value={gameIdInput}
              onChange={(e) => {
                setGameIdInput(e.target.value.toUpperCase());
                setError('');
              }}
              className="flex-1 bg-slate-800 border-2 border-slate-700 rounded-xl px-4 text-center font-mono text-xl tracking-widest text-white focus:border-blue-500 outline-none uppercase placeholder:text-slate-600"
              maxLength={6}
            />
            <button
              onClick={handleJoin}
              disabled={joining || creating}
              className="px-6 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold text-white disabled:opacity-50"
            >
              {joining ? '...' : 'Join'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
