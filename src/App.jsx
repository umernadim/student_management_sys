import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import StudentFormModal from './components/StudentFormModal';
import { ToastProvider } from './context/ToastContext';
import { StudentProvider, useStudentContext } from './context/StudentContext';

// Lazy-loaded route components for optimized code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const StudentsPage = lazy(() => import('./pages/StudentsPage'));
const StudentDetails = lazy(() => import('./pages/StudentDetails'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const EnrollmentsPage = lazy(() => import('./pages/EnrollmentsPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Fallback loader for Suspense
function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
      </div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider animate-pulse">
        Loading View...
      </p>
    </div>
  );
}

// App Layout with Sidebar, Navbar, and Content area
function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGlobalAddStudentOpen, setIsGlobalAddStudentOpen] = useState(false);
  const { courses, addStudent } = useStudentContext();
  const [isAdding, setIsAdding] = useState(false);

  const handleGlobalAddStudent = async (formData) => {
    setIsAdding(true);
    try {
      await addStudent(formData);
      setIsGlobalAddStudentOpen(false);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Navbar */}
        <Navbar
          onMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
          onOpenAddStudent={() => setIsGlobalAddStudentOpen(true)}
        />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/students/:id" element={<StudentDetails />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/enrollments" element={<EnrollmentsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        {/* Application Footer */}
        <footer className="py-6 px-6 border-t border-slate-200/80 text-center text-xs text-slate-400 bg-white/50">
          <p>
            EduPulse Academic ERP & Student Management System • React 18+ • Tailwind CSS • Vite
          </p>
        </footer>
      </div>

      {/* Global Add Student Modal */}
      <StudentFormModal
        isOpen={isGlobalAddStudentOpen}
        onClose={() => setIsGlobalAddStudentOpen(false)}
        onSubmit={handleGlobalAddStudent}
        availableCourses={courses}
        isLoading={isAdding}
      />
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <StudentProvider>
        <AppContent />
      </StudentProvider>
    </ToastProvider>
  );
}

export default App;
