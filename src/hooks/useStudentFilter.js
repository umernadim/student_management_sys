import { useMemo } from 'react';

/**
 * Calculates average mark for a student from their marks array
 * @param {Array<{score: number}>} marks
 * @returns {number} Average rounded to 1 decimal place
 */
export const calculateStudentAverage = (marks) => {
  if (!marks || !Array.isArray(marks) || marks.length === 0) return 0;
  const sum = marks.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
  return Number((sum / marks.length).toFixed(1));
};

/**
 * Custom hook to filter, sort, and paginate students efficiently
 */
export function useStudentFilter({
  students = [],
  searchTerm = '',
  selectedCity = '',
  selectedCourse = '',
  selectedStatus = '',
  sortBy = 'name-asc',
  currentPage = 1,
  itemsPerPage = 6,
}) {
  // Extract list of all unique cities for filtering dropdowns
  const availableCities = useMemo(() => {
    const citySet = new Set(
      students
        .map((s) => s.city?.trim())
        .filter(Boolean)
    );
    return Array.from(citySet).sort();
  }, [students]);

  // Main filter and sort calculation
  const filteredStudents = useMemo(() => {
    let result = [...students];

    // Filter by search query (name or email)
    if (searchTerm && searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name?.toLowerCase().includes(query) ||
          s.email?.toLowerCase().includes(query)
      );
    }

    // Filter by city
    if (selectedCity && selectedCity !== 'ALL') {
      result = result.filter(
        (s) => s.city?.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    // Filter by course
    if (selectedCourse && selectedCourse !== 'ALL') {
      result = result.filter((s) =>
        s.coursesEnrolled?.some((cId) => String(cId) === String(selectedCourse))
      );
    }

    // Filter by status
    if (selectedStatus && selectedStatus !== 'ALL') {
      result = result.filter(
        (s) => (s.status || 'Active').toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'age-asc':
          return (Number(a.age) || 0) - (Number(b.age) || 0);
        case 'age-desc':
          return (Number(b.age) || 0) - (Number(a.age) || 0);
        case 'marks-desc': {
          const avgA = calculateStudentAverage(a.marks);
          const avgB = calculateStudentAverage(b.marks);
          return avgB - avgA;
        }
        case 'marks-asc': {
          const avgA = calculateStudentAverage(a.marks);
          const avgB = calculateStudentAverage(b.marks);
          return avgA - avgB;
        }
        default:
          return 0;
      }
    });

    return result;
  }, [students, searchTerm, selectedCity, selectedCourse, selectedStatus, sortBy]);

  // Pagination calculation
  const totalResults = filteredStudents.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedStudents = useMemo(() => {
    const startIndex = (safePage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, safePage, itemsPerPage]);

  return {
    filteredStudents,
    paginatedStudents,
    totalResults,
    totalPages,
    currentPage: safePage,
    availableCities,
  };
}

export default useStudentFilter;
