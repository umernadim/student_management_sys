import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with normalized error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected network error occurred',
      status: error.response?.status,
      isNetworkError: !error.response,
    };
    return Promise.reject(customError);
  }
);

export const studentsApi = {
  getAll: (params = {}) => apiClient.get('/students', { params }),
  getById: (id) => apiClient.get(`/students/${id}`),
  create: (studentData) => apiClient.post('/students', studentData),
  update: (id, studentData) => apiClient.put(`/students/${id}`, studentData),
  patch: (id, partialData) => apiClient.patch(`/students/${id}`, partialData),
  delete: (id) => apiClient.delete(`/students/${id}`),
};

export const coursesApi = {
  getAll: (params = {}) => apiClient.get('/courses', { params }),
  getById: (id) => apiClient.get(`/courses/${id}`),
  create: (courseData) => apiClient.post('/courses', courseData),
  update: (id, courseData) => apiClient.put(`/courses/${id}`, courseData),
  delete: (id) => apiClient.delete(`/courses/${id}`),
};

export const enrollmentsApi = {
  getAll: (params = {}) => apiClient.get('/enrollments', { params }),
  getById: (id) => apiClient.get(`/enrollments/${id}`),
  create: (enrollmentData) => apiClient.post('/enrollments', enrollmentData),
  update: (id, enrollmentData) => apiClient.put(`/enrollments/${id}`, enrollmentData),
  delete: (id) => apiClient.delete(`/enrollments/${id}`),
};

export const checkServerHealth = async () => {
  try {
    await apiClient.get('/courses?_limit=1');
    return true;
  } catch {
    return false;
  }
};

export default apiClient;
