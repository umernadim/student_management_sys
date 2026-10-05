import React from 'react';
import { Menu, Plus, RefreshCw, Bell, Search } from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';

export function Navbar({ onMenuToggle, onOpenAddStudent }) {
  const { isServerOnline, refreshData, loading } = useStudentContext();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left side: Hamburger button + Current Workspace title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              University Portal
            </span>
            <h2 className="text-sm font-bold text-slate-800">
              Academic Administration Hub
            </h2>
          </div>
        </div>

        {/* Right side: Action controls & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Server status pill */}
          <div
            className={`hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isServerOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isServerOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>{isServerOnline ? 'JSON Server :5000' : 'Offline Mode'}</span>
          </div>

          {/* Refresh button */}
          <button
            type="button"
            onClick={() => refreshData()}
            disabled={loading}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors disabled:opacity-50"
            title="Refresh database"
            aria-label="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          {/* Quick Add Student Button */}
          {onOpenAddStudent && (
            <button
              type="button"
              onClick={onOpenAddStudent}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors focus:ring-2 focus:ring-indigo-500"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Student</span>
            </button>
          )}

          {/* Notifications bell */}
          <button
            type="button"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full" />
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Dean of Academic Affairs"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <div className="hidden xl:block text-left">
              <span className="text-xs font-semibold text-slate-800 block leading-tight">
                Dr. Tariq Mahmood
              </span>
              <span className="text-[10px] text-slate-400 font-medium block">
                Dean of Academic Affairs
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
