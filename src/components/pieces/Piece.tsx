import React from 'react';
import type { PieceType, PieceColor } from '../../types';

const PIECES: Record<PieceColor, Record<PieceType, React.ReactNode>> = {
  w: {
    k: (
      <g
        fill="none"
        fillRule="evenodd"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22.5 11.63V6M20 8h5" strokeLinejoin="miter" />
        <path
          d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"
          fill="#fff"
          strokeLinecap="butt"
        />
        <path
          d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-5 5.5-8 12h-11c-3-6.5-4-13-8-12-3 6 6 10.5 6 10.5v7"
          fill="#fff"
          strokeLinecap="butt"
        />
        <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" />
      </g>
    ),
    q: (
      <g
        fill="#fff"
        fillRule="evenodd"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM10.5 20.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM42.5 20.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
          stroke="none"
          fill="#fff"
        />
        <path
          d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14.5V25l-7-11 2 12zM9 26c0 2 1.5 2 2.5 4 1 2.5 1 4.5 1 4.5s12.5-1.5 20 0c0 0 0-2 1-4.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0"
          strokeLinecap="butt"
        />
        <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" />
      </g>
    ),
    r: (
      <g
        fill="#fff"
        fillRule="evenodd"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5"
          strokeLinecap="butt"
        />
        <path d="M34 14l-3 3H14l-3-3" />
        <path d="M31 17v12.5c1 2 2 4 2 6.5H11c0-2.5 1-4.5 2-6.5V17" strokeLinecap="butt" />
        <path d="M31 29.5c1.5 2.5 2 5 2 6.5H12c0-1.5.5-4 2-6.5M12 33.5h21M11 14h23" fill="none" />
      </g>
    ),
    b: (
      <g
        fill="none"
        fillRule="evenodd"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g fill="#fff" strokeLinecap="butt">
          <path d="M9 36c3.39-.97 9.11-1.45 13.5-1.45 4.39 0 10.11.48 13.5 1.45V30c0-2.35-2.67-4.17-6-5.83V17c0-3.5-3.5-6-7.5-6C18.5 11 15 13.5 15 17v7.17c-3.33 1.66-6 3.48-6 5.83v6z" />
          <path d="M15 32c2.5 1.29 11 1.29 13.5 0" />
        </g>
        <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" fill="#fff" />
        <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" strokeLinejoin="miter" />
      </g>
    ),
    n: (
      <g
        fill="none"
        fillRule="evenodd"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff" strokeLinecap="butt" />
        <path
          d="M24 18c.38 2.32-4.68 1.94-5 5 1.67 1.34 2.87 3.32 2.76 5.46-1.92.54-3.59.88-5.76.54-1.99-.31-3.66-2.73-3.76-5.46.22-4.35 6.78-7.86 11.76-5.54z"
          fill="#fff"
          strokeLinejoin="miter"
        />
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff" strokeLinecap="butt" />
        <path
          d="M9.5 25.5A4.5 4.5 0 1 1 5 25.5a4.5 4.5 0 0 1 4.5 0z"
          fill="#fff"
          strokeLinejoin="miter"
        />
        <path d="M15 15.5c-5.5 1.5-6.5 11-4 13" strokeLinecap="butt" />
        <path
          d="M24 18c.38 2.32-4.68 1.94-5 5 1.67 1.34 2.87 3.32 2.76 5.46-1.92.54-3.59.88-5.76.54-1.99-.31-3.66-2.73-3.76-5.46.22-4.35 6.78-7.86 11.76-5.54z"
          fill="#fff"
          strokeLinejoin="miter"
        />
      </g>
    ),
    p: (
      <g
        fill="#fff"
        fillRule="evenodd"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-2.78-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
          strokeLinecap="butt"
        />
      </g>
    ),
  },
  b: {
    k: (
      <g
        fill="none"
        fillRule="evenodd"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22.5 11.63V6M20 8h5" strokeLinejoin="miter" />
        <path
          d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"
          fill="#000"
          strokeLinecap="butt"
        />
        <path
          d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-5 5.5-8 12h-11c-3-6.5-4-13-8-12-3 6 6 10.5 6 10.5v7"
          fill="#000"
          strokeLinecap="butt"
        />
        <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#fff" />
      </g>
    ),
    q: (
      <g
        fill="#000"
        fillRule="evenodd"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g stroke="#000" strokeLinecap="butt">
          <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14.5V25l-7-11 2 12zM9 26c0 2 1.5 2 2.5 4 1 2.5 1 4.5 1 4.5s12.5-1.5 20 0c0 0 0-2 1-4.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0" />
        </g>
        <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" stroke="#fff" />
        <path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM10.5 20.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM42.5 20.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="#000" />
      </g>
    ),
    r: (
      <g
        fill="#000"
        fillRule="evenodd"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5"
          strokeLinecap="butt"
        />
        <path d="M34 14l-3 3H14l-3-3" />
        <path d="M31 17v12.5c1 2 2 4 2 6.5H11c0-2.5 1-4.5 2-6.5V17" strokeLinecap="butt" />
        <path
          d="M31 29.5c1.5 2.5 2 5 2 6.5H12c0-1.5.5-4 2-6.5M12 33.5h21M11 14h23"
          fill="none"
          stroke="#fff"
        />
      </g>
    ),
    b: (
      <g
        fill="none"
        fillRule="evenodd"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g fill="#000" strokeLinecap="butt">
          <path d="M9 36c3.39-.97 9.11-1.45 13.5-1.45 4.39 0 10.11.48 13.5 1.45V30c0-2.35-2.67-4.17-6-5.83V17c0-3.5-3.5-6-7.5-6C18.5 11 15 13.5 15 17v7.17c-3.33 1.66-6 3.48-6 5.83v6z" />
          <path d="M15 32c2.5 1.29 11 1.29 13.5 0" />
        </g>
        <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" fill="#000" />
        <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#fff" strokeLinejoin="miter" />
      </g>
    ),
    n: (
      <g
        fill="none"
        fillRule="evenodd"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#000" strokeLinecap="butt" />
        <path
          d="M24 18c.38 2.32-4.68 1.94-5 5 1.67 1.34 2.87 3.32 2.76 5.46-1.92.54-3.59.88-5.76.54-1.99-.31-3.66-2.73-3.76-5.46.22-4.35 6.78-7.86 11.76-5.54z"
          fill="#000"
          strokeLinejoin="miter"
        />
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#000" strokeLinecap="butt" />
        <path
          d="M9.5 25.5A4.5 4.5 0 1 1 5 25.5a4.5 4.5 0 0 1 4.5 0z"
          fill="#000"
          strokeLinejoin="miter"
        />
        <path d="M15 15.5c-5.5 1.5-6.5 11-4 13" stroke="#fff" strokeLinecap="butt" />
        <path
          d="M24 18c.38 2.32-4.68 1.94-5 5 1.67 1.34 2.87 3.32 2.76 5.46-1.92.54-3.59.88-5.76.54-1.99-.31-3.66-2.73-3.76-5.46.22-4.35 6.78-7.86 11.76-5.54z"
          fill="#000"
          strokeLinejoin="miter"
        />
      </g>
    ),
    p: (
      <g
        fill="#000"
        fillRule="evenodd"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-2.78-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
          strokeLinecap="butt"
        />
      </g>
    ),
  },
};

interface PieceProps {
  type: PieceType;
  color: PieceColor;
}

export const Piece: React.FC<PieceProps> = ({ type, color }) => (
  <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-md">
    {PIECES[color][type]}
  </svg>
);

export { PIECES };
