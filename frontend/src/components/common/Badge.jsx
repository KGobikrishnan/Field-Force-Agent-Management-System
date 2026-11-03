import React from 'react';

export function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[11px] font-semibold tracking-wide',
    sm: 'px-2.5 py-1 text-xs font-semibold tracking-wide',
    md: 'px-3 py-1.5 text-xs font-bold tracking-wider',
  };

  const variants = {
    // Statuses
    Collected: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'On Duty': 'bg-emerald-50 text-emerald-700 border border-emerald-200',

    Pending: 'bg-amber-50 text-amber-800 border border-amber-200',
    'In Progress': 'bg-blue-50 text-blue-700 border border-blue-200',
    'Customer Visit': 'bg-blue-50 text-blue-700 border border-blue-200',
    'KYC & Verification': 'bg-sky-50 text-sky-700 border border-sky-200',
    'Underwriting Review': 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    'New Enquiry': 'bg-cyan-50 text-cyan-800 border border-cyan-200',

    'Customer Unavailable': 'bg-rose-50 text-rose-700 border border-rose-200',
    Rescheduled: 'bg-orange-50 text-orange-800 border border-orange-200',
    Escalated: 'bg-red-50 text-red-700 border border-red-300 font-bold animate-pulse',
    Rejected: 'bg-rose-50 text-rose-700 border border-rose-200',
    'Off Duty': 'bg-slate-100 text-slate-600 border border-slate-200',
    'On Break': 'bg-amber-50 text-amber-700 border border-amber-200',

    // Priorities
    Critical: 'bg-red-50 text-red-700 border border-red-300 font-bold',
    High: 'bg-orange-50 text-orange-800 border border-orange-200',
    Medium: 'bg-blue-50 text-blue-700 border border-blue-200',
    Low: 'bg-slate-100 text-slate-600 border border-slate-200',

    // Neutral
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
  };

  const selectedClass = variants[variant] || variants.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full capitalize leading-none shadow-xs ${sizeClasses[size]} ${selectedClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {children}
    </span>
  );
}
