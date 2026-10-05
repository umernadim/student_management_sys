import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  GraduationCap,
  Award,
  Plus,
  ArrowRight,
  TrendingUp,
  UserPlus,
  BookPlus,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';
import StatCard from '../components/StatCard';
import PerformanceChart from '../components/PerformanceChart';
import StudentFormModal from '../components/StudentFormModal';
import CourseModal from '../components/CourseModal';
import EnrollmentModal from '../components/EnrollmentModal';

export function Dashboard() {
  const {
    students,
    courses,
    enrollments,
    metrics,
    loading,
    addStudent,
    addCourse,
    addEnrollment,
  } = useStudentContext();

  // Modal controls
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleAddStudentSubmit = async (data) => {
    setActionLoading(true);
    try {
      await addStudent(data);
      setIsStudentModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddCourseSubmit = async (data) => {
    setActionLoading(true);
    try {
      await addCourse(data);
      setIsCourseModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddEnrollmentSubmit = async (data) => {
    setActionLoading(true);
    try {
      await addEnrollment(data);
      setIsEnrollModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            University Academic Session 2025 - 2026
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Student Management & Academic Analytics
          </h1>
          <p className="mt-2 text-indigo-100 text-xs sm:text-sm leading-relaxed">
            Monitor real-time student registrations, course enrollment metrics, grade distributions,
            and faculty assignments across university departments.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsStudentModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 text-xs font-bold hover:bg-indigo-50 shadow-xs transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add Student
            </button>
            <button
              type="button"
              onClick={() => setIsEnrollModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/40 hover:bg-indigo-500/60 border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              Quick Enroll
            </button>
            <button
              type="button"
              onClick={() => setIsCourseModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/40 hover:bg-indigo-500/60 border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition-colors"
            >
              <BookPlus className="w-4 h-4" />
              New Course
            </button>
          </div>
        </div>

        {/* Decorative circle glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-60 h-60 rounded-full bg-purple-500/20 blur-xl pointer-events-none" />
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Students"
          value={metrics.totalStudents}
          subtitle="Registered undergraduates"
          trend="+12% YoY"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Active Courses"
          value={metrics.activeCourses}
          subtitle="Accredited degree courses"
          trend="6 Departments"
          icon={BookOpen}
          color="emerald"
        />
        <StatCard
          title="Total Enrollments"
          value={metrics.totalEnrollments}
          subtitle="Course registrations"
          trend="Active Semesters"
          icon={GraduationCap}
          color="violet"
        />
        <StatCard
          title="Average Marks"
          value={`${metrics.averageMarks}%`}
          subtitle="Cohort weighted performance"
          trend="Top 15% GPA"
          icon={Award}
          color="amber"
        />
      </div>

      {/* Charts & Top Performers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Performance Chart (2 cols) */}
        <div className="lg:col-span-2">
          <PerformanceChart
            courses={courses}
            enrollments={enrollments}
            students={students}
          />
        </div>

        {/* Top Performing Students Leaderboard */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Top Performers
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Highest cohort score averages</p>
              </div>
              <Link
                to="/students"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {metrics.topStudents && metrics.topStudents.length > 0 ? (
                metrics.topStudents.map((student, rank) => (
                  <Link
                    key={student.id}
                    to={`/students/${student.id}`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          rank === 0
                            ? 'bg-amber-100 text-amber-700'
                            : rank === 1
                            ? 'bg-slate-200 text-slate-700'
                            : rank === 2
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {rank + 1}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {student.name}
                        </p>
                        <p className="text-[10px] text-slate-400">{student.city}</p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {student.avgMark}%
                    </span>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic py-4 text-center">No student records</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link
              to="/students"
              className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 py-2 rounded-xl bg-indigo-50/50 hover:bg-indigo-50 transition-colors"
            >
              <span>Explore All Students</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity: Recent Enrollments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Recent Enrollment Registrations
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest student-course associations logged in the system
            </p>
          </div>
          <Link
            to="/enrollments"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>Manage All Enrollments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-6">Student</th>
                <th className="py-3 px-6">Course</th>
                <th className="py-3 px-6">Semester</th>
                <th className="py-3 px-6">Grade</th>
                <th className="py-3 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {metrics.recentEnrollments && metrics.recentEnrollments.length > 0 ? (
                metrics.recentEnrollments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-900">
                      <Link
                        to={`/students/${item.studentId}`}
                        className="hover:text-indigo-600 transition-colors"
                      >
                        {item.studentName}
                      </Link>
                      <span className="block text-[11px] text-slate-400 font-normal">
                        {item.studentEmail}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="font-semibold text-slate-800">{item.courseCode}:</span>{' '}
                      <span>{item.courseName}</span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.semester}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {item.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-400">
                      {item.enrollmentDate || 'Recent'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400 italic">
                    No recent enrollments logged.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <StudentFormModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSubmit={handleAddStudentSubmit}
        availableCourses={courses}
        isLoading={actionLoading}
      />

      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSubmit={handleAddCourseSubmit}
        isLoading={actionLoading}
      />

      <EnrollmentModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        onSubmit={handleAddEnrollmentSubmit}
        students={students}
        courses={courses}
        isLoading={actionLoading}
      />
    </div>
  );
}

export default Dashboard;
