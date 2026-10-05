import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, BookOpen, Award, Edit3, Trash2, Eye } from 'lucide-react';
import { calculateStudentAverage } from '../hooks/useStudentFilter';

export function StudentCard({
  student,
  coursesMap = {},
  onEdit,
  onDelete,
}) {
  const avgMark = calculateStudentAverage(student.marks);

  const getScoreBadgeColor = (score) => {
    if (score >= 85) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (score >= 75) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (score >= 60) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  const initials = student.name
    ? student.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ST';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div className="p-5">
        {/* Top Header: Avatar + Status + GPA */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                style={{ display: student.avatar ? 'none' : 'flex' }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-sm items-center justify-center border-2 border-white shadow-xs"
              >
                {initials}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  (student.status || 'Active').toLowerCase() === 'active'
                    ? 'bg-emerald-500'
                    : 'bg-slate-400'
                }`}
                title={`Status: ${student.status || 'Active'}`}
              />
            </div>
            <div>
              <Link
                to={`/students/${student.id}`}
                className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors line-clamp-1 text-base"
              >
                {student.name}
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <span>Age {student.age || 'N/A'}</span>
                <span>•</span>
                <span className="capitalize">{student.status || 'Active'}</span>
              </div>
            </div>
          </div>

          <div
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getScoreBadgeColor(
              avgMark
            )}`}
            title={`Average score: ${avgMark}%`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{avgMark > 0 ? `${avgMark}%` : 'N/A'}</span>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-1.5 text-xs text-slate-600 mb-4">
          <div className="flex items-center gap-2 text-slate-500 truncate">
            <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{student.email}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span>{student.city || 'Unknown City'}</span>
          </div>
        </div>

        {/* Enrolled Courses Chips */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Enrolled Courses
            </span>
            <span className="text-slate-500 font-semibold">
              {student.coursesEnrolled?.length || 0}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 min-h-[28px]">
            {student.coursesEnrolled && student.coursesEnrolled.length > 0 ? (
              student.coursesEnrolled.slice(0, 3).map((cId) => {
                const course = coursesMap[cId];
                return (
                  <span
                    key={cId}
                    className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 truncate max-w-[130px]"
                    title={course?.courseName || `Course #${cId}`}
                  >
                    {course ? course.code || course.courseName : `#${cId}`}
                  </span>
                );
              })
            ) : (
              <span className="text-xs text-slate-400 italic">No courses enrolled</span>
            )}
            {student.coursesEnrolled && student.coursesEnrolled.length > 3 && (
              <span className="inline-block px-1.5 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 text-indigo-600">
                +{student.coursesEnrolled.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Card Actions */}
      <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          to={`/students/${student.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 transition-colors py-1 px-2 rounded-md hover:bg-white"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Details</span>
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(student)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white transition-colors"
            title="Edit Student"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(student)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors"
            title="Delete Student"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentCard;
