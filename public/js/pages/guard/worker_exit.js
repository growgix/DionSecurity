import { api } from '../../api.js';

const state = {
    employees: [],
    presentWorkers: [],
    selectedWorker: null,
    isSubmitting: false
};

const elements = {
    scanForm: document.getElementById('scanner-form'),
    scanInput: document.getElementById('scan-input'),
    btnScan: document.getElementById('btn-scan'),
    chipsContainer: document.getElementById('quick-roster-chips'),
    previewCard: document.getElementById('worker-preview-card'),
    wAvatar: document.getElementById('w-avatar'),
    wName: document.getElementById('w-name'),
    wRole: document.getElementById('w-role'),
    wDepartment: document.getElementById('w-department'),
    wBadge: document.getElementById('w-badge'),
    wLocation: document.getElementById('w-location'),
    wShift: document.getElementById('w-shift'),
    wInTime: document.getElementById('w-intime'),
    wStatusBadge: document.getElementById('w-status-badge'),
    btnCancel: document.getElementById('btn-cancel-worker'),
    btnConfirm: document.getElementById('btn-confirm-checkout'),
    toastContainer: document.getElementById('toast-container')
};

function showToast(message, type = 'info') {
    if (!elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="material-symbols-outlined" style="font-size: 18px;">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</span>
        <span class="toast-message">${escapeHtml(message)}</span>
        <button type="button" class="toast-close">&times;</button>
    `;
    toast.querySelector('.toast-close')?.addEventListener('click', () => toast.remove());
    elements.toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function loadEmployees() {
    try {
        const res = await api.getEmployees();
        state.employees = (res && res.data) ? res.data : [];
        state.presentWorkers = state.employees.filter(e => {
            const s = (e.status || '').toLowerCase();
            return s === 'present' || s === 'late';
        });
        renderQuickChips();
    } catch (err) {
        console.error('Failed to load employees for exit:', err);
        showToast('Failed to load on-duty personnel.', 'error');
    }
}

function renderQuickChips() {
    if (!elements.chipsContainer) return;

    if (state.presentWorkers.length === 0) {
        elements.chipsContainer.innerHTML = '<span style="font-size: var(--text-xs); color: var(--color-on-surface-muted);">No active on-duty personnel currently on site.</span>';
        return;
    }

    elements.chipsContainer.innerHTML = state.presentWorkers.slice(0, 12).map(emp => {
        const isSelected = state.selectedWorker?.id === emp.id;
        const badge = escapeHtml(emp.badgeNo || emp.badge_no || emp.id);
        const name = escapeHtml(emp.name || 'Worker');

        return `
            <button type="button" class="chip-btn ${isSelected ? 'selected' : ''}" data-id="${escapeHtml(emp.id)}">
                <span class="mono" style="font-weight: 700; margin-right: 4px;">${badge}</span>
                <span>${name}</span>
            </button>
        `;
    }).join('');

    elements.chipsContainer.querySelectorAll('.chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const found = state.presentWorkers.find(e => String(e.id) === String(id));
            if (found) {
                selectWorker(found);
                if (elements.scanInput) elements.scanInput.value = found.badgeNo || found.id;
            }
        });
    });
}

function selectWorker(emp) {
    state.selectedWorker = emp;
    renderQuickChips();

    if (!emp) {
        if (elements.previewCard) elements.previewCard.style.display = 'none';
        return;
    }

    const name = emp.name || 'Worker';
    const avatar = emp.avatar || name.substring(0, 2).toUpperCase();
    const role = emp.role || 'Staff';
    const dept = emp.department || 'Operations';
    const badge = emp.badgeNo || emp.badge_no || emp.id;
    const location = emp.assignedLocation || emp.assigned_location || 'General Estate';
    const shift = emp.shift || 'Morning (06:00 - 14:00)';
    const status = (emp.status || 'present').toLowerCase();
    const att = emp.todayAttendance || emp.today_attendance || {};
    const inTime = (typeof att === 'object' && att.inTime) ? att.inTime : '06:00 AM';

    if (elements.wAvatar) elements.wAvatar.textContent = avatar;
    if (elements.wName) elements.wName.textContent = name;
    if (elements.wRole) elements.wRole.textContent = role;
    if (elements.wDepartment) elements.wDepartment.textContent = dept;
    if (elements.wBadge) elements.wBadge.textContent = badge;
    if (elements.wLocation) elements.wLocation.textContent = location;
    if (elements.wShift) elements.wShift.textContent = shift;
    if (elements.wInTime) elements.wInTime.textContent = inTime;

    if (elements.wStatusBadge) {
        elements.wStatusBadge.innerHTML = `<span class="status-tag ${status}">${status}</span>`;
    }

    if (elements.previewCard) {
        elements.previewCard.style.display = 'flex';
        elements.previewCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

async function handleCheckOut() {
    if (!state.selectedWorker || state.isSubmitting) return;

    try {
        state.isSubmitting = true;
        if (elements.btnConfirm) {
            elements.btnConfirm.disabled = true;
            elements.btnConfirm.innerHTML = `
                <span class="material-symbols-outlined spin" style="font-size: 18px;">progress_activity</span>
                <span>Logging Shift Checkout...</span>
            `;
        }

        const worker = state.selectedWorker;
        await api.checkoutWorker(worker.id);

        showToast(`Worker ${worker.name} (${worker.badgeNo || worker.id}) shift departure logged at Gate 01.`, 'success');

        selectWorker(null);
        if (elements.scanInput) elements.scanInput.value = '';

        // Reload list
        loadEmployees();

    } catch (err) {
        console.error('Worker checkout failed:', err);
        showToast(`Checkout failed: ${err.message || 'Server error'}`, 'error');
    } finally {
        state.isSubmitting = false;
        if (elements.btnConfirm) {
            elements.btnConfirm.disabled = false;
            elements.btnConfirm.innerHTML = `
                <span class="material-symbols-outlined" style="font-size: 18px;">logout</span>
                <span>Confirm Shift Checkout</span>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadEmployees();

    elements.scanForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = (elements.scanInput?.value || '').trim().toLowerCase();
        if (!query) return;

        const found = state.presentWorkers.find(emp => {
            const id = (emp.id || '').toLowerCase();
            const badge = (emp.badgeNo || emp.badge_no || '').toLowerCase();
            const name = (emp.name || '').toLowerCase();
            return id === query || badge === query || name.includes(query);
        });

        if (found) {
            selectWorker(found);
        } else {
            showToast(`No on-duty worker matching "${elements.scanInput.value}" found.`, 'warning');
        }
    });

    elements.btnCancel?.addEventListener('click', () => {
        selectWorker(null);
        if (elements.scanInput) elements.scanInput.value = '';
    });

    elements.btnConfirm?.addEventListener('click', handleCheckOut);
});