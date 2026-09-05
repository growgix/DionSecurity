/**
 * Dion Ventures — API Service Library
 * Connects React frontend to PHP + PostgreSQL REST API Gateway
 */

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) 
  ? import.meta.env.VITE_API_BASE_URL 
  : '/api';

let unauthorizedHandler = null;
let csrfToken = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export function setCsrfToken(token) {
  csrfToken = token;
}

export function getCsrfToken() {
  return csrfToken;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const method = (options.method || 'GET').toUpperCase();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Attach CSRF token to state-changing operations
  if (csrfToken && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  try {
    const response = await fetch(url, {
      credentials: 'include',
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `HTTP Error ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.data = errorData;

      // Handle session expiration for authenticated routes (avoid loop on login/me)
      if (response.status === 401 && endpoint !== '/auth/me' && endpoint !== '/auth/login') {
        if (unauthorizedHandler) {
          unauthorizedHandler();
        }
      }

      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (!(endpoint === '/auth/me' && error.status === 401)) {
      console.warn(`[API Warning] Request to ${endpoint} failed:`, error.message);
    }
    throw error;
  }
}

export const api = {
  // System Health
  getHealth: () => request('/health'),

  // Auth & Session
  login: async (credentials) => {
    const res = await request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    if (res && res.csrfToken) {
      setCsrfToken(res.csrfToken);
    }
    return res;
  },
  logout: async () => {
    try {
      return await request('/auth/logout', { method: 'POST' });
    } finally {
      setCsrfToken(null);
    }
  },
  getMe: async () => {
    const res = await request('/auth/me');
    if (res && res.csrfToken) {
      setCsrfToken(res.csrfToken);
    }
    return res;
  },

  // Users & Governance
  getUsers: () => request('/auth/users'),
  createUser: (userData) => request('/auth/users', { method: 'POST', body: JSON.stringify(userData) }),

  // Blocks & Houses
  getBlocks: () => request('/blocks'),
  getBlockById: (id) => request(`/blocks/${id}`),
  updateBlock: (id, data) => request(`/blocks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  
  getHouses: () => request('/houses'),
  getHouseById: (id) => request(`/houses/${id}`),
  updateHouse: (id, data) => request(`/houses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Residents & Family
  getResidents: () => request('/residents'),
  createResident: (data) => request('/residents', { method: 'POST', body: JSON.stringify(data) }),
  getFamilyMembers: () => request('/family-members'),
  createFamilyMember: (data) => request('/family-members', { method: 'POST', body: JSON.stringify(data) }),

  // Employees (80 Staff)
  getEmployees: () => request('/employees'),
  getEmployeeById: (id) => request(`/employees/${id}`),
  enrolEmployee: (data) => request('/employees', { method: 'POST', body: JSON.stringify(data) }),
  updateAttendance: (id, status) => request(`/employees/${id}/attendance`, { method: 'PUT', body: JSON.stringify({ status }) }),
  checkoutWorker: (id) => request(`/employees/${id}/checkout`, { method: 'POST' }),

  // Visitors & Gate Logs
  getVisitors: () => request('/visitors'),
  registerVisitor: (data) => request('/visitors', { method: 'POST', body: JSON.stringify(data) }),
  checkoutVisitor: (id) => request(`/visitors/${id}/checkout`, { method: 'PUT' }),

  getGateLogs: () => request('/gate-logs'),
  createGateLog: (data) => request('/gate-logs', { method: 'POST', body: JSON.stringify(data) }),

  // Tasks & Work Orders
  getTasks: () => request('/tasks'),
  getTaskById: (id) => request(`/tasks/${id}`),
  createTask: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTaskStatus: (id, status) => request(`/tasks/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  addTaskRemark: (id, data) => request(`/tasks/${id}/remarks`, { method: 'POST', body: JSON.stringify(data) }),

  // Payments & Wages
  getPayments: () => request('/payments'),
  createPayment: (data) => request('/payments', { method: 'POST', body: JSON.stringify(data) }),

  // Audit Logs
  getAuditLogs: () => request('/audit-logs'),
  recordAudit: (data) => request('/audit-logs', { method: 'POST', body: JSON.stringify(data) }),

  // Settings
  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // Emergency Panic
  triggerPanic: (data) => request('/panic', { method: 'POST', body: JSON.stringify(data) })
};
