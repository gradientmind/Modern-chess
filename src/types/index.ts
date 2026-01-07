import type { Chess, Square, PieceSymbol, Color } from 'chess.js';

export type PieceType = PieceSymbol;
export type PieceColor = Color;
export type SquareName = Square;

export interface MoveData {
  from: SquareName;
  to: SquareName;
  promotion?: PieceType;
}

export interface OnlineConfig {
  gameId: string;
  playerColor: PieceColor;
}

export interface GameResult {
  winner?: PieceColor;
  draw?: boolean;
  reason?: string;
}

export interface PromotionPending {
  from: SquareName;
  to: SquareName;
}

export interface GameData {
  fen: string;
  turn: PieceColor;
  history: string[];
  white: string | null;
  black: string | null;
  lastMove: MoveData | null;
  status: 'waiting' | 'active' | 'finished';
  createdAt: number;
}

export type GameMode = 'pvp' | 'bot' | 'online';
export type ViewState = 'home' | 'online-menu' | 'game-pvp' | 'game-bot' | 'game-online' | 'rules';

export type BotDifficulty = 1 | 2 | 3;

export type { Chess, Square, PieceSymbol, Color };
