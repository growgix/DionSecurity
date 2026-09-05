import React from 'react';

export const EmptyState = ({ icon = 'inbox', title = 'No records found', description = 'There are no active entries matching your current filters.', actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant/50">
      <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center text-secondary mb-3">
        <span className="material-symbols-outlined text-[32px]">{icon}</span>
      </div>
      <h3 className="font-headline-sm text-headline-sm text-primary font-medium">{title}</h3>
      <p className="font-body-sm text-body-sm text-secondary max-w-md mt-1 mb-4">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md hover:bg-primary-container transition-colors shadow-sm"
        >
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
