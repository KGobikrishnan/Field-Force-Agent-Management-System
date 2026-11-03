import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  accentColor = 'blue',
  subtitle,
  onClick,
}) {
  const accentStyles = {
    blue: {
      border: 'border-slate-200/80 hover:border-blue-300',
      iconBg: 'bg-blue-50 text-blue-600',
      tagBg: 'text-blue-700 bg-blue-50/80',
    },
    emerald: {
      border: 'border-slate-200/80 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600',
      tagBg: 'text-emerald-700 bg-emerald-50/80',
    },
    amber: {
      border: 'border-slate-200/80 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600',
      tagBg: 'text-amber-800 bg-amber-50/80',
    },
    rose: {
      border: 'border-slate-200/80 hover:border-rose-300',
      iconBg: 'bg-rose-50 text-rose-600',
      tagBg: 'text-rose-700 bg-rose-50/80',
    },
    indigo: {
      border: 'border-slate-200/80 hover:border-indigo-300',
      iconBg: 'bg-indigo-50 text-indigo-600',
      tagBg: 'text-indigo-700 bg-indigo-50/80',
    },
    purple: {
      border: 'border-slate-200/80 hover:border-purple-300',
      iconBg: 'bg-purple-50 text-purple-600',
      tagBg: 'text-purple-700 bg-purple-50/80',
    },
  };

  const style = accentStyles[accentColor] || accentStyles.blue;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden p-5 rounded-2xl bg-white border ${style.border} shadow-sm hover:shadow-md transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</h4>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${style.iconBg} shrink-0 shadow-xs`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(change || subtitle) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {change && (
            <div
              className={`flex items-center gap-1 font-semibold ${
                isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{change}</span>
            </div>
          )}
          {subtitle && <span className="text-slate-500 font-medium">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
