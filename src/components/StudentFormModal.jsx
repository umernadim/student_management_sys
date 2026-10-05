import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function StudentFormModal({
  isOpen,
  onClose,
  onSubmit,
  studentToEdit = null,
  availableCourses = [],
  isLoading = false,
}) {
  const isEditing = Boolean(studentToEdit);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    city: '',
    phone: '',
    avatar: '',
    status: 'Active',
    coursesEnrolled: [],
    marks: [],
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Reset or populate form when modal opens
  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        name: studentToEdit.name || '',
        email: studentToEdit.email || '',
        age: studentToEdit.age?.toString() || '',
        city: studentToEdit.city || '',
        phone: studentToEdit.phone || '',
        avatar: studentToEdit.avatar || '',
        status: studentToEdit.status || 'Active',
        coursesEnrolled: studentToEdit.coursesEnrolled || [],
        marks: studentToEdit.marks ? [...studentToEdit.marks] : [],
      });
    } else {
      setFormData({
        name: '',
        email: '',
        age: '',
        city: '',
        phone: '',
        avatar: '',
        status: 'Active',
        coursesEnrolled: [],
        marks: [],
      });
    }
    setErrors({});
    setTouched({});
  }, [studentToEdit, isOpen]);

  // Validation function
  const validate = (data) => {
    const errs = {};

    if (!data.name || !data.name.trim()) {
      errs.name = 'Full name is required';
    } else if (data.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!data.email || !data.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!EMAIL_REGEX.test(data.email.trim())) {
      errs.email = 'Enter a valid email address (e.g. name@university.edu)';
    }

    if (!data.age || data.age === '') {
      errs.age = 'Age is required';
    } else {
      const ageNum = Number(data.age);
      if (isNaN(ageNum) || !Number.isInteger(ageNum)) {
        errs.age = 'Age must be a valid whole number';
      } else if (ageNum < 15 || ageNum > 99) {
        errs.age = 'Age must be between 15 and 99';
      }
    }

    if (!data.city || !data.city.trim()) {
      errs.city = 'City is required';
    }

    // Validate marks if present
    if (data.marks && data.marks.length > 0) {
      data.marks.forEach((mark, index) => {
        const score = Number(mark.score);
        if (mark.score === '' || isNaN(score) || score < 0 || score > 100) {
          errs[`mark_${index}`] = 'Score must be between 0 and 100';
        }
      });
    }

    return errs;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(formData));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (touched[name]) {
        setErrors(validate(next));
      }
      return next;
    });
  };

  // Toggle enrolled course
  const handleCourseToggle = (courseId) => {
    const strId = String(courseId);
    setFormData((prev) => {
      const exists = prev.coursesEnrolled.includes(strId);
      const updatedCourses = exists
        ? prev.coursesEnrolled.filter((id) => id !== strId)
        : [...prev.coursesEnrolled, strId];

      // Also adjust marks if removed
      let updatedMarks = [...prev.marks];
      if (!exists) {
        const course = availableCourses.find((c) => String(c.id) === strId);
        updatedMarks.push({
          courseId: strId,
          subject: course?.courseName || `Course #${strId}`,
          score: 85,
        });
      } else {
        updatedMarks = updatedMarks.filter((m) => String(m.courseId) !== strId);
      }

      return {
        ...prev,
        coursesEnrolled: updatedCourses,
        marks: updatedMarks,
      };
    });
  };

  // Mark changes
  const handleMarkChange = (index, newScore) => {
    setFormData((prev) => {
      const nextMarks = [...prev.marks];
      nextMarks[index] = {
        ...nextMarks[index],
        score: newScore === '' ? '' : Math.min(100, Math.max(0, Number(newScore))),
      };
      return { ...prev, marks: nextMarks };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      name: true,
      email: true,
      age: true,
      city: true,
    });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload = {
      ...formData,
      age: Number(formData.age),
      marks: formData.marks.map((m) => ({
        ...m,
        score: Number(m.score) || 0,
      })),
    };

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Student Profile' : 'Add New Student'}
      subtitle={
        isEditing
          ? 'Update the student information, enrolled courses, and grade marks.'
          : 'Enter the student details to register them in the management dashboard.'
      }
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Basic Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              placeholder="e.g. Muhammad Hamza"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                errors.name && touched.name
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {errors.name && touched.name && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              placeholder="e.g. hamza@university.edu.pk"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                errors.email && touched.email
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Age (Years) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="age"
              min="15"
              max="99"
              value={formData.age}
              onChange={handleChange}
              onBlur={() => handleBlur('age')}
              placeholder="e.g. 21"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                errors.age && touched.age
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {errors.age && touched.age && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.age}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              City / Location <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              onBlur={() => handleBlur('city')}
              placeholder="e.g. Lahore, Karachi, Islamabad"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                errors.city && touched.city
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {errors.city && touched.city && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.city}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+92 300 1234567"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Enrollment Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>

        {/* Avatar URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Avatar Image URL (Optional)
          </label>
          <input
            type="url"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        {/* Courses Enrolled Checkboxes */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Assign Courses
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-44 overflow-y-auto p-1">
            {availableCourses.map((course) => {
              const isEnrolled = formData.coursesEnrolled.includes(String(course.id));
              return (
                <label
                  key={course.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    isEnrolled
                      ? 'border-indigo-500 bg-indigo-50/50 text-indigo-950'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isEnrolled}
                    onChange={() => handleCourseToggle(course.id)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold block">{course.code}: {course.courseName}</span>
                    <span className="text-slate-400">{course.credits} Credits • {course.instructor}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Marks Breakdown for Enrolled Courses */}
        {formData.marks.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Performance Marks (0 - 100)
            </label>
            <div className="space-y-2 max-h-36 overflow-y-auto p-1">
              {formData.marks.map((mark, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-xs font-medium text-slate-700 truncate max-w-[280px]">
                    {mark.subject}
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={mark.score}
                      onChange={(e) => handleMarkChange(idx, e.target.value)}
                      className="w-20 px-2 py-1 text-xs rounded-lg border border-slate-300 text-center font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-medium text-slate-400">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-xs pt-4 pb-1 border-t border-slate-100 flex items-center justify-end gap-3 z-10">
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
            className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Student'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default StudentFormModal;
