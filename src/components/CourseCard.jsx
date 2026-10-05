import React from 'react';
import { BookOpen, UserCheck, Layers, Trash2 } from 'lucide-react';

export function CourseCard({
  course,
  enrolledCount = 0,
  onDelete,
  onViewStudents,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div className="p-5">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            {course.code || 'COURSE'}
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {course.credits} Credits
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-900 text-base mb-1 line-clamp-1">
          {course.courseName}
        </h3>
        <p className="text-xs text-indigo-600 font-medium mb-3">
          {course.department || 'General Studies'}
        </p>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {course.description || 'No detailed syllabus description provided.'}
        </p>

        {/* Instructor */}
        <div className="flex items-center gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4">
          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
            {course.instructor ? course.instructor[0] : 'P'}
          </div>
          <div className="truncate">
            <span className="text-[10px] text-slate-400 block font-normal uppercase tracking-wider">Instructor</span>
            <span className="font-medium truncate block">{course.instructor || 'Staff Instructor'}</span>
          </div>
        </div>

        {/* Syllabus Highlights */}
        {course.syllabus && course.syllabus.length > 0 && (
          <div>
            <div className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1">
              <Layers className="w-3 h-3" /> Topics Covered
            </div>
            <div className="flex flex-wrap gap-1">
              {course.syllabus.slice(0, 3).map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[10px] font-normal bg-slate-100 text-slate-600 truncate max-w-[120px]"
                >
                  {item}
                </span>
              ))}
              {course.syllabus.length > 3 && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] text-slate-400 bg-slate-50">
                  +{course.syllabus.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => onViewStudents && onViewStudents(course)}
          className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
        >
          <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
          <span>{enrolledCount} enrolled</span>
        </button>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(course)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors"
            title="Delete course"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default CourseCard;
