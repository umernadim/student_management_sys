# 🎓 EduPulse - Student Management Dashboard

A production-ready React application built with **React 18+**, **Vite**, **Tailwind CSS**, and **JSON Server**, designed with clean frontend architecture, custom hooks, centralized state management with `useReducer`, and responsive design.

---

## Key Features

### 1. Executive Dashboard
- **KPI Stat Cards**: Instant visual summaries of Total Students, Active Courses, Total Enrollments, and Cohort Average Marks.
- **Interactive Performance & Enrollment Breakdown**: Toggle between Course Enrollment density and Grade Distribution with animated SVG progress charts.
- **Top Performers Leaderboard**: Highlights the top 5 students ranked by academic score average.
- **Recent Registrations Audit**: Audit trail of the latest enrollments with quick navigation links.

### 2. 👥 Students Directory (Full CRUD & Search/Filter)
- **Full CRUD**: Add, Edit, Delete, and Inspect student profiles.
- **Debounced Search**: Optimized real-time search across student names and emails via `useDebounce`.
- **Multi-criteria Filtering**: Filter by City, Enrolled Course, and Status (Active/Inactive/Graduated).
- **Flexible Sorting**: Sort by Name (A-Z, Z-A), Cohort Score (Highest/Lowest), or Age.
- **Dual View Layout**: Seamlessly switch between Grid Cards and Compact Table views.
- **Pagination**: Paginated navigation with ellipsis bounds checking and item range counter.

### 3. Student Details View (`/students/:id`)
- **Student Profile**: Academic hero card with avatar, contact information, and enrollment status.
- **Credit & Score Summary**: Cumulative average mark gauge and total accredited credits.
- **Marks Breakdown**: Subject-wise scores with color-coded performance meters.
- **Enrollment Actions**: Quick modal to enroll the student in additional courses or drop existing registrations.

### 4. Courses Catalog (`/courses`)
- **Curriculum Overview**: Departmental tags, credit ratings, instructors, descriptions, and syllabus units.
- **Enrolled Roster Inspection**: Click on any course's enrollment count to inspect the enrolled student roster in an accessible modal.
- **Course Administration**: Add new courses with custom syllabus topics and manage course catalogs.

### 5. Enrollments & Grades (`/enrollments`)
- **Matrix View**: Table of student-to-course associations.
- **Quick Grade Updater**: Change letter grades (`A+` to `F`) directly in-place or via modal.
- **Semester Filters**: Filter enrollments across Fall, Spring, and Summer terms.
- **Create & Drop Enrollments**: Full lifecycle support for course assignments.

### 6. Robust Architecture & UX
- **Global Toast Notification System**: Floating, auto-dismissing alerts for all CRUD operations.
- **Route Code Splitting**: `React.lazy` and `Suspense` with an elegant loader fallback for all pages.
- **Controlled Forms & Live Validation**: Rigorous validation rules for required fields, valid email regex, and positive age/marks boundaries.
- **Resilient Fallback**: Automatically senses JSON Server connectivity and provides offline notifications.

---

## Project Architecture

```
student_management_sys/
├── src/
│   ├── assets/                 # Static visual assets
│   ├── components/
│   │   ├── ConfirmModal.jsx    # Action confirmation dialogs
│   │   ├── CourseCard.jsx      # Course presentation card
│   │   ├── CourseModal.jsx     # Add/edit course modal form
│   │   ├── EnrollmentModal.jsx # Student-course enrollment modal form
│   │   ├── Modal.jsx           # Accessible dialog backdrop & wrapper
│   │   ├── Navbar.jsx          # Header with status & quick actions
│   │   ├── Pagination.jsx      # Accessible pagination control
│   │   ├── PerformanceChart.jsx# SVG/Tailwind analytics chart
│   │   ├── Sidebar.jsx         # Responsive desktop/mobile drawer
│   │   ├── StatCard.jsx        # KPI metric card component
│   │   ├── StudentCard.jsx     # Student profile card for grid view
│   │   ├── StudentFormModal.jsx# Controlled form with live validation
│   │   └── Toast.jsx           # Global floating notification toasts
│   ├── context/
│   │   ├── StudentContext.jsx  # Reducer-based global state & CRUD actions
│   │   └── ToastContext.jsx    # Alert toast notifications dispatch
│   ├── hooks/
│   │   ├── useDebounce.js      # Debounce hook for input throttling
│   │   ├── useFetch.js         # Reusable async GET hook
│   │   └── useStudentFilter.js # Filtering, sorting, and pagination logic
│   ├── pages/
│   │   ├── CoursesPage.jsx     # Course catalog view
│   │   ├── Dashboard.jsx       # Analytics dashboard
│   │   ├── EnrollmentsPage.jsx # Enrollment matrix & grade management
│   │   ├── NotFound.jsx        # 404 error page
│   │   ├── StudentDetails.jsx  # Individual student profile view
│   │   └── StudentsPage.jsx    # Student directory with search & filters
│   ├── services/
│   │   └── api.js              # Axios abstraction layer for JSON Server
│   ├── App.jsx                 # App shell, routing, code splitting
│   ├── index.css               # Tailwind CSS v4 styling rules
│   └── main.jsx                # React root and BrowserRouter
├── db.json                     # JSON Server mock database
├── package.json                # Project dependencies and run scripts
└── vite.config.js              # Vite configuration with React & Tailwind
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 1. Start the Mock JSON Server
Open a terminal and run the mock backend on port `5000`:
```bash
npm run server
```
The mock API will be accessible at:
- `http://localhost:5000/students`
- `http://localhost:5000/courses`
- `http://localhost:5000/enrollments`

### 2. Start the Vite Frontend Server
In a second terminal window, run the Vite development server:
```bash
npm run dev
```
Open your browser and visit:
```
http://localhost:5173
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Launches the Vite development server with HMR. |
| `npm run server` | Launches `json-server` on port `5000` watching `db.json`. |
| `npm run build` | Builds optimized production bundles with code splitting. |
| `npm run preview` | Previews the production build locally. |
