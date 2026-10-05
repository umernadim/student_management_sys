import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  X,
  Database,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Students', path: '/students', icon: Users },
  { name: 'Courses', path: '/courses', icon: BookOpen },
  { name: 'Enrollments', path: '/enrollments', icon: GraduationCap },
];

export function Sidebar({ isOpen, onClose }) {
  const { isServerOnline } = useStudentContext();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800`}
      >
        {/* Brand & Close button */}
        <div>
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-base tracking-tight text-white leading-tight">
                  EduPulse
                </h1>
                <p className="text-[10px] text-indigo-400 font-medium tracking-wider uppercase">
                  Student Management
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Core Modules
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Server & Backend Status Footer */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Database className="w-3.5 h-3.5 text-indigo-400" /> JSON Server
              </span>
              <span
                className={`flex items-center gap-1 text-[11px] font-semibold ${
                  isServerOnline ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isServerOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                {isServerOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              {isServerOnline
                ? 'Connected to port 5000'
                : 'Run "npm run server" for DB sync'}
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>React 18+ • Vite v6+</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
