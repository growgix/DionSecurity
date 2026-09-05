/**
 * Dion Security Core API Client
 * Parity replacement for frontend/src/services/api.js in Vanilla JS.
 * Handles automatic credentials, CSRF token header attachment, JSON parsing,
 * and unified error dispatching.
 */

const API_BASE_URL = '/api';

function getCsrfToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : '';
}

async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Accept': 'application/json',
        ...(options.headers || {})
    };

    // Auto-inject CSRF token for mutating requests
    const method = (options.method || 'GET').toUpperCase();
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
        const token = getCsrfToken();
        if (token) {
            headers['X-CSRF-Token'] = token;
        }
    }

    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(options.body);
    }

    const config = {
        ...options,
        headers,
        credentials: 'include' // Sends PHPSESSID cookie
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json().catch(() => null);

        if (!response.ok) {
            // Check for unauthenticated 401
            if (response.status === 401 && !window.location.pathname.includes('/pages/login.php')) {
                window.location.href = '/pages/login.php';
            }
            const error = new Error((data && data.message) || `HTTP error ${response.status}`);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (err) {
        console.error(`[API Error] ${method} ${endpoint}:`, err);
        throw err;
    }
}

export const api = {
    // Health & System
    getHealth: () => request('/health'),

    // Authentication Endpoints
    login: (emailOrCredentials, password) => {
        const body = typeof emailOrCredentials === 'object'
            ? { email: emailOrCredentials.email || emailOrCredentials.username, password: emailOrCredentials.password }
            : { email: emailOrCredentials, password: password };
        return request('/auth/login', {
            method: 'POST',
            body
        });
    },
    logout: () => request('/auth/logout', {
        method: 'POST'
    }),
    getCurrentUser: () => request('/auth/me'),

    // User Management
    getUsers: () => request('/users'),
    createUser: (userData) => request('/users', { method: 'POST', body: userData }),
    updateUser: (id, userData) => request(`/users?id=${id}`, { method: 'PUT', body: userData }),
    deleteUser: (id) => request(`/users?id=${id}`, { method: 'DELETE' }),

    // Estate Management
    getBlocks: () => request('/blocks'),
    getBlockById: (id) => request(`/blocks/${id}`),
    updateBlock: (id, data) => request(`/blocks/${id}`, { method: 'PUT', body: data }),
    createBlock: (data) => request('/blocks', { method: 'POST', body: data }),
    getHouses: () => request('/houses'),
    getHouseById: (id) => request(`/houses/${id}`),
    updateHouse: (id, data) => request(`/houses/${id}`, { method: 'PUT', body: data }),
    createHouse: (data) => request('/houses', { method: 'POST', body: data }),
    getResidents: () => request('/residents'),
    createResident: (data) => request('/residents', { method: 'POST', body: data }),
    getFamilies: () => request('/family-members'),
    getFamilyMembers: () => request('/family-members'),
    createFamily: (data) => request('/family-members', { method: 'POST', body: data }),

    // Security Workforce
    getEmployees: () => request('/employees'),
    getEmployeeById: (id) => request(`/employees/${id}`),
    createEmployee: (data) => request('/employees', { method: 'POST', body: data }),
    updateAttendance: (id, status) => request(`/employees/${id}/attendance`, { method: 'PUT', body: { status } }),
    checkoutWorker: (id) => request(`/employees/${id}/checkout`, { method: 'POST' }),
    getTasks: () => request('/tasks'),
    getTaskById: (id) => request(`/tasks/${id}`),
    createTask: (data) => request('/tasks', { method: 'POST', body: data }),
    updateTaskStatus: (id, status) => request(`/tasks/${id}/status`, { method: 'PUT', body: { status } }),
    addTaskRemark: (id, data) => request(`/tasks/${id}/remarks`, { method: 'POST', body: data }),

    // Access & Operations
    getVisitors: () => request('/visitors'),
    createVisitor: (data) => request('/visitors', { method: 'POST', body: data }),
    checkoutVisitor: (id) => request(`/visitors/${id}/checkout`, { method: 'PUT' }),
    getGateLogs: () => request('/gate-logs'),
    createGateLog: (data) => request('/gate-logs', { method: 'POST', body: data }),
    triggerPanic: (data = { location: 'Gate 01', reason: 'Guard Emergency Panic Trigger' }) => {
        const body = typeof data === 'string' ? { location: data, reason: 'Guard Emergency Panic Trigger' } : (data || { location: 'Gate 01' });
        return request('/panic', { method: 'POST', body });
    },

    // Finance & Auditing
    getPayments: () => request('/payments'),
    createPayment: (data) => request('/payments', { method: 'POST', body: data }),
    getAuditLogs: () => request('/audit-logs'),
    recordAudit: (action, details) => request('/audit-logs', { method: 'POST', body: { action, details } }),
    getSettings: () => request('/settings'),
    updateSettings: (data) => request('/settings', { method: 'PUT', body: data })
};

// Export individual methods for named import flexibility
export const {
    getHealth,
    login,
    logout,
    getCurrentUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getBlocks,
    getBlockById,
    updateBlock,
    createBlock,
    getHouses,
    getHouseById,
    updateHouse,
    createHouse,
    getResidents,
    createResident,
    updateResident,
    deleteResident,
    getFamilies,
    getFamilyMembers,
    createFamily,
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    updateAttendance,
    checkoutWorker,
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    updateTaskStatus,
    addTaskRemark,
    getVisitors,
    createVisitor,
    checkoutVisitor,
    getGateLogs,
    createGateLog,
    triggerPanic,
    getPayments,
    createPayment,
    getAuditLogs,
    recordAudit,
    getSettings,
    updateSettings
} = api;

window.api = api;
export default api;