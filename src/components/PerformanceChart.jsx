import React, { useState } from 'react';
import { BarChart3, PieChart } from 'lucide-react';

export function PerformanceChart({ courses = [], enrollments = [], students = [] }) {
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'grades'

  // Calculate course enrollment counts
  const courseCounts = courses.map((course) => {
    const count = enrollments.filter((e) => String(e.courseId) === String(course.id)).length;
    return {
      name: course.code || course.courseName,
      fullName: course.courseName,
      count,
    };
  });

  const maxCourseCount = Math.max(...courseCounts.map((c) => c.count), 1);

  // Calculate grade distribution
  const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'];
  const gradeCounts = grades.map((g) => {
    const count = enrollments.filter((e) => e.grade === g).length;
    return { grade: g, count };
  });

  const maxGradeCount = Math.max(...gradeCounts.map((g) => g.count), 1);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Performance & Enrollment Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time visualization across courses and student grades
          </p>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'courses'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Course Enrollments</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('grades')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'grades'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Grade Distribution</span>
          </button>
        </div>
      </div>

      {activeTab === 'courses' ? (
        <div className="space-y-4">
          <div className="space-y-3">
            {courseCounts.map((item, index) => {
              const percentage = Math.round((item.count / maxCourseCount) * 100);
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 truncate max-w-[260px]" title={item.fullName}>
                      {item.name}: <span className="font-normal text-slate-500">{item.fullName}</span>
                    </span>
                    <span className="font-bold text-indigo-600 shrink-0">
                      {item.count} {item.count === 1 ? 'student' : 'students'}
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 6)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Aggregated across {courses.length} active curricula</span>
            <span>Scale: 0 to {maxCourseCount} students</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 items-end h-44 pt-6">
            {gradeCounts.map((item, index) => {
              const heightPercent = Math.max(Math.round((item.count / maxGradeCount) * 100), 8);
              return (
                <div key={index} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-bold text-slate-700 opacity-90 group-hover:scale-110 transition-transform">
                    {item.count}
                  </span>
                  <div className="w-full bg-slate-100 rounded-lg flex items-end justify-center p-0.5 h-28">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-md transition-all duration-500 group-hover:from-emerald-600 group-hover:to-teal-500"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">{item.grade}</span>
                </div>
              );
            })}
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Total graded enrollments: {enrollments.length}</span>
            <span>Higher academic band (A+ to B+)</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PerformanceChart;
