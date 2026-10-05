import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Calendar,
  BookOpen,
  User,
  Trash2,
  Edit3,
  CheckCircle,
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';
import EnrollmentModal from '../components/EnrollmentModal';
import ConfirmModal from '../components/ConfirmModal';

export function EnrollmentsPage() {
  const {
    students,
    courses,
    enrollments,
    addEnrollment,
    updateEnrollment,
    deleteEnrollment,
  } = useStudentContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [deletingEnrollment, setDeletingEnrollment] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Available semesters
  const availableSemesters = useMemo(() => {
    const set = new Set(enrollments.map((e) => e.semester).filter(Boolean));
    return Array.from(set).sort();
  }, [enrollments]);

  // Enrich enrollments with student and course details
  const enrichedEnrollments = useMemo(() => {
    return enrollments.map((enr) => {
      const student = students.find((s) => String(s.id) === String(enr.studentId));
      const course = courses.find((c) => String(c.id) === String(enr.courseId));
      return {
        ...enr,
        student,
        course,
        studentName: student?.name || `Student #${enr.studentId}`,
        studentEmail: student?.email || 'N/A',
        studentAvatar: student?.avatar,
        courseCode: course?.code || 'N/A',
        courseName: course?.courseName || `Course #${enr.courseId}`,
        credits: course?.credits || 3,
      };
    });
  }, [enrollments, students, courses]);

  // Filtered list
  const filteredEnrollments = useMemo(() => {
    return enrichedEnrollments.filter((enr) => {
      const query = searchTerm.toLowerCase().trim();
      const matchSearch =
        query === '' ||
        enr.studentName.toLowerCase().includes(query) ||
        enr.studentEmail.toLowerCase().includes(query) ||
        enr.courseCode.toLowerCase().includes(query) ||
        enr.courseName.toLowerCase().includes(query);

      const matchSemester =
        selectedSemester === '' || enr.semester === selectedSemester;

      const matchCourse =
        selectedCourseId === '' || String(enr.courseId) === String(selectedCourseId);

      return matchSearch && matchSemester && matchCourse;
    });
  }, [enrichedEnrollments, searchTerm, selectedSemester, selectedCourseId]);

  const handleOpenAdd = () => {
    setEditingEnrollment(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (enr) => {
    setEditingEnrollment(enr);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (editingEnrollment) {
        await updateEnrollment(editingEnrollment.id, formData);
      } else {
        await addEnrollment(formData);
      }
      setIsModalOpen(false);
      setEditingEnrollment(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingEnrollment) return;
    setActionLoading(true);
    try {
      await deleteEnrollment(deletingEnrollment.id);
      setDeletingEnrollment(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuickGradeChange = async (enr, newGrade) => {
    try {
      await updateEnrollment(enr.id, {
        ...enr,
        grade: newGrade,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Enrollments & Grades
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Register students into semester courses and administer letter grades.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors focus:ring-2 focus:ring-indigo-500 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Enrollment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, email, or course..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Semester Filter */}
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-indigo-500 text-slate-700"
          >
            <option value="">All Semesters</option>
            {availableSemesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>

          {/* Course Filter */}
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-indigo-500 text-slate-700"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-6">Student</th>
                <th className="py-3.5 px-6">Course</th>
                <th className="py-3.5 px-6">Semester</th>
                <th className="py-3.5 px-6">Grade</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEnrollments.length > 0 ? (
                filteredEnrollments.map((enr) => (
                  <tr key={enr.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Student */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        {enr.studentAvatar ? (
                          <img
                            src={enr.studentAvatar}
                            alt={enr.studentName}
                            className="w-8 h-8 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                            {enr.studentName ? enr.studentName[0] : 'S'}
                          </div>
                        )}
                        <div>
                          <Link
                            to={`/students/${enr.studentId}`}
                            className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors block"
                          >
                            {enr.studentName}
                          </Link>
                          <span className="text-[11px] text-slate-400 block font-normal">
                            {enr.studentEmail}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-3.5 px-6">
                      <div>
                        <span className="font-semibold text-slate-800">
                          {enr.courseCode}: {enr.courseName}
                        </span>
                        <span className="block text-[11px] text-slate-400">
                          {enr.credits} Credits • {enr.course?.department || 'Academics'}
                        </span>
                      </div>
                    </td>

                    {/* Semester */}
                    <td className="py-3.5 px-6">
                      <span className="inline-flex items-center gap-1.5 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {enr.semester}
                      </span>
                    </td>

                    {/* Grade with Quick selector */}
                    <td className="py-3.5 px-6">
                      <select
                        value={enr.grade || 'A'}
                        onChange={(e) => handleQuickGradeChange(enr, e.target.value)}
                        className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        title="Change letter grade"
                      >
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="B-">B-</option>
                        <option value="C+">C+</option>
                        <option value="C">C</option>
                        <option value="F">F</option>
                        <option value="In Progress">In Progress</option>
                      </select>
                    </td>

                    {/* Enrollment Date */}
                    <td className="py-3.5 px-6 text-slate-400 font-mono text-[11px]">
                      {enr.enrollmentDate || 'Recent'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(enr)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                          title="Edit enrollment"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingEnrollment(enr)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                          title="Delete enrollment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <GraduationCap className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-medium">No enrollments match your filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Enrollment Modal */}
      <EnrollmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEnrollment(null);
        }}
        onSubmit={handleModalSubmit}
        enrollmentToEdit={editingEnrollment}
        students={students}
        courses={courses}
        isLoading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingEnrollment)}
        onClose={() => setDeletingEnrollment(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Course Enrollment"
        message={`Are you sure you want to remove the enrollment for "${deletingEnrollment?.studentName}" in "${deletingEnrollment?.courseCode}"?`}
        confirmText="Yes, Remove Enrollment"
        isLoading={actionLoading}
      />
    </div>
  );
}

export default EnrollmentsPage;
