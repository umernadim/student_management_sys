import React, { useState } from 'react';
import Modal from './Modal';
import { AlertCircle } from 'lucide-react';

export function CourseModal({ isOpen, onClose, onSubmit, isLoading = false }) {
  const [formData, setFormData] = useState({
    courseName: '',
    code: '',
    credits: 3,
    department: 'Computer Science',
    instructor: '',
    description: '',
    syllabus: '',
  });

  const [errors, setErrors] = useState({});

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

    if (!formData.courseName.trim()) newErrors.courseName = 'Course name is required';
    if (!formData.code.trim()) newErrors.code = 'Course code is required (e.g. CS101)';
    if (!formData.instructor.trim()) newErrors.instructor = 'Instructor name is required';
    if (!formData.credits || Number(formData.credits) < 1 || Number(formData.credits) > 6) {
      newErrors.credits = 'Credits must be between 1 and 6';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const syllabusArray = formData.syllabus
      ? formData.syllabus
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : ['Foundational Concepts', 'Practical Projects'];

    onSubmit({
      ...formData,
      credits: Number(formData.credits),
      syllabus: syllabusArray,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Course"
      subtitle="Define course metadata, syllabus topics, and assigned faculty."
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Course Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Course Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            placeholder="e.g. Distributed Systems"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          {errors.courseName && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.courseName}
            </p>
          )}
        </div>

        {/* Code & Credits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Course Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. CS450"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 uppercase"
            />
            {errors.code && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.code}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Credits (1 - 6) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="6"
              name="credits"
              value={formData.credits}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.credits && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.credits}
              </p>
            )}
          </div>
        </div>

        {/* Department & Instructor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Data Science">Data Science</option>
              <option value="Information Systems">Information Systems</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Lead Instructor <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              placeholder="e.g. Dr. Grace Hopper"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.instructor && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.instructor}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Course Overview
          </label>
          <textarea
            rows="2"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief summary of learning outcomes and prerequisites..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
          />
        </div>

        {/* Syllabus tags */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Key Topics (Comma separated)
          </label>
          <input
            type="text"
            name="syllabus"
            value={formData.syllabus}
            onChange={handleChange}
            placeholder="e.g. Distributed Consensus, Raft Protocol, Microservices"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
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
            {isLoading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CourseModal;
