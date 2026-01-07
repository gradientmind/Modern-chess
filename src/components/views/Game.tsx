import React, { useState, useEffect, useRef } from 'react';
import { Chess, type Move } from 'chess.js';
import { ChevronLeft, RotateCcw, Bot, User } from '../icons/Icons';
import { Piece } from '../pieces/Piece';
import { PromotionModal } from '../modals/PromotionModal';
import { GameOverModal } from '../modals/GameOverModal';
import { WaitingModal } from '../modals/WaitingModal';
import { playMoveSound } from '../../utils/sound';
import { getBestBotMove } from '../../engine/minimax';
import {
  db,
  APP_ID,
  doc,
  updateDoc,
  onSnapshot,
} from '../../config/firebase';
import type {
  GameMode,
  OnlineConfig,
  BotDifficulty,
  GameResult,
  PromotionPending,
  MoveData,
  PieceColor,
  PieceType,
  SquareName,
} from '../../types';

interface GameProps {
  mode: GameMode;
  onlineConfig?: OnlineConfig;
  botDifficulty?: BotDifficulty;
  onExit: () => void;
}

export const Game: React.FC<GameProps> = ({ mode, onlineConfig, botDifficulty = 1, onExit }) => {
  const [game, setGame] = useState(new Chess());
  const [board, setBoard] = useState(game.board());
  const [turn, setTurn] = useState<PieceColor>('w');
  const [selectedSquare, setSelectedSquare] = useState<SquareName | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Move[]>([]);
  const [lastMove, setLastMove] = useState<MoveData | null>(null);
  const [checkSquare, setCheckSquare] = useState<SquareName | null>(null);
  const [promotionPending, setPromotionPending] = useState<PromotionPending | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isOnlineWaiting, setIsOnlineWaiting] = useState(
    mode === 'online' && onlineConfig?.playerColor === 'w'
  );

  const unsubscribeRef = useRef<(() => void) | null>(null);

  const isPlayerTurn = () => {
    if (mode === 'bot' && turn === 'b') return false;
    if (mode === 'online') {
      if (isOnlineWaiting) return false;
      if (turn !== onlineConfig?.playerColor) return false;
    }
    return true;
  };

  const findKing = (gameInst: Chess, color: PieceColor): SquareName | null => {
    const boardState = gameInst.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = boardState[r][c];
        if (piece?.type === 'k' && piece?.color === color) {
          return (String.fromCharCode(97 + c) + (8 - r)) as SquareName;
        }
      }
    }
    return null;
  };

  const updateGameState = (newGame: Chess = game) => {
    setBoard(newGame.board());
    setTurn(newGame.turn());

    if (newGame.isGameOver()) {
      let res: GameResult = {};
      if (newGame.isCheckmate()) {
        res = {
          winner: newGame.turn() === 'w' ? 'b' : 'w',
          reason: `Checkmate by ${newGame.turn() === 'w' ? 'Black' : 'White'}`,
        };
      } else if (newGame.isStalemate()) {
        res = { draw: true, reason: 'Stalemate' };
      } else if (newGame.isThreefoldRepetition()) {
        res = { draw: true, reason: 'Repetition' };
      } else if (newGame.isInsufficientMaterial()) {
        res = { draw: true, reason: 'Insufficient Material' };
      } else {
        res = { draw: true, reason: 'Draw' };
      }

      setResult(res);
      setTimeout(() => setShowResultModal(true), 1000);
    } else {
      if (newGame.inCheck()) {
        const kingPos = findKing(newGame, newGame.turn());
        setCheckSquare(kingPos);
      } else {
        setCheckSquare(null);
      }
    }
  };

  // Online game sync
  useEffect(() => {
    if (mode === 'online' && onlineConfig?.gameId && db) {
      const gameRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'games', onlineConfig.gameId);

      unsubscribeRef.current = onSnapshot(
        gameRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (onlineConfig.playerColor === 'w' && data.black && data.status === 'active') {
              setIsOnlineWaiting(false);
            }
            const remoteGame = new Chess(data.fen);
            if (remoteGame.fen() !== game.fen()) {
              setGame(remoteGame);
              setLastMove(data.lastMove);
              playMoveSound();
              updateGameState(remoteGame);
            }
          }
        },
        (err) => console.error('Sync error', err)
      );
    }
    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [mode, onlineConfig?.gameId]);

  const syncMove = async (newGame: Chess, moveData: MoveData) => {
    if (mode === 'online' && onlineConfig?.gameId && db) {
      const gameRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'games', onlineConfig.gameId);
      await updateDoc(gameRef, {
        fen: newGame.fen(),
        turn: newGame.turn(),
        lastMove: moveData,
        history: newGame.history(),
      });
    }
  };

  // Bot logic
  useEffect(() => {
    if (mode === 'bot' && turn === 'b' && !result && !promotionPending) {
      const timer = setTimeout(() => {
        const move = getBestBotMove(game, botDifficulty);
        if (move) {
          game.move(move);
          setLastMove({ from: move.from as SquareName, to: move.to as SquareName });
          playMoveSound();
          updateGameState();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [turn, result, promotionPending, mode, botDifficulty]);

  const onSquareClick = (square: SquareName) => {
    if (result || promotionPending) return;
    if (!isPlayerTurn()) return;

    const moveAttempt = possibleMoves.find((m) => m.to === square);

    if (moveAttempt) {
      if (
        moveAttempt.piece === 'p' &&
        ((moveAttempt.color === 'w' && square[1] === '8') ||
          (moveAttempt.color === 'b' && square[1] === '1'))
      ) {
        setPromotionPending({ from: selectedSquare!, to: square });
        return;
      }
      game.move({ from: selectedSquare!, to: square });
      const moveData: MoveData = { from: selectedSquare!, to: square };
      setLastMove(moveData);
      playMoveSound();
      setSelectedSquare(null);
      setPossibleMoves([]);
      updateGameState();
      syncMove(game, moveData);
      return;
    }

    const piece = game.get(square);
    if (piece && piece.color === turn) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setPossibleMoves([]);
      } else {
        setSelectedSquare(square);
        setPossibleMoves(game.moves({ square, verbose: true }));
      }
      return;
    }
    setSelectedSquare(null);
    setPossibleMoves([]);
  };

  const handlePromotion = (pieceType: PieceType) => {
    if (!promotionPending) return;
    game.move({
      from: promotionPending.from,
      to: promotionPending.to,
      promotion: pieceType,
    });
    const moveData: MoveData = {
      from: promotionPending.from,
      to: promotionPending.to,
      promotion: pieceType,
    };
    setLastMove(moveData);
    playMoveSound();
    setPromotionPending(null);
    setSelectedSquare(null);
    setPossibleMoves([]);
    updateGameState();
    syncMove(game, moveData);
  };

  const resetGame = async () => {
    if (mode === 'online') {
      onExit();
      return;
    }
    const newGame = new Chess();
    setGame(newGame);
    setBoard(newGame.board());
    setTurn('w');
    setResult(null);
    setShowResultModal(false);
    setLastMove(null);
    setCheckSquare(null);
    setSelectedSquare(null);
    setPossibleMoves([]);
  };

  const getBoardSquareColor = (row: number, col: number) =>
    (row + col) % 2 === 0 ? 'bg-board-light' : 'bg-board-dark';

  // Calculate captured pieces
  const startCounts: Record<string, number> = { p: 8, n: 2, b: 2, r: 2, q: 1 };
  const currentCounts: Record<PieceColor, Record<string, number>> = {
    w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0 },
  };
  board.forEach((row) =>
    row.forEach((p) => {
      if (p) currentCounts[p.color][p.type]++;
    })
  );
  const whiteLost: PieceType[] = [];
  const blackLost: PieceType[] = [];
  (['w', 'b'] as PieceColor[]).forEach((c) =>
    Object.keys(startCounts).forEach((type) => {
      for (let i = 0; i < startCounts[type] - currentCounts[c][type as PieceType]; i++) {
        (c === 'w' ? whiteLost : blackLost).push(type as PieceType);
      }
    })
  );

  const values: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };
  let wScore = 0;
  let bScore = 0;
  whiteLost.forEach((p) => (bScore += values[p]));
  blackLost.forEach((p) => (wScore += values[p]));
  const score =
    wScore === bScore
      ? null
      : wScore > bScore
        ? { leader: 'w' as PieceColor, diff: wScore - bScore }
        : { leader: 'b' as PieceColor, diff: bScore - wScore };

  const isFlipped = mode === 'online' && onlineConfig?.playerColor === 'b';

  if (isOnlineWaiting && onlineConfig) {
    return <WaitingModal gameId={onlineConfig.gameId} onCancel={onExit} />;
  }

  const renderSquare = (r: number, c: number) => {
    const actualR = isFlipped ? 7 - r : r;
    const actualC = isFlipped ? 7 - c : c;

    const piece = board[actualR][actualC];
    const squareName = (String.fromCharCode(97 + actualC) + (8 - actualR)) as SquareName;
    const isSelected = selectedSquare === squareName;
    const isLastMoveFrom = lastMove?.from === squareName;
    const isLastMoveTo = lastMove?.to === squareName;
    const isMoveOption = possibleMoves.find((m) => m.to === squareName);
    const isCheck = checkSquare === squareName;
    const isCapture = isMoveOption && piece;

    return (
      <div
        key={squareName}
        onClick={() => onSquareClick(squareName)}
        className={`relative flex items-center justify-center ${getBoardSquareColor(actualR, actualC)} ${isSelected ? '!bg-board-selected' : ''} ${(isLastMoveFrom || isLastMoveTo) && !isSelected ? 'highlight-last-move' : ''} cursor-pointer select-none`}
      >
        {actualC === (isFlipped ? 7 : 0) && (
          <span
            className={`absolute top-0.5 left-0.5 text-[0.6rem] font-bold ${getBoardSquareColor(actualR, actualC).includes('light') ? 'text-board-dark' : 'text-board-light'}`}
          >
            {8 - actualR}
          </span>
        )}
        {actualR === (isFlipped ? 0 : 7) && (
          <span
            className={`absolute bottom-0.5 right-1 text-[0.6rem] font-bold ${getBoardSquareColor(actualR, actualC).includes('light') ? 'text-board-dark' : 'text-board-light'}`}
          >
            {String.fromCharCode(97 + actualC)}
          </span>
        )}
        {isCheck && (
          <div className="absolute inset-0 rounded-full bg-red-500/50 shadow-[0_0_15px_red] z-0"></div>
        )}
        {piece && (
          <div className="w-[85%] h-[85%] z-10">
            <Piece type={piece.type} color={piece.color} />
          </div>
        )}
        {isMoveOption && !isCapture && (
          <div className="absolute w-3 h-3 bg-black/20 rounded-full z-20"></div>
        )}
        {isCapture && (
          <div className="absolute inset-0 border-[4px] border-black/20 rounded-full z-20"></div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-slate-900">
      <header className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <button
          onClick={onExit}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${turn === 'w' ? 'bg-white shadow-[0_0_10px_white]' : 'bg-slate-600'}`}
          ></div>
          <span className="font-bold text-slate-200">{turn === 'w' ? 'White' : 'Black'}'s Turn</span>
          <div
            className={`w-3 h-3 rounded-full ${turn === 'b' ? 'bg-black border border-slate-500 shadow-[0_0_10px_black]' : 'bg-slate-600'}`}
          ></div>
        </div>
        <button
          onClick={resetGame}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <RotateCcw size={20} />
        </button>
      </header>

      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            {mode === 'bot' ? (
              <Bot size={20} className="text-slate-400" />
            ) : (
              <User size={20} className="text-slate-400" />
            )}
          </div>
          <div>
            <div className="text-sm font-bold text-slate-200">
              {mode === 'bot'
                ? botDifficulty === 1
                  ? 'Bot (Easy)'
                  : botDifficulty === 2
                    ? 'Bot (Medium)'
                    : 'Bot (Hard)'
                : mode === 'online'
                  ? 'Opponent'
                  : 'Black'}
            </div>
            <div className="flex h-4 items-center gap-0.5">
              {(isFlipped ? blackLost : whiteLost).map((p, i) => (
                <div key={i} className="w-4 h-4 opacity-80">
                  <Piece type={p} color="w" />
                </div>
              ))}
              {score && score.leader === (isFlipped ? 'w' : 'b') && (
                <span className="text-xs text-green-500 font-bold ml-1">+{score.diff}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-2 sm:px-4 aspect-square">
        <div className="w-full h-full border-4 border-slate-800 rounded-lg overflow-hidden shadow-2xl relative">
          <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
            {Array(8)
              .fill(null)
              .map((_, r) =>
                Array(8)
                  .fill(null)
                  .map((_, c) => renderSquare(r, c))
              )}
          </div>

          {result && !showResultModal && (
            <div className="absolute bottom-4 left-4 right-4 bg-slate-800/95 backdrop-blur border border-slate-600 rounded-xl p-3 flex items-center justify-between shadow-2xl">
              <div className="text-sm font-bold text-white pl-2">
                {result.winner
                  ? result.winner === 'w'
                    ? 'White Wins'
                    : 'Black Wins'
                  : 'Game Drawn'}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResultModal(true)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg"
                >
                  Results
                </button>
                <button
                  onClick={resetGame}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-1"
                >
                  <RotateCcw size={14} /> New Game
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <User size={20} className="text-slate-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-200">You</div>
            <div className="flex h-4 items-center gap-0.5">
              {(isFlipped ? whiteLost : blackLost).map((p, i) => (
                <div key={i} className="w-4 h-4 opacity-80">
                  <Piece type={p} color="b" />
                </div>
              ))}
              {score && score.leader === (isFlipped ? 'b' : 'w') && (
                <span className="text-xs text-green-500 font-bold ml-1">+{score.diff}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-2 text-center text-xs text-slate-400 h-8 flex items-center justify-center border-t border-slate-700">
        {game.history().length === 0
          ? mode === 'online'
            ? 'Online Game'
            : 'Game Start'
          : game.history().slice(-4).join(' ')}
      </div>

      {promotionPending && <PromotionModal color={turn} onPromote={handlePromotion} />}
      {result && showResultModal && (
        <GameOverModal
          result={result}
          onRestart={resetGame}
          onExit={onExit}
          onViewBoard={() => setShowResultModal(false)}
        />
      )}
    </div>
  );
};
