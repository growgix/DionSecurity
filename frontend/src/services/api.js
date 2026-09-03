/**
 * Dion Ventures — API Service Library
 * Connects React frontend to PHP + PostgreSQL REST API Gateway
 */

const API_BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`[API Warning] Request to ${endpoint} failed:`, error.message);
    throw error;
  }
}

export const api = {
  // System Health
  getHealth: () => request('/health'),

  // Users & Auth
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
