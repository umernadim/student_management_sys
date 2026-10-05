import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Users } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 animate-fade-in">
      <div className="text-center max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block">
          404 Error
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          The academic record or page you requested does not exist or has been relocated.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/students"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Students Directory</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
