import React from 'react';

export const MetricCard = ({ title, value, icon, subtitle, delta, deltaType = 'up', badge, pulse = false }) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-sm flex flex-col justify-between gap-space-sm sm:gap-space-md hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">{title}</span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between pt-space-xs gap-2 flex-wrap">
        <span className="font-display-lg text-display-lg text-primary leading-none">{value}</span>
        {delta && (
          <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-label-sm text-label-sm font-medium ${
            deltaType === 'up' ? 'bg-secondary-container text-on-secondary-container' :
            deltaType === 'error' ? 'bg-error-container text-on-error-container' :
            'bg-surface-container-high text-on-surface'
          }`}>
            {deltaType === 'up' && <span className="material-symbols-outlined text-[14px]">arrow_upward</span>}
            {deltaType === 'error' && <span className="material-symbols-outlined text-[14px]">arrow_downward</span>}
            {delta}
          </span>
        )}
        {badge && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-medium">
            {pulse && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>}
            {badge}
          </span>
        )}
      </div>

      {subtitle && <div className="font-body-sm text-body-sm text-secondary">{subtitle}</div>}
    </div>
  );
};
