import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Search,
  Users,
  GraduationCap,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';
import CourseCard from '../components/CourseCard';
import CourseModal from '../components/CourseModal';
import ConfirmModal from '../components/ConfirmModal';
import Modal from '../components/Modal';

export function CoursesPage() {
  const { courses, students, enrollments, addCourse, deleteCourse } = useStudentContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [viewingCourseStudents, setViewingCourseStudents] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Derive unique departments
  const departments = useMemo(() => {
    const set = new Set(courses.map((c) => c.department).filter(Boolean));
    return Array.from(set).sort();
  }, [courses]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchSearch =
        searchTerm === '' ||
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDept = selectedDept === '' || course.department === selectedDept;

      return matchSearch && matchDept;
    });
  }, [courses, searchTerm, selectedDept]);

  // Calculate enrolled count per course
  const enrollmentCounts = useMemo(() => {
    return courses.reduce((acc, c) => {
      const count = enrollments.filter((e) => String(e.courseId) === String(c.id)).length;
      acc[c.id] = count;
      return acc;
    }, {});
  }, [courses, enrollments]);

  // Students enrolled in selected course
  const studentsInSelectedCourse = useMemo(() => {
    if (!viewingCourseStudents) return [];
    const enrolledStudentIds = enrollments
      .filter((e) => String(e.courseId) === String(viewingCourseStudents.id))
      .map((e) => String(e.studentId));

    return students.filter((s) => enrolledStudentIds.includes(String(s.id)));
  }, [viewingCourseStudents, enrollments, students]);

  const handleAddSubmit = async (formData) => {
    setActionLoading(true);
    try {
      await addCourse(formData);
      setIsAddModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCourse) return;
    setActionLoading(true);
    try {
      await deleteCourse(deletingCourse.id);
      setDeletingCourse(null);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Courses Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Curriculum management, credit weighting, syllabus units, and faculty allocation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors focus:ring-2 focus:ring-indigo-500 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search course title, code (e.g. CS201), or instructor..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Departments ({courses.length})</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No courses found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search criteria or add a new course to the catalog.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              enrolledCount={enrollmentCounts[course.id] || 0}
              onDelete={(c) => setDeletingCourse(c)}
              onViewStudents={(c) => setViewingCourseStudents(c)}
            />
          ))}
        </div>
      )}

      {/* Add Course Modal */}
      <CourseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        isLoading={actionLoading}
      />

      {/* View Enrolled Students Modal */}
      <Modal
        isOpen={Boolean(viewingCourseStudents)}
        onClose={() => setViewingCourseStudents(null)}
        title={`Enrolled Students: ${viewingCourseStudents?.code}`}
        subtitle={`${viewingCourseStudents?.courseName} (${studentsInSelectedCourse.length} students enrolled)`}
        maxWidth="max-w-xl"
      >
        <div className="space-y-3">
          {studentsInSelectedCourse.length > 0 ? (
            studentsInSelectedCourse.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                    {student.name ? student.name[0] : 'S'}
                  </div>
                  <div>
                    <Link
                      to={`/students/${student.id}`}
                      className="text-xs font-semibold text-slate-800 hover:text-indigo-600 block"
                    >
                      {student.name}
                    </Link>
                    <span className="text-[11px] text-slate-400 block">{student.email}</span>
                  </div>
                </div>

                <Link
                  to={`/students/${student.id}`}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-400">
              <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">No students are currently registered in this course.</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Course Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingCourse)}
        onClose={() => setDeletingCourse(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Academic Course"
        message={`Are you sure you want to remove "${deletingCourse?.courseName}" (${deletingCourse?.code})? Enrolled students will have this course removed from their record.`}
        confirmText="Yes, Delete Course"
        isLoading={actionLoading}
      />
    </div>
  );
}

export default CoursesPage;
