import React from 'react';

export const LoadingSkeleton = ({ type = 'table', rows = 5 }) => {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md animate-pulse">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="bg-surface-container-low rounded-xl p-space-lg h-36 flex flex-col justify-between">
            <div className="h-4 bg-outline-variant/30 rounded w-1/2"></div>
            <div className="h-8 bg-outline-variant/40 rounded w-1/3"></div>
            <div className="h-3 bg-outline-variant/20 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm animate-pulse space-y-4">
      <div className="h-6 bg-outline-variant/30 rounded w-1/4"></div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-4 py-2 border-b border-outline-variant/20">
            <div className="w-8 h-8 rounded-full bg-outline-variant/30 shrink-0"></div>
            <div className="flex-1 space-y-1.5">
              <div className="h-4 bg-outline-variant/30 rounded w-1/3"></div>
              <div className="h-3 bg-outline-variant/20 rounded w-1/4"></div>
            </div>
            <div className="h-6 bg-outline-variant/30 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
