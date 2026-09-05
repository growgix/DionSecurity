import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Breadcrumbs = ({ items = [], backTo = null, backLabel = 'Back' }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-lg">
      <div className="flex items-center gap-space-sm text-body-sm font-body-sm text-secondary flex-wrap">
        {backTo && (
          <Link
            to={backTo}
            className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm transition-colors mr-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>{backLabel}</span>
          </Link>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-outline/40">/</span>}
              {isLast || !item.to ? (
                <span className={isLast ? "font-label-md text-label-md text-on-surface font-semibold" : "text-outline"}>
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
