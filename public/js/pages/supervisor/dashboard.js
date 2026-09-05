/**
 * Dion Security — Supervisor Command Center Controller
 * Asynchronously loads real-time workforce muster, tasks, and attendance from MySQL REST APIs.
 */

import { api } from '../../api.js';
import { Toast } from '../../components/toast.js';
import { Modal } from '../../components/modal.js';

// Local Component State
let allEmployees = [];
let allTasks = [];
let searchFilter = '';
let deptFilter = 'all';
let assignTaskModal = null;

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initAssignTaskModal();
    initRemarkForm();
    loadDashboard();
});

function initFilters() {
    const searchInput = document.getElementById('worker-search-input');
    const deptSelect = document.getElementById('dept-select');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchFilter = e.target.value.toLowerCase().trim();
            renderMusterTable();
        });
    }

    if (deptSelect) {
        deptSelect.addEventListener('change', (e) => {
            deptFilter = e.target.value;
            renderMusterTable();
        });
    }
}

function initAssignTaskModal() {
    const modalEl = document.getElementById('assign-task-modal');
    if (modalEl) {
        assignTaskModal = new Modal(modalEl);
    }

    const openBtn = document.getElementById('open-task-modal-btn');
    if (openBtn && assignTaskModal) {
        openBtn.addEventListener('click', () => {
            populateAssigneeDropdown();
            assignTaskModal.open();
        });
    }

    const form = document.getElementById('assign-task-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const titleInput = document.getElementById('task-title');
            const descInput = document.getElementById('task-description');
            const prioritySelect = document.getElementById('task-priority');
            const assigneeSelect = document.getElementById('task-assignee');
            const locationInput = document.getElementById('task-location');
            const submitBtn = document.getElementById('task-submit-btn');

            const title = titleInput ? titleInput.value.trim() : '';
            const description = descInput ? descInput.value.trim() : '';
            const priority = prioritySelect ? prioritySelect.value : 'medium';
            const assigneeId = assigneeSelect ? assigneeSelect.value : '';
            const location = locationInput ? locationInput.value.trim() : 'General Premises';

            if (!title) return;

            const selectedEmp = allEmployees.find(emp => emp.id === assigneeId);
            const assigneeName = selectedEmp ? selectedEmp.name : 'Unassigned';
            const assigneeRole = selectedEmp ? selectedEmp.role : 'Guard';

            if (submitBtn) submitBtn.disabled = true;

            try {
                const response = await api.createTask({
                    title,
                    description,
                    priority,
                    category: 'Operations & Security',
                    assignedToId: assigneeId,
                    assignedToName: assigneeName,
                    assignedRole: assigneeRole,
                    location,
                    dueDate: 'Today'
                });

                if (response && response.success) {
                    Toast.success(`Task "${title}" created and assigned to ${assigneeName}!`);
                    if (titleInput) titleInput.value = '';
                    if (descInput) descInput.value = '';
                    if (assignTaskModal) assignTaskModal.close();
                    
                    // Refresh task list
                    await loadTasks();
                } else {
                    Toast.error(response?.message || 'Failed to create task.');
                }
            } catch (err) {
                console.error('[Create Task Error]', err);
                Toast.error('An error occurred while dispatching the task.');
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }
}

function populateAssigneeDropdown() {
    const assigneeSelect = document.getElementById('task-assignee');
    if (!assigneeSelect) return;

    assigneeSelect.innerHTML = allEmployees.map(emp => {
        return `<option value="${escapeHtml(emp.id)}">${escapeHtml(emp.name)} (${escapeHtml(emp.role)} - ${escapeHtml(emp.assignedLocation)})</option>`;
    }).join('');
}

function initRemarkForm() {
    const form = document.getElementById('supervisor-remark-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const textarea = document.getElementById('supervisor-remark-text');
            const submitBtn = document.getElementById('remark-submit-btn');
            const text = textarea ? textarea.value.trim() : '';

            if (!text) return;

            if (submitBtn) submitBtn.disabled = true;

            try {
                // If tasks exist, attach remark to first active task, and log audit event
                if (allTasks.length > 0) {
                    await api.addTaskRemark(allTasks[0].id, {
                        author: 'Shift Supervisor',
                        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                        text
                    });
                }

                // Log audit event for shift observation
                await fetch('/api/audit-logs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        action: 'SUPERVISOR_REMARK',
                        details: `Supervisor observation: "${text}"`
                    })
                });

                Toast.success('Supervisor operational remark recorded.');
                if (textarea) textarea.value = '';
            } catch (err) {
                console.error('[Remark Error]', err);
                Toast.error('Failed to record field remark.');
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }
}

