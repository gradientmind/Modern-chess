import type { Chess, Move } from 'chess.js';
import { evaluateBoard, PIECE_VALUES } from './evaluation';
import type { BotDifficulty } from '../types';

const minimax = (
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean
): number => {
  if (depth === 0 || game.isGameOver()) {
    return -evaluateBoard(game);
  }

  const moves = game.moves();
  moves.sort((a, b) => (b.includes('x') ? 1 : 0) - (a.includes('x') ? 1 : 0));

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evalVal = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evalVal);
      alpha = Math.max(alpha, evalVal);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evalVal = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evalVal);
      beta = Math.min(beta, evalVal);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

export const getBestBotMove = (game: Chess, difficulty: BotDifficulty): Move | null => {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  // Level 1 (Easy): Material only
  if (difficulty === 1) {
    let bestMove: Move | null = null;
    let bestValue = -Infinity;
    moves.sort(() => Math.random() - 0.5);

    for (const move of moves) {
      game.move(move);
      let val = 0;
      const board = game.board();
      board.forEach((r) =>
        r.forEach((p) => {
          if (p) val += PIECE_VALUES[p.type] * (p.color === 'b' ? 1 : -1);
        })
      );
      game.undo();

      if (val > bestValue) {
        bestValue = val;
        bestMove = move;
      }
    }
    return bestMove || moves[Math.floor(Math.random() * moves.length)];
  }

  // Level 2 (Medium): Minimax Depth 2
  // Level 3 (Hard): Minimax Depth 3
  const depth = difficulty === 2 ? 2 : 3;
  let bestMove: Move | null = null;
  let bestValue = -Infinity;

  moves.sort(() => Math.random() - 0.5);

  for (const move of moves) {
    game.move(move);
    const val = minimax(game, depth - 1, -Infinity, Infinity, false);
    game.undo();
    if (val > bestValue) {
      bestValue = val;
      bestMove = move;
    }
  }

  return bestMove;
};
