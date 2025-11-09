
import React from 'react';

export const LoadingSpinner: React.FC<{className?: string}> = ({className}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`animate-spin ${className}`}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const SearchIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
    </svg>
);

export const MapPinIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.42-.25.69-.441.27-.19.587-.437.936-.734.35-.3.724-.656 1.122-1.072l.001-.002c.398-.415.82-  .88 1.25-1.395.43-.515.825-1.06 1.178-1.625.353-.565.655-1.158.894-1.766.24-.608.409-1.238.491-1.878A6.98 6.98 0 0017 8c0-3.866-3.134-7-7-7S3 4.134 3 8c0 .64.082 1.27.238 1.878.082.64.25 1.268.49 1.878.24.608.54 1.2.894 1.766.353.565.748 1.11 1.178 1.625.43.515.852.98 1.25 1.395l.001.002c.398.416.772.772 1.122 1.072.35.297.666.544.936.734.27.19.504.34.69.44a5.741 5.741 0 00.28.14l.018.008.006.003zM10 11.25a3.25 3.25 0 100-6.5 3.25 3.25 0 000 6.5z" clipRule="evenodd" />
    </svg>
);
