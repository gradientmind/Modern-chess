import React, { useState, useEffect, useRef } from 'react';
import { Chess, type Move } from 'chess.js';
import { ChevronLeft, RotateCcw, Bot, User } from '../icons/Icons';
import { Piece } from '../pieces/Piece';
import { PromotionModal } from '../modals/PromotionModal';
import { GameOverModal } from '../modals/GameOverModal';
import { ConfirmModal } from '../modals/ConfirmModal';
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
  DrawOffer,
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
  const gameRef = useRef(game);
  const [board, setBoard] = useState(game.board());
  const [turn, setTurn] = useState<PieceColor>('w');
  const [selectedSquare, setSelectedSquare] = useState<SquareName | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Move[]>([]);
  const [lastMove, setLastMove] = useState<MoveData | null>(null);
  const [checkSquare, setCheckSquare] = useState<SquareName | null>(null);
  const [promotionPending, setPromotionPending] = useState<PromotionPending | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'offer-draw' | 'accept-draw' | 'resign' | null>(
    null
  );
  const [drawOffer, setDrawOffer] = useState<DrawOffer | null>(null);
  const [isOnlineWaiting, setIsOnlineWaiting] = useState(
    mode === 'online' && onlineConfig?.playerColor === 'w'
  );

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const resultTimeoutRef = useRef<number | null>(null);
  const drawOfferTimeoutRef = useRef<number | null>(null);
  const resultRef = useRef<GameResult | null>(null);

  const clearResultTimeout = () => {
    if (resultTimeoutRef.current) {
      window.clearTimeout(resultTimeoutRef.current);
      resultTimeoutRef.current = null;
    }
  };

  const clearDrawOfferTimeout = () => {
    if (drawOfferTimeoutRef.current) {
      window.clearTimeout(drawOfferTimeoutRef.current);
      drawOfferTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  useEffect(() => {
    return () => {
      clearResultTimeout();
      clearDrawOfferTimeout();
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, []);

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

  const syncResult = async (newGame: Chess, res: GameResult) => {
    if (mode === 'online' && onlineConfig?.gameId && db) {
      const gameRefDoc = doc(db, 'artifacts', APP_ID, 'public', 'data', 'games', onlineConfig.gameId);
      await updateDoc(gameRefDoc, {
        fen: newGame.fen(),
        turn: newGame.turn(),
        history: newGame.history(),
        status: 'finished',
        result: res,
        drawOffer: null,
        lastMove: lastMove ?? null,
      });
    }
  };

  const endGame = (res: GameResult, newGame: Chess = game, syncOnline = true) => {
    clearResultTimeout();
    setResult(res);
    setShowResultModal(false);
    resultTimeoutRef.current = window.setTimeout(() => setShowResultModal(true), 1000);
    if (syncOnline) {
      syncResult(newGame, res);
    }
  };

  const updateGameState = (newGame: Chess = game, syncOnline = true) => {
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

      endGame(res, newGame, syncOnline);
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
      const gameDocRef = doc(
        db,
        'artifacts',
        APP_ID,
        'public',
        'data',
        'games',
        onlineConfig.gameId
      );

      unsubscribeRef.current = onSnapshot(
        gameDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (onlineConfig.playerColor === 'w' && data.black && data.status === 'active') {
              setIsOnlineWaiting(false);
            }
            if (data.status === 'finished' && data.result && !resultRef.current) {
              endGame(data.result, gameRef.current, false);
            }
            const offer = (data.drawOffer || null) as DrawOffer | null;
            setDrawOffer(offer);
            if (
              offer &&
              offer.from !== onlineConfig.playerColor &&
              !resultRef.current &&
              !promotionPending
            ) {
              setConfirmAction('accept-draw');
            }
            const remoteFen = data.fen;
            if (remoteFen && remoteFen !== gameRef.current.fen()) {
              const remoteGame = new Chess(remoteFen);
              gameRef.current = remoteGame;
              setGame(remoteGame);
              setLastMove(data.lastMove);
              playMoveSound();
              updateGameState(remoteGame, false);
            }
          }
        },
        (err) => console.error('Sync error', err)
      );
    }
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
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
    gameRef.current = newGame;
    setGame(newGame);
    setBoard(newGame.board());
    setTurn('w');
    clearResultTimeout();
    setResult(null);
    setShowResultModal(false);
    setLastMove(null);
    setCheckSquare(null);
    setSelectedSquare(null);
    setPossibleMoves([]);
    setDrawOffer(null);
    setConfirmAction(null);
  };

  const offerDraw = async () => {
    if (mode !== 'online' || !onlineConfig?.playerColor || !db || !onlineConfig.gameId) {
      drawGame();
      return;
    }
    if (drawOffer?.from === onlineConfig.playerColor) return;
    const gameDocRef = doc(
      db,
      'artifacts',
      APP_ID,
      'public',
      'data',
      'games',
      onlineConfig.gameId
    );
    await updateDoc(gameDocRef, {
      drawOffer: { from: onlineConfig.playerColor, createdAt: Date.now() },
    });
  };

  const clearDrawOffer = async () => {
    if (mode === 'online' && onlineConfig?.gameId && db) {
      const gameDocRef = doc(
        db,
        'artifacts',
        APP_ID,
        'public',
        'data',
        'games',
        onlineConfig.gameId
      );
      await updateDoc(gameDocRef, { drawOffer: null });
    }
    setDrawOffer(null);
  };

  const declineDraw = async () => {
    await clearDrawOffer();
  };

  const acceptDraw = async () => {
    endGame({ draw: true, reason: 'Draw by agreement' });
    setDrawOffer(null);
  };

  const resignGame = () => {
    const resigningColor =
      mode === 'online' ? onlineConfig?.playerColor : mode === 'bot' ? 'w' : turn;
    if (!resigningColor) return;
    const winner = resigningColor === 'w' ? 'b' : 'w';
    endGame({ winner, reason: 'Resignation' });
  };

  const drawGame = () => {
    endGame({ draw: true, reason: 'Draw by agreement' });
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
  const moveHistory = game.history();
  const moveRows = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    moveRows.push({
      move: i / 2 + 1,
      white: moveHistory[i],
      black: moveHistory[i + 1],
    });
  }

  const hasOutgoingDrawOffer =
    mode === 'online' && drawOffer?.from === onlineConfig?.playerColor;
  const hasIncomingDrawOffer =
    mode === 'online' && drawOffer?.from && drawOffer?.from !== onlineConfig?.playerColor;

  useEffect(() => {
    clearDrawOfferTimeout();
    if (mode !== 'online' || !drawOffer) return;
    const ttlMs = 60000;
    const expiresAt = drawOffer.createdAt + ttlMs;
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) {
      clearDrawOffer();
      return;
    }
    drawOfferTimeoutRef.current = window.setTimeout(() => {
      clearDrawOffer();
    }, remaining);
  }, [mode, drawOffer]);

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

      <div className="px-4 py-3">
        <div className="bg-slate-800 border border-slate-700 rounded-xl">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              Move List
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setConfirmAction(hasIncomingDrawOffer ? 'accept-draw' : 'offer-draw')
                }
                disabled={
                  !!result ||
                  !!promotionPending ||
                  isOnlineWaiting ||
                  (mode === 'online' && hasOutgoingDrawOffer)
                }
                className="px-2.5 py-1 text-xs font-bold text-slate-200 bg-slate-700 hover:bg-slate-600 rounded-lg disabled:opacity-40"
              >
                {hasOutgoingDrawOffer ? 'Draw Offered' : hasIncomingDrawOffer ? 'Respond to Draw' : 'Offer Draw'}
              </button>
              <button
                onClick={() => setConfirmAction('resign')}
                disabled={!!result || !!promotionPending || isOnlineWaiting}
                className="px-2.5 py-1 text-xs font-bold text-red-200 bg-red-900/40 hover:bg-red-900/60 rounded-lg disabled:opacity-40"
              >
                Resign
              </button>
            </div>
          </div>
          {(hasOutgoingDrawOffer || hasIncomingDrawOffer) && (
            <div className="px-3 py-2 text-xs font-semibold text-amber-300 bg-amber-500/10 border-b border-amber-500/30">
              {hasOutgoingDrawOffer
                ? 'Draw offer sent. Expires in 1 minute.'
                : 'Opponent offered a draw. Respond within 1 minute.'}
            </div>
          )}
          <div className="max-h-32 overflow-auto">
            {moveRows.length === 0 ? (
              <div className="px-3 py-3 text-xs text-slate-400">No moves yet.</div>
            ) : (
              <table className="w-full text-xs text-slate-300">
                <tbody>
                  {moveRows.map((row) => (
                    <tr key={row.move} className="border-t border-slate-700/60">
                      <td className="w-8 px-2 py-1 text-slate-500 font-semibold">{row.move}.</td>
                      <td className="px-2 py-1 font-medium text-slate-200">{row.white}</td>
                      <td className="px-2 py-1 text-slate-400">{row.black || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
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
        {result
          ? result.winner
            ? `${result.winner === 'w' ? 'White' : 'Black'} wins`
            : result.reason || 'Draw'
          : mode === 'online'
            ? 'Online Game'
            : 'Game in progress'}
      </div>

      {promotionPending && <PromotionModal color={turn} onPromote={handlePromotion} />}
      {confirmAction === 'offer-draw' && (
        <ConfirmModal
          title="Offer Draw?"
          message={mode === 'online' ? 'Send a draw offer to your opponent.' : 'End the game as a draw.'}
          confirmLabel={mode === 'online' ? 'Send Offer' : 'Accept Draw'}
          onConfirm={() => {
            setConfirmAction(null);
            offerDraw();
          }}
          onCancel={() => setConfirmAction(null)}
        />
      )}
      {confirmAction === 'accept-draw' && (
        <ConfirmModal
          title="Accept Draw?"
          message="Your opponent offered a draw."
          confirmLabel="Accept Draw"
          cancelLabel="Decline"
          onConfirm={() => {
            setConfirmAction(null);
            acceptDraw();
          }}
          onCancel={() => {
            setConfirmAction(null);
            declineDraw();
          }}
        />
      )}
      {confirmAction === 'resign' && (
        <ConfirmModal
          title="Resign Game?"
          message="This will end the game immediately."
          confirmLabel="Resign"
          onConfirm={() => {
            setConfirmAction(null);
            resignGame();
          }}
          onCancel={() => setConfirmAction(null)}
        />
      )}
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
