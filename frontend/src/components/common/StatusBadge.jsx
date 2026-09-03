import React from 'react';

export const StatusBadge = ({ status, text, pulse = false }) => {
  const normStatus = (status || '').toLowerCase().replace(/[\s-]/g, '_');

  let bgClass = "bg-surface-container text-on-surface-variant";
  let dotClass = "bg-outline";

  switch (normStatus) {
    case 'cleared':
    case 'present':
    case 'inside':
    case 'verified':
    case 'paid':
    case 'active':
    case 'occupied':
      bgClass = "bg-secondary-container text-on-secondary-container";
      dotClass = "bg-primary";
      break;
    
    case 'absent':
    case 'urgent':
    case 'emergency':
    case 'overdue':
    case 'critical':
      bgClass = "bg-error-container text-on-error-container";
      dotClass = "bg-error";
      break;

    case 'assigned':
    case 'pending':
    case 'in_progress':
    case 'late':
    case 'leave':
    case 'on_leave':
    case 'awaiting':
    case 'expected':
      bgClass = "bg-[#FAF5EC] text-[#A67C37]";
      dotClass = "bg-[#A67C37]";
      break;

    case 'completed':
    case 'exited':
    case 'vacant':
      bgClass = "bg-surface-container-high text-on-surface-variant";
      dotClass = "bg-secondary";
      break;

    default:
      bgClass = "bg-surface-container text-on-surface-variant";
      dotClass = "bg-outline";
  }

  const displayText = text || status;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold capitalize whitespace-nowrap ${bgClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass} ${pulse ? 'animate-ping' : ''}`}></span>
      <span>{displayText}</span>
    </span>
  );
};