/**
 * Orchestrates parallel async fetching of workforce and task datasets
 */
async function loadDashboard() {
    try {
        const [empRes, taskRes] = await Promise.allSettled([
            api.getEmployees(),
            api.getTasks()
        ]);

        allEmployees = empRes.status === 'fulfilled' && empRes.value?.data ? empRes.value.data : [];
        allTasks = taskRes.status === 'fulfilled' && taskRes.value?.data ? taskRes.value.data : [];

        calculateAndRenderMetrics();
        renderMusterTable();
        renderLiveTaskQueue();
    } catch (err) {
        console.error('[Supervisor Dashboard Error]', err);
        renderError('Unable to load supervisor operational telemetry. Please refresh.');
    }
}

async function loadTasks() {
    try {
        const res = await api.getTasks();
        if (res && res.data) {
            allTasks = res.data;
            calculateAndRenderMetrics();
            renderLiveTaskQueue();
        }
    } catch (err) {
        console.error('[Reload Tasks Error]', err);
    }
}

/**
 * Computes and populates the 6-card KPI Ribbon
 */
function calculateAndRenderMetrics() {
    const totalWorkers = allEmployees.length;
    const presentWorkers = allEmployees.filter(e => e.status === 'present').length;
    const absentWorkers = allEmployees.filter(e => e.status === 'absent').length;
    const leaveWorkers = allEmployees.filter(e => e.status === 'leave').length;
    const lateWorkers = allEmployees.filter(e => e.status === 'late').length;
    const activeTasks = allTasks.filter(t => t.status !== 'verified').length;
    const urgentTasks = allTasks.filter(t => t.priority === 'urgent').length;

    const presentRate = totalWorkers > 0 ? Math.round((presentWorkers / totalWorkers) * 100) : 0;

    setText('kpi-total-roster', totalWorkers);
    setText('kpi-present-count', presentWorkers);
    setText('kpi-present-total', `/ ${totalWorkers}`);
    setText('kpi-present-rate', `${presentRate}% Rate`);

    setText('kpi-absent-count', absentWorkers);
    setText('kpi-leave-count', leaveWorkers);
    setText('kpi-late-count', lateWorkers);

    setText('kpi-active-tasks', activeTasks);
    setText('kpi-urgent-tasks', `${urgentTasks} High Priority`);
}

/**
 * Renders the Duty Muster Table with 1-click status updater buttons
 */
