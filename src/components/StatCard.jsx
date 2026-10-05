import React from 'react';

const COLOR_MAPS = {
  indigo: {
    bg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    iconBg: 'bg-indigo-600 text-white',
    badge: 'text-indigo-700 bg-indigo-100/60',
  },
  emerald: {
    bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    iconBg: 'bg-emerald-600 text-white',
    badge: 'text-emerald-700 bg-emerald-100/60',
  },
  amber: {
    bg: 'bg-amber-50 text-amber-600 border-amber-100',
    iconBg: 'bg-amber-600 text-white',
    badge: 'text-amber-700 bg-amber-100/60',
  },
  violet: {
    bg: 'bg-purple-50 text-purple-600 border-purple-100',
    iconBg: 'bg-purple-600 text-white',
    badge: 'text-purple-700 bg-purple-100/60',
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'indigo',
}) {
  const scheme = COLOR_MAPS[color] || COLOR_MAPS.indigo;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl shadow-xs ${scheme.iconBg}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-2 pt-3 border-t border-slate-100 text-xs">
          {trend && (
            <span className={`px-2 py-0.5 rounded-full font-semibold ${scheme.badge}`}>
              {trend}
            </span>
          )}
          {subtitle && <span className="text-slate-500 font-medium">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}

export default StatCard;
