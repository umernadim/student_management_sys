import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { AlertCircle } from 'lucide-react';

export function EnrollmentModal({
  isOpen,
  onClose,
  onSubmit,
  enrollmentToEdit = null,
  students = [],
  courses = [],
  isLoading = false,
}) {
  const isEditing = Boolean(enrollmentToEdit);

  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    grade: 'A',
    semester: 'Fall 2025',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (enrollmentToEdit) {
      setFormData({
        studentId: String(enrollmentToEdit.studentId || ''),
        courseId: String(enrollmentToEdit.courseId || ''),
        grade: enrollmentToEdit.grade || 'A',
        semester: enrollmentToEdit.semester || 'Fall 2025',
      });
    } else {
      setFormData({
        studentId: students[0] ? String(students[0].id) : '',
        courseId: courses[0] ? String(courses[0].id) : '',
        grade: 'A',
        semester: 'Fall 2025',
      });
    }
    setErrors({});
  }, [enrollmentToEdit, isOpen, students, courses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.studentId) newErrors.studentId = 'Please select a student';
    if (!formData.courseId) newErrors.courseId = 'Please select a course';
    if (!formData.semester.trim()) newErrors.semester = 'Semester is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Update Enrollment' : 'Enroll Student in Course'}
      subtitle="Link a student to an academic course and assign grade and semester."
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Student Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Student <span className="text-rose-500">*</span>
          </label>
          <select
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            disabled={isEditing}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100 disabled:text-slate-500"
          >
            <option value="">Select student...</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.email})
              </option>
            ))}
          </select>
          {errors.studentId && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.studentId}
            </p>
          )}
        </div>

        {/* Course Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Course <span className="text-rose-500">*</span>
          </label>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            disabled={isEditing}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100 disabled:text-slate-500"
          >
            <option value="">Select course...</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}: {c.courseName} ({c.credits} Credits)
              </option>
            ))}
          </select>
          {errors.courseId && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.courseId}
            </p>
          )}
        </div>

        {/* Semester and Grade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Semester <span className="text-rose-500">*</span>
            </label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="Fall 2025">Fall 2025</option>
              <option value="Spring 2026">Spring 2026</option>
              <option value="Summer 2026">Summer 2026</option>
              <option value="Fall 2026">Fall 2026</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Grade Awarded
            </label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-semibold text-slate-800"
            >
              <option value="A+">A+ (4.0)</option>
              <option value="A">A (4.0)</option>
              <option value="A-">A- (3.7)</option>
              <option value="B+">B+ (3.3)</option>
              <option value="B">B (3.0)</option>
              <option value="B-">B- (2.7)</option>
              <option value="C+">C+ (2.3)</option>
              <option value="C">C (2.0)</option>
              <option value="F">F (0.0)</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : isEditing ? 'Update Enrollment' : 'Enroll Student'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default EnrollmentModal;
