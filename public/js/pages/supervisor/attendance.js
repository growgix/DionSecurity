import { api } from '../../api.js';

let employeesData = [];
let updatingId = null;

function showToast(message, type = 'success') {
    const toast = document.getElementById('attendance-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `attendance-toast ${type}`;
    toast.style.display = 'flex';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 4000);
}

function computeKpis(list) {
    let total = list.length;
    let present = 0;
    let absent = 0;
    let onLeave = 0;
    let late = 0;

    list.forEach(emp => {
        const s = (emp.attendance_status || emp.status || '').toLowerCase();
        if (s === 'present') present++;
        else if (s === 'absent') absent++;
        else if (s === 'on_leave' || s === 'leave') onLeave++;
        else if (s === 'late') late++;
        else absent++;
    });

    document.getElementById('kpi-total').textContent = total;
    document.getElementById('kpi-present').textContent = present;
    document.getElementById('kpi-absent').textContent = absent;
    document.getElementById('kpi-leave').textContent = onLeave;
    document.getElementById('kpi-late').textContent = late;
}

function getInitials(name) {
    if (!name) return 'EMP';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

function formatStatusBadge(status) {
    const s = (status || 'absent').toLowerCase();
    let label = 'Absent';
    let cls = 'status-absent';

    if (s === 'present') {
        label = 'Present';
        cls = 'status-present';
    } else if (s === 'on_leave' || s === 'leave') {
        label = 'On Leave';
        cls = 'status-on_leave';
    } else if (s === 'late') {
        label = 'Late';
        cls = 'status-late';
    }

    return `<span class="status-pill ${cls}">${label}</span>`;
}

function renderTable(list) {
    const tbody = document.getElementById('attendance-tbody');
    const badge = document.getElementById('roster-count-badge');
    if (badge) badge.textContent = `${list.length} Personnel`;

    if (!list || list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="loading-cell">
                    <div class="loading-state">
                        <span class="material-symbols-outlined">person_off</span>
                        <span>No personnel match current filters.</span>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    const rows = list.map(emp => {
        const currentStatus = (emp.attendance_status || emp.status || 'absent').toLowerCase();
        const empId = emp.id;
        const initials = getInitials(emp.name);
        const shift = emp.shift || 'General (08:00 - 17:00)';
        const phone = emp.phone || emp.contact || 'N/A';
        const role = emp.role || emp.designation || 'Staff';
        const dept = emp.department || 'Security';

        return `
            <tr data-emp-id="${empId}">
                <td>
                    <div class="person-cell">
                        <div class="avatar-circle">${initials}</div>
                        <div>
                            <div class="person-name">${escapeHtml(emp.name)}</div>
                            <div class="person-id">ID: #${empId}</div>
                        </div>
                    </div>
                </td>
                <td><strong>${escapeHtml(role)}</strong></td>
                <td><span class="badge badge-outline">${escapeHtml(dept)}</span></td>
                <td>${escapeHtml(shift)}</td>
                <td>${escapeHtml(phone)}</td>
                <td>${formatStatusBadge(currentStatus)}</td>
                <td class="text-right">
                    <div class="quick-action-group">
                        <button type="button" class="btn-action-status ${currentStatus === 'present' ? 'is-current' : ''}" 
                            data-action="present" data-id="${empId}" title="Mark Present">
                            Present
                        </button>
                        <button type="button" class="btn-action-status ${currentStatus === 'absent' ? 'is-current' : ''}" 
                            data-action="absent" data-id="${empId}" title="Mark Absent">
                            Absent
                        </button>
                        <button type="button" class="btn-action-status ${currentStatus === 'on_leave' || currentStatus === 'leave' ? 'is-current' : ''}" 
                            data-action="leave" data-id="${empId}" title="Mark On Leave">
                            Leave
                        </button>
                        <button type="button" class="btn-action-status ${currentStatus === 'late' ? 'is-current' : ''}" 
                            data-action="late" data-id="${empId}" title="Mark Late">
                            Late
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = rows;
}

function applyFilters() {
    const searchVal = (document.getElementById('filter-search')?.value || '').toLowerCase().trim();
    const deptVal = document.getElementById('filter-department')?.value || 'all';
    const statusVal = document.getElementById('filter-status')?.value || 'all';

    const filtered = employeesData.filter(emp => {
        if (searchVal) {
            const name = (emp.name || '').toLowerCase();
            const id = String(emp.id);
            const role = (emp.role || emp.designation || '').toLowerCase();
            if (!name.includes(searchVal) && !id.includes(searchVal) && !role.includes(searchVal)) {
                return false;
            }
        }

        if (deptVal !== 'all') {
            const dept = (emp.department || '').toLowerCase();
            if (dept !== deptVal.toLowerCase()) {
                return false;
            }
        }

        if (statusVal !== 'all') {
            const s = (emp.attendance_status || emp.status || '').toLowerCase();
            if (statusVal === 'leave' || statusVal === 'on_leave') {
                if (s !== 'on_leave' && s !== 'leave') return false;
            } else if (s !== statusVal) {
                return false;
            }
        }

        return true;
    });

    renderTable(filtered);
}

async function handleStatusUpdate(empId, newStatus) {
    if (updatingId) return;
    updatingId = empId;

    try {
        await api.updateAttendance(empId, newStatus);
        
        const emp = employeesData.find(e => String(e.id) === String(empId));
        if (emp) {
            emp.attendance_status = newStatus;
            emp.status = newStatus;
        }

        computeKpis(employeesData);
        applyFilters();
        showToast(`Attendance for ${emp ? emp.name : 'Employee #' + empId} set to "${newStatus.toUpperCase()}".`, 'success');
    } catch (err) {
        showToast(err.message || 'Failed to update attendance status.', 'error');
    } finally {
        updatingId = null;
    }
}

async function loadRoster() {
    const tbody = document.getElementById('attendance-tbody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="loading-cell">
                    <div class="loading-state">
                        <span class="material-symbols-outlined spinner">progress_activity</span>
                        <span>Loading workforce roster...</span>
                    </div>
                </td>
            </tr>
        `;
    }

    try {
        const res = await api.getEmployees();
        employeesData = Array.isArray(res) ? res : (res.data || []);
        computeKpis(employeesData);
        applyFilters();
    } catch (err) {
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="loading-cell">
                        <div class="loading-state" style="color: var(--danger);">
                            <span class="material-symbols-outlined">error</span>
                            <span>Failed to load personnel roster: ${escapeHtml(err.message)}</span>
                        </div>
                    </td>
                </tr>
            `;
        }
    }
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
    loadRoster();

    document.getElementById('filter-search')?.addEventListener('input', applyFilters);
    document.getElementById('filter-department')?.addEventListener('change', applyFilters);
    document.getElementById('filter-status')?.addEventListener('change', applyFilters);
    document.getElementById('btn-refresh-attendance')?.addEventListener('click', loadRoster);

    document.getElementById('attendance-tbody')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-action-status');
        if (!btn) return;
        const empId = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        if (empId && action) {
            handleStatusUpdate(empId, action);
        }
    });
});