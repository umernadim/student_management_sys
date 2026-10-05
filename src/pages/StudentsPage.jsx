import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  MapPin,
  BookOpen,
  ArrowUpDown,
  RotateCcw,
  Eye,
  Edit3,
  Trash2,
  Award,
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';
import { useDebounce } from '../hooks/useDebounce';
import { useStudentFilter, calculateStudentAverage } from '../hooks/useStudentFilter';
import StudentCard from '../components/StudentCard';
import Pagination from '../components/Pagination';
import StudentFormModal from '../components/StudentFormModal';
import ConfirmModal from '../components/ConfirmModal';

export function StudentsPage() {
  const { students, courses, loading, addStudent, updateStudent, deleteStudent } =
    useStudentContext();

  // Search and filter states
  const [searchInput, setSearchInput] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Debounced search query
  const debouncedSearch = useDebounce(searchInput, 300);

  // Apply filtering and pagination hook
  const {
    paginatedStudents,
    totalResults,
    totalPages,
    currentPage: safePage,
    availableCities,
  } = useStudentFilter({
    students,
    searchTerm: debouncedSearch,
    selectedCity,
    selectedCourse,
    selectedStatus,
    sortBy,
    currentPage,
    itemsPerPage,
  });

  // Keep courses map for quick lookup: { [courseId]: courseObj }
  const coursesMap = useMemo(() => {
    return courses.reduce((acc, course) => {
      acc[course.id] = course;
      return acc;
    }, {});
  }, [courses]);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (student) => {
    setDeletingStudent(student);
  };

  const handleFormSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, formData);
      } else {
        await addStudent(formData);
      }
      setIsFormModalOpen(false);
      setEditingStudent(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;
    setActionLoading(true);
    try {
      await deleteStudent(deletingStudent.id);
      setDeletingStudent(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSelectedCity('');
    setSelectedCourse('');
    setSelectedStatus('');
    setSortBy('name-asc');
    setCurrentPage(1);
  };

  const isFiltering =
    searchInput !== '' ||
    selectedCity !== '' ||
    selectedCourse !== '' ||
    selectedStatus !== '';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage student registrations, academic tracks, enrollments, and profiles.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors focus:ring-2 focus:ring-indigo-500 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        {/* Search Input and View Switcher */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by student name or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {/* View Mode Toggle: Grid or Table */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
                aria-label="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dropdowns Row: City, Course, Status, Sort */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          {/* City Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Filter City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-indigo-500 text-slate-700"
            >
              <option value="">All Cities</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Course Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Filter Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-indigo-500 text-slate-700"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code || course.courseName}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-indigo-500 text-slate-700"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-indigo-500 text-slate-700"
            >
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
              <option value="marks-desc">Score (Highest First)</option>
              <option value="marks-asc">Score (Lowest First)</option>
              <option value="age-asc">Age (Youngest First)</option>
              <option value="age-desc">Age (Oldest First)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Pill & Clear Button */}
        {isFiltering && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Filtering active — found{' '}
              <strong className="text-slate-800">{totalResults}</strong> matches
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Content Rendering: Grid vs Table */}
      {paginatedStudents.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No students found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No student matches your current search criteria or filter options.
          </p>
          {isFiltering ? (
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
            >
              Clear all filters
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold transition-colors"
            >
              Add First Student
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {paginatedStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              coursesMap={coursesMap}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Student</th>
                  <th className="py-3.5 px-6">Location</th>
                  <th className="py-3.5 px-6">Age</th>
                  <th className="py-3.5 px-6">Enrolled Courses</th>
                  <th className="py-3.5 px-6">Average Mark</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedStudents.map((student) => {
                  const avg = calculateStudentAverage(student.marks);
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          {student.avatar ? (
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-9 h-9 rounded-full object-cover border"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                              {student.name ? student.name[0] : 'S'}
                            </div>
                          )}
                          <div>
                            <Link
                              to={`/students/${student.id}`}
                              className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors block"
                            >
                              {student.name}
                            </Link>
                            <span className="text-[11px] text-slate-400 block font-normal">
                              {student.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-slate-600">{student.city || 'N/A'}</td>
                      <td className="py-3.5 px-6 text-slate-600">{student.age || 'N/A'}</td>
                      <td className="py-3.5 px-6">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {student.coursesEnrolled && student.coursesEnrolled.length > 0 ? (
                            student.coursesEnrolled.slice(0, 2).map((cId) => (
                              <span
                                key={cId}
                                className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-700 font-medium"
                              >
                                {coursesMap[cId]?.code || `#${cId}`}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">None</span>
                          )}
                          {student.coursesEnrolled && student.coursesEnrolled.length > 2 && (
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-indigo-50 text-indigo-600 font-medium">
                              +{student.coursesEnrolled.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${
                            avg >= 85
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : avg >= 70
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <Award className="w-3 h-3" />
                          {avg > 0 ? `${avg}%` : 'N/A'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            (student.status || 'Active').toLowerCase() === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {student.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/students/${student.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(student)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(student)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        totalResults={totalResults}
        itemsPerPage={itemsPerPage}
        onPageChange={(p) => setCurrentPage(p)}
      />

      {/* Modals */}
      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleFormSubmit}
        studentToEdit={editingStudent}
        availableCourses={courses}
        isLoading={actionLoading}
      />

      <ConfirmModal
        isOpen={Boolean(deletingStudent)}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Student Record"
        message={`Are you sure you want to permanently delete "${deletingStudent?.name}"? All associated enrollment records will also be removed.`}
        confirmText="Yes, Delete Student"
        isLoading={actionLoading}
      />
    </div>
  );
}

export default StudentsPage;
