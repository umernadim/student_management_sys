import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { studentsApi, coursesApi, enrollmentsApi, checkServerHealth } from '../services/api';
import { useToast } from './ToastContext';
import { calculateStudentAverage } from '../hooks/useStudentFilter';
import { fallbackData } from '../services/mockFallback';

// Initial state pre-populated with Muslim Pakistani student records
const initialState = {
  students: fallbackData.students,
  courses: fallbackData.courses,
  enrollments: fallbackData.enrollments,
  loading: false,
  error: null,
  isServerOnline: true,
};

// Action types
const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  SET_SERVER_STATUS: 'SET_SERVER_STATUS',
  ADD_STUDENT: 'ADD_STUDENT',
  UPDATE_STUDENT: 'UPDATE_STUDENT',
  DELETE_STUDENT: 'DELETE_STUDENT',
  ADD_COURSE: 'ADD_COURSE',
  UPDATE_COURSE: 'UPDATE_COURSE',
  DELETE_COURSE: 'DELETE_COURSE',
  ADD_ENROLLMENT: 'ADD_ENROLLMENT',
  UPDATE_ENROLLMENT: 'UPDATE_ENROLLMENT',
  DELETE_ENROLLMENT: 'DELETE_ENROLLMENT',
};

// Reducer function
function studentReducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null };
    case ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        students: action.payload.students || [],
        courses: action.payload.courses || [],
        enrollments: action.payload.enrollments || [],
        isServerOnline: true,
      };
    case ACTIONS.FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ACTIONS.SET_SERVER_STATUS:
      return { ...state, isServerOnline: action.payload };
    case ACTIONS.ADD_STUDENT:
      return {
        ...state,
        students: [action.payload, ...state.students],
      };
    case ACTIONS.UPDATE_STUDENT:
      return {
        ...state,
        students: state.students.map((s) =>
          String(s.id) === String(action.payload.id) ? action.payload : s
        ),
      };
    case ACTIONS.DELETE_STUDENT:
      return {
        ...state,
        students: state.students.filter((s) => String(s.id) !== String(action.payload)),
        // Also cascade cleanup student's enrollments
        enrollments: state.enrollments.filter((e) => String(e.studentId) !== String(action.payload)),
      };
    case ACTIONS.ADD_COURSE:
      return {
        ...state,
        courses: [...state.courses, action.payload],
      };
    case ACTIONS.UPDATE_COURSE:
      return {
        ...state,
        courses: state.courses.map((c) =>
          String(c.id) === String(action.payload.id) ? action.payload : c
        ),
      };
    case ACTIONS.DELETE_COURSE:
      return {
        ...state,
        courses: state.courses.filter((c) => String(c.id) !== String(action.payload)),
        enrollments: state.enrollments.filter((e) => String(e.courseId) !== String(action.payload)),
      };
    case ACTIONS.ADD_ENROLLMENT:
      return {
        ...state,
        enrollments: [action.payload, ...state.enrollments],
      };
    case ACTIONS.UPDATE_ENROLLMENT:
      return {
        ...state,
        enrollments: state.enrollments.map((e) =>
          String(e.id) === String(action.payload.id) ? action.payload : e
        ),
      };
    case ACTIONS.DELETE_ENROLLMENT:
      return {
        ...state,
        enrollments: state.enrollments.filter((e) => String(e.id) !== String(action.payload)),
      };
    default:
      return state;
  }
}

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const [state, dispatch] = useReducer(studentReducer, initialState);
  const toast = useToast();

  // Load all data from JSON Server
  const loadData = useCallback(async () => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const [studentsData, coursesData, enrollmentsData] = await Promise.all([
        studentsApi.getAll(),
        coursesApi.getAll(),
        enrollmentsApi.getAll(),
      ]);

      dispatch({
        type: ACTIONS.FETCH_SUCCESS,
        payload: {
          students: studentsData,
          courses: coursesData,
          enrollments: enrollmentsData,
        },
      });
    } catch (err) {
      console.warn('JSON Server offline, serving initial catalog...', err);
      dispatch({ type: ACTIONS.SET_SERVER_STATUS, payload: false });
      dispatch({
        type: ACTIONS.FETCH_SUCCESS,
        payload: {
          students: fallbackData.students,
          courses: fallbackData.courses,
          enrollments: fallbackData.enrollments,
        },
      });
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Periodic health check
  useEffect(() => {
    const timer = setInterval(async () => {
      const isOnline = await checkServerHealth();
      dispatch({ type: ACTIONS.SET_SERVER_STATUS, payload: isOnline });
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // CRUD Operations for Students
  const addStudent = useCallback(
    async (studentData) => {
      try {
        const payload = {
          ...studentData,
          id: studentData.id || String(Date.now()),
          coursesEnrolled: studentData.coursesEnrolled || [],
          marks: studentData.marks || [],
          status: studentData.status || 'Active',
        };

        let savedStudent = payload;
        try {
          savedStudent = await studentsApi.create(payload);
        } catch (apiErr) {
          console.warn('Backend unavailable, applying locally in state:', apiErr);
        }

        dispatch({ type: ACTIONS.ADD_STUDENT, payload: savedStudent });
        toast.success(`Student "${savedStudent.name}" created successfully!`);
        return savedStudent;
      } catch (err) {
        toast.error(`Failed to add student: ${err.message || 'Unknown error'}`);
        throw err;
      }
    },
    [toast]
  );

  const updateStudent = useCallback(
    async (id, studentData) => {
      try {
        let updated = { ...studentData, id: String(id) };
        try {
          updated = await studentsApi.update(id, updated);
        } catch (apiErr) {
          console.warn('Backend unavailable, updating locally in state:', apiErr);
        }

        dispatch({ type: ACTIONS.UPDATE_STUDENT, payload: updated });
        toast.success(`Student "${updated.name}" updated successfully!`);
        return updated;
      } catch (err) {
        toast.error(`Failed to update student: ${err.message || 'Unknown error'}`);
        throw err;
      }
    },
    [toast]
  );

  const deleteStudent = useCallback(
    async (id) => {
      try {
        try {
          await studentsApi.delete(id);
        } catch (apiErr) {
          console.warn('Backend unavailable, deleting locally in state:', apiErr);
        }

        dispatch({ type: ACTIONS.DELETE_STUDENT, payload: id });
        toast.success('Student deleted successfully.');
        return true;
      } catch (err) {
        toast.error(`Failed to delete student: ${err.message || 'Unknown error'}`);
        throw err;
      }
    },
    [toast]
  );

  // CRUD for Courses
  const addCourse = useCallback(
    async (courseData) => {
      try {
        const payload = {
          ...courseData,
          id: courseData.id || String(Date.now()),
          credits: Number(courseData.credits) || 3,
        };

        let savedCourse = payload;
        try {
          savedCourse = await coursesApi.create(payload);
        } catch (apiErr) {
          console.warn('Backend unavailable, saving locally:', apiErr);
        }

        dispatch({ type: ACTIONS.ADD_COURSE, payload: savedCourse });
        toast.success(`Course "${savedCourse.courseName}" created!`);
        return savedCourse;
      } catch (err) {
        toast.error(`Failed to add course: ${err.message}`);
        throw err;
      }
    },
    [toast]
  );

  const deleteCourse = useCallback(
    async (id) => {
      try {
        try {
          await coursesApi.delete(id);
        } catch (apiErr) {
          console.warn('Backend unavailable, deleting locally:', apiErr);
        }
        dispatch({ type: ACTIONS.DELETE_COURSE, payload: id });
        toast.success('Course deleted successfully.');
      } catch (err) {
        toast.error(`Failed to delete course: ${err.message}`);
        throw err;
      }
    },
    [toast]
  );

  // CRUD for Enrollments
  const addEnrollment = useCallback(
    async (enrollmentData) => {
      try {
        const payload = {
          ...enrollmentData,
          id: enrollmentData.id || String(Date.now()),
          enrollmentDate: enrollmentData.enrollmentDate || new Date().toISOString().split('T')[0],
        };

        let saved = payload;
        try {
          saved = await enrollmentsApi.create(payload);
        } catch (apiErr) {
          console.warn('Backend unavailable, saving enrollment locally:', apiErr);
        }

        // Also update student's coursesEnrolled list
        const student = state.students.find((s) => String(s.id) === String(payload.studentId));
        if (student && !student.coursesEnrolled?.includes(String(payload.courseId))) {
          const updatedCourses = [...(student.coursesEnrolled || []), String(payload.courseId)];
          updateStudent(student.id, { ...student, coursesEnrolled: updatedCourses }).catch(() => {});
        }

        dispatch({ type: ACTIONS.ADD_ENROLLMENT, payload: saved });
        toast.success('Enrollment created successfully!');
        return saved;
      } catch (err) {
        toast.error(`Failed to enroll student: ${err.message}`);
        throw err;
      }
    },
    [state.students, toast, updateStudent]
  );

  const updateEnrollment = useCallback(
    async (id, enrollmentData) => {
      try {
        let updated = { ...enrollmentData, id: String(id) };
        try {
          updated = await enrollmentsApi.update(id, updated);
        } catch (apiErr) {
          console.warn('Backend unavailable, updating enrollment locally:', apiErr);
        }

        dispatch({ type: ACTIONS.UPDATE_ENROLLMENT, payload: updated });
        toast.success('Enrollment updated successfully!');
        return updated;
      } catch (err) {
        toast.error(`Failed to update enrollment: ${err.message}`);
        throw err;
      }
    },
    [toast]
  );

  const deleteEnrollment = useCallback(
    async (id) => {
      try {
        try {
          await enrollmentsApi.delete(id);
        } catch (apiErr) {
          console.warn('Backend unavailable, deleting enrollment locally:', apiErr);
        }

        dispatch({ type: ACTIONS.DELETE_ENROLLMENT, payload: id });
        toast.success('Enrollment removed successfully.');
      } catch (err) {
        toast.error(`Failed to delete enrollment: ${err.message}`);
        throw err;
      }
    },
    [toast]
  );

  // Lookups
  const getStudentById = useCallback(
    (id) => state.students.find((s) => String(s.id) === String(id)),
    [state.students]
  );

  const getCourseById = useCallback(
    (id) => state.courses.find((c) => String(c.id) === String(id)),
    [state.courses]
  );

  // Computed metrics for dashboard
  const metrics = useMemo(() => {
    const totalStudents = state.students.length;
    const activeCourses = state.courses.length;
    const totalEnrollments = state.enrollments.length;

    // Calculate overall average mark
    const allMarks = state.students.flatMap((s) => (s.marks || []).map((m) => Number(m.score) || 0));
    const averageMarks =
      allMarks.length > 0
        ? Number((allMarks.reduce((a, b) => a + b, 0) / allMarks.length).toFixed(1))
        : 0;

    // Top students
    const topStudents = [...state.students]
      .map((s) => ({
        ...s,
        avgMark: calculateStudentAverage(s.marks),
      }))
      .sort((a, b) => b.avgMark - a.avgMark)
      .slice(0, 5);

    // City distribution
    const cityCounts = state.students.reduce((acc, curr) => {
      const city = curr.city || 'Other';
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {});

    // Grade distribution from enrollments
    const gradeCounts = state.enrollments.reduce((acc, curr) => {
      const grade = curr.grade || 'Ungraded';
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});

    // Recent enrollments populated with student & course names
    const enrichedEnrollments = state.enrollments
      .slice(-5)
      .reverse()
      .map((e) => {
        const student = state.students.find((s) => String(s.id) === String(e.studentId));
        const course = state.courses.find((c) => String(c.id) === String(e.courseId));
        return {
          ...e,
          studentName: student ? student.name : `Student #${e.studentId}`,
          studentEmail: student?.email,
          courseName: course ? course.courseName : `Course #${e.courseId}`,
          courseCode: course?.code,
        };
      });

    return {
      totalStudents,
      activeCourses,
      totalEnrollments,
      averageMarks,
      topStudents,
      cityCounts,
      gradeCounts,
      recentEnrollments: enrichedEnrollments,
    };
  }, [state.students, state.courses, state.enrollments]);

  const value = {
    students: state.students,
    courses: state.courses,
    enrollments: state.enrollments,
    loading: state.loading,
    error: state.error,
    isServerOnline: state.isServerOnline,
    metrics,
    refreshData: loadData,
    addStudent,
    updateStudent,
    deleteStudent,
    addCourse,
    deleteCourse,
    addEnrollment,
    updateEnrollment,
    deleteEnrollment,
    getStudentById,
    getCourseById,
  };

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudentContext() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudentContext must be used within a StudentProvider');
  }
  return context;
}

export default StudentContext;
