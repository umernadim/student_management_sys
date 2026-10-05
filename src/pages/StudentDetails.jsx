import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';
import { calculateStudentAverage } from '../hooks/useStudentFilter';
import StudentFormModal from '../components/StudentFormModal';
import EnrollmentModal from '../components/EnrollmentModal';
import ConfirmModal from '../components/ConfirmModal';

export function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    students,
    courses,
    enrollments,
    updateStudent,
    deleteStudent,
    addEnrollment,
    deleteEnrollment,
    loading,
  } = useStudentContext();

  const student = useMemo(() => {
    return students.find((s) => String(s.id) === String(id));
  }, [students, id]);

  // Find all enrollments for this student
  const studentEnrollments = useMemo(() => {
    return enrollments
      .filter((e) => String(e.studentId) === String(id))
      .map((e) => {
        const course = courses.find((c) => String(c.id) === String(e.courseId));
        return {
          ...e,
          courseName: course?.courseName || `Course #${e.courseId}`,
          courseCode: course?.code || 'N/A',
          credits: course?.credits || 3,
          instructor: course?.instructor || 'Faculty',
          department: course?.department || 'Academics',
        };
      });
  }, [enrollments, courses, id]);

  // Total credits calculation
  const totalCredits = useMemo(() => {
    return studentEnrollments.reduce((acc, curr) => acc + (Number(curr.credits) || 0), 0);
  }, [studentEnrollments]);

  const avgMark = student ? calculateStudentAverage(student.marks) : 0;

  // Modal controls
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEnrollmentId, setDeletingEnrollmentId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleEditSubmit = async (formData) => {
    setActionLoading(true);
    try {
      await updateStudent(id, formData);
      setIsEditModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEnrollSubmit = async (formData) => {
    setActionLoading(true);
    try {
      await addEnrollment({ ...formData, studentId: id });
      setIsEnrollModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    setActionLoading(true);
    try {
      await deleteStudent(id);
      navigate('/students');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEnrollment = async (enrollmentId, courseId) => {
    try {
      await deleteEnrollment(enrollmentId);
      // Also remove course from student's coursesEnrolled
      if (student && student.coursesEnrolled) {
        const updatedCourses = student.coursesEnrolled.filter((c) => String(c) !== String(courseId));
        const updatedMarks = (student.marks || []).filter((m) => String(m.courseId) !== String(courseId));
        await updateStudent(student.id, {
          ...student,
          coursesEnrolled: updatedCourses,
          marks: updatedMarks,
        });
      }
    } finally {
      setDeletingEnrollmentId(null);
    }
  };

  if (loading && !student) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500 font-medium">Loading student profile...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Student Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">
          The requested student ID does not match any current records.
        </p>
        <Link
          to="/students"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Students Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/students"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Profile</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Student</span>
          </button>
        </div>
      </div>

      {/* Hero Profile Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            {student.avatar ? (
              <img
                src={student.avatar}
                alt={student.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-50 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
                {student.name ? student.name[0] : 'S'}
              </div>
            )}
            <span
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                (student.status || 'Active').toLowerCase() === 'active'
                  ? 'bg-emerald-500'
                  : 'bg-slate-400'
              }`}
              title={`Status: ${student.status || 'Active'}`}
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {student.name}
              </h1>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-semibold ${
                  (student.status || 'Active').toLowerCase() === 'active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {student.status || 'Active'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{student.city || 'City not set'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{student.phone || '+1 (555) 000-0000'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Cumulative Average
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">{avgMark}%</span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
                <Award className="w-3.5 h-3.5" /> GPA {(avgMark / 25).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Enrolled Courses
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">
                {student.coursesEnrolled?.length || 0}
              </span>
              <span className="text-xs text-slate-500 font-medium">Active Curricula</span>
            </div>
          </div>

          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Credits Earned
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-indigo-600">{totalCredits}</span>
              <span className="text-xs text-slate-500 font-medium">Credits</span>
            </div>
          </div>
        </div>
      </div>

      {/* Marks Breakdown & Course Enrollments Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marks Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Subject Performance Marks
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluation results recorded for current term
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Update Marks
            </button>
          </div>

          <div className="space-y-4">
            {student.marks && student.marks.length > 0 ? (
              student.marks.map((mark, idx) => {
                const score = Number(mark.score) || 0;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">{mark.subject}</span>
                      <span className="font-bold text-slate-900">{score}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        className={`rounded-full transition-all duration-500 ${
                          score >= 85
                            ? 'bg-emerald-500'
                            : score >= 70
                            ? 'bg-indigo-500'
                            : score >= 50
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.max(score, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 italic py-6 text-center">
                No marks have been recorded yet for this student.
              </p>
            )}
          </div>
        </div>

        {/* Enrolled Courses & Registrations */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Course Registrations
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Official enrollment status and assigned grades
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEnrollModalOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enroll Course</span>
            </button>
          </div>

          <div className="space-y-3">
            {studentEnrollments.length > 0 ? (
              studentEnrollments.map((enr) => (
                <div
                  key={enr.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        {enr.courseCode}: {enr.courseName}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{enr.credits} Credits</span>
                      <span>•</span>
                      <span>{enr.semester}</span>
                      <span>•</span>
                      <span>Prof. {enr.instructor}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      Grade: {enr.grade}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteEnrollment(enr.id, enr.courseId)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Drop enrollment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-slate-400">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs">No active course registrations.</p>
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(true)}
                  className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Register in a course now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Student Modal */}
      <StudentFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        studentToEdit={student}
        availableCourses={courses}
        isLoading={actionLoading}
      />

      {/* Quick Enroll Modal */}
      <EnrollmentModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        onSubmit={handleEnrollSubmit}
        students={[student]}
        courses={courses}
        isLoading={actionLoading}
      />

      {/* Confirm Student Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteStudent}
        title="Delete Student"
        message={`Are you sure you want to delete ${student.name}? This will remove all their enrollments and data.`}
        confirmText="Yes, Delete Student"
        isLoading={actionLoading}
      />
    </div>
  );
}

export default StudentDetails;