function renderMusterTable() {
    const tbody = document.getElementById('muster-tbody');
    const footerCount = document.getElementById('muster-footer-count');
    if (!tbody) return;

    const filtered = allEmployees.filter(emp => {
        const name = (emp.name || '').toLowerCase();
        const badge = (emp.badgeNo || '').toLowerCase();
        const role = (emp.role || '').toLowerCase();
        const matchesQuery = !searchFilter || name.includes(searchFilter) || badge.includes(searchFilter) || role.includes(searchFilter);
        const matchesDept = deptFilter === 'all' || emp.department === deptFilter;
        return matchesQuery && matchesDept;
    });

    if (footerCount) {
        footerCount.textContent = `Showing ${Math.min(10, filtered.length)} of ${allEmployees.length} rostered workers`;
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="state-box">
                        <span class="material-symbols-outlined">person_off</span>
                        <span>No workers match the specified search query</span>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    const displayed = filtered.slice(0, 10);
    tbody.innerHTML = displayed.map(emp => {
        const avatar = emp.avatar || (emp.name ? emp.name.substring(0, 2).toUpperCase() : 'EM');
        const badgeNo = emp.badgeNo || emp.id;
        const checkIn = (emp.todayAttendance && emp.todayAttendance.inTime) ? emp.todayAttendance.inTime : '—';
        const currentStatus = (emp.status || 'present').toLowerCase();

        return `
            <tr data-emp-id="${escapeHtml(emp.id)}">
                <td>
                    <div class="worker-cell">
                        <div class="worker-avatar">${escapeHtml(avatar)}</div>
                        <div class="worker-meta">
                            <span class="worker-name">${escapeHtml(emp.name)}</span>
                            <span class="worker-badge-code">${escapeHtml(badgeNo)}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <p class="font-medium text-sm text-on-surface">${escapeHtml(emp.role || 'Personnel')}</p>
                    <p class="text-xs text-muted">${escapeHtml(emp.department || 'Operations')}</p>
                </td>
                <td class="text-xs text-muted">
                    ${escapeHtml(emp.assignedLocation || 'General Station')}
                </td>
                <td class="font-mono text-xs text-muted">
                    ${escapeHtml(checkIn)}
                </td>
                <td>
                    ${renderStatusBadge(currentStatus)}
                </td>
                <td class="muster-actions-cell">
                    <div class="muster-btn-group">
                        <button type="button" class="muster-btn ${currentStatus === 'present' ? 'active-p' : ''}" 
                            data-action="status" data-id="${escapeHtml(emp.id)}" data-status="present" title="Mark Present">P</button>
                        <button type="button" class="muster-btn ${currentStatus === 'late' ? 'active-l' : ''}" 
                            data-action="status" data-id="${escapeHtml(emp.id)}" data-status="late" title="Mark Late">L</button>
                        <button type="button" class="muster-btn ${currentStatus === 'absent' ? 'active-a' : ''}" 
                            data-action="status" data-id="${escapeHtml(emp.id)}" data-status="absent" title="Mark Absent">A</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // Attach click listener for 1-click status update buttons
    tbody.querySelectorAll('button[data-action="status"]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-id');
            const newStatus = btn.getAttribute('data-status');
            await handleUpdateAttendance(id, newStatus);
        });
    });
}

/**
 * Handles 1-click attendance status toggle via REST API
 */
async function handleUpdateAttendance(workerId, newStatus) {
    try {
        const response = await api.updateAttendance(workerId, newStatus);
        if (response && response.success) {
            // Update local state item
            const emp = allEmployees.find(e => e.id === workerId);
            if (emp) {
                emp.status = newStatus;
                if (!emp.todayAttendance) emp.todayAttendance = {};
                emp.todayAttendance.status = newStatus;
                if (newStatus === 'absent' || newStatus === 'leave') {
                    emp.todayAttendance.inTime = '—';
                } else if (!emp.todayAttendance.inTime || emp.todayAttendance.inTime === '—') {
                    emp.todayAttendance.inTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                }
            }

            calculateAndRenderMetrics();
            renderMusterTable();
            Toast.success(`Worker status updated to ${newStatus.toUpperCase()}`);
        } else {
            Toast.error(response?.message || 'Failed to update attendance status.');
        }
    } catch (err) {
        console.error('[Update Attendance Error]', err);
        Toast.error('An error occurred while updating attendance.');
    }
}

/**
 * Renders the Live Task Queue in the left column
 */
function renderLiveTaskQueue() {
    const container = document.getElementById('task-queue-container');
    if (!container) return;

    if (!allTasks || allTasks.length === 0) {
        container.innerHTML = `
            <div class="state-box">
                <span class="material-symbols-outlined">assignment_turned_in</span>
                <span>No pending operational tasks</span>
            </div>
        `;
        return;
    }

    const tasksToDisplay = allTasks.slice(0, 4);
    container.innerHTML = tasksToDisplay.map(task => {
        const priority = (task.priority || 'medium').toLowerCase();
        const status = (task.status || 'created').toLowerCase();

        return `
            <div class="task-item-card">
                <div class="task-item-left">
                    <div class="task-title-row">
                        <span class="task-id-badge">${escapeHtml(task.id)}</span>
                        <span class="text-muted">•</span>
                        <span class="task-title">${escapeHtml(task.title)}</span>
                    </div>
                    <p class="task-meta">
                        Assigned to: <strong class="text-on-surface">${escapeHtml(task.assignedToName || 'Staff')}</strong> • ${escapeHtml(task.location || 'Premises')}
                    </p>
                </div>

                <div class="task-badges-row">
                    ${renderStatusBadge(priority, priority)}
                    ${renderStatusBadge(status)}
                </div>
            </div>
        `;
    }).join('');
}

function renderStatusBadge(status, customText = null) {
    const s = (status || '').toLowerCase().replace(/[\s-]/g, '_');
    let badgeClass = 'badge-info';
    let dotColor = '#006699';

    if (['cleared', 'present', 'inside', 'verified', 'paid', 'active', 'occupied'].includes(s)) {
        badgeClass = 'badge-success';
        dotColor = '#16a34a';
    } else if (['absent', 'urgent', 'emergency', 'overdue', 'critical'].includes(s)) {
        badgeClass = 'badge-danger';
        dotColor = '#dc2626';
    } else if (['assigned', 'pending', 'in_progress', 'late', 'leave', 'on_leave', 'awaiting'].includes(s)) {
        badgeClass = 'badge-warning';
        dotColor = '#f59e0b';
    }

    const displayText = customText ? capitalize(customText) : capitalize(s);
    return `<span class="badge ${badgeClass}"><span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${dotColor};"></span>${escapeHtml(displayText)}</span>`;
}

function setText(elementId, text) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = text;
}

function renderError(message) {
    const errorBox = document.getElementById('dashboard-error-banner');
    if (errorBox) {
        errorBox.textContent = message;
        errorBox.style.display = 'block';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

function capitalize(s) {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}