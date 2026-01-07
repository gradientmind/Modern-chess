import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

const Icon: React.FC<IconProps & { path: React.ReactNode }> = ({
  path,
  size = 24,
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {path}
  </svg>
);

export const ChevronLeft: React.FC<IconProps> = (props) => (
  <Icon path={<path d="m15 18-6-6 6-6" />} {...props} />
);

export const RotateCcw: React.FC<IconProps> = (props) => (
  <Icon
    path={
      <>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74-2.74L3 12" />
        <path d="M3 3v9h9" />
      </>
    }
    {...props}
  />
);

export const User: React.FC<IconProps> = (props) => (
  <Icon
    path={
      <>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    }
    {...props}
  />
);

export const Bot: React.FC<IconProps> = (props) => (
  <Icon
    path={
      <>
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </>
    }
    {...props}
  />
);

export const BookOpen: React.FC<IconProps> = (props) => (
  <Icon
    path={
      <>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </>
    }
    {...props}
  />
);

export const Trophy: React.FC<IconProps> = (props) => (
  <Icon
    path={
      <>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2h-6c-2.76 0-5 2.24-5 5v5c0 2.21 1.79 4 4 4h2c2.21 0 4-1.79 4-4V7c0-2.76-2.24-5-5-5Z" />
      </>
    }
    {...props}
  />
);

export const Globe: React.FC<IconProps> = (props) => (
  <Icon
    path={
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </>
    }
    {...props}
  />
);

export const Copy: React.FC<IconProps> = (props) => (
  <Icon
    path={
      <>
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </>
    }
    {...props}
  />
);

export const Users: React.FC<IconProps> = (props) => (
  <Icon
    path={
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    }
    {...props}
  />
);

export const Check: React.FC<IconProps> = (props) => (
  <Icon path={<polyline points="20 6 9 17 4 12" />} {...props} />
);

export const Zap: React.FC<IconProps> = (props) => (
  <Icon path={<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />} {...props} />
);

export const Brain: React.FC<IconProps> = (props) => (
  <Icon
    path={
      <>
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
      </>
    }
    {...props}
  />
);

export const Eye: React.FC<IconProps> = (props) => (
  <Icon
    path={
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    }
    {...props}
  />
);
