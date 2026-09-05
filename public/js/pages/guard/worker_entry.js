import { api } from '../../api.js';

const state = {
    employees: [],
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
    wAadhaar: document.getElementById('w-aadhaar'),
    wStatusBadge: document.getElementById('w-status-badge'),
    btnCancel: document.getElementById('btn-cancel-worker'),
    btnConfirm: document.getElementById('btn-confirm-checkin'),
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
        renderQuickChips();
    } catch (err) {
        console.error('Failed to load employees:', err);
        showToast('Failed to load rostered personnel.', 'error');
    }
}

function renderQuickChips() {
    if (!elements.chipsContainer) return;

    if (state.employees.length === 0) {
        elements.chipsContainer.innerHTML = '<span style="font-size: var(--text-xs); color: var(--color-on-surface-muted);">No employees found.</span>';
        return;
    }

    elements.chipsContainer.innerHTML = state.employees.slice(0, 12).map(emp => {
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
            const found = state.employees.find(e => String(e.id) === String(id));
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
    const aadhaar = emp.aadhaar || 'XXXX-XXXX-XXXX';
    const status = (emp.status || 'present').toLowerCase();

    if (elements.wAvatar) elements.wAvatar.textContent = avatar;
    if (elements.wName) elements.wName.textContent = name;
    if (elements.wRole) elements.wRole.textContent = role;
    if (elements.wDepartment) elements.wDepartment.textContent = dept;
    if (elements.wBadge) elements.wBadge.textContent = badge;
    if (elements.wLocation) elements.wLocation.textContent = location;
    if (elements.wShift) elements.wShift.textContent = shift;
    if (elements.wAadhaar) elements.wAadhaar.textContent = aadhaar;

    if (elements.wStatusBadge) {
        elements.wStatusBadge.innerHTML = `<span class="status-tag ${status}">${status}</span>`;
    }

    if (elements.previewCard) {
        elements.previewCard.style.display = 'flex';
        elements.previewCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

async function handleCheckIn() {
    if (!state.selectedWorker || state.isSubmitting) return;

    try {
        state.isSubmitting = true;
        if (elements.btnConfirm) {
            elements.btnConfirm.disabled = true;
            elements.btnConfirm.innerHTML = `
                <span class="material-symbols-outlined spin" style="font-size: 18px;">progress_activity</span>
                <span>Logging Turnstile Check-In...</span>
            `;
        }

        const worker = state.selectedWorker;
        await api.updateAttendance(worker.id, 'present');

        showToast(`Worker ${worker.name} (${worker.badgeNo || worker.id}) verified & checked in at Gate 01.`, 'success');

        // Update local worker object
        worker.status = 'present';
        selectWorker(null);
        if (elements.scanInput) elements.scanInput.value = '';

        // Refresh list
        loadEmployees();

    } catch (err) {
        console.error('Worker checkin failed:', err);
        showToast(`Check-in failed: ${err.message || 'Server error'}`, 'error');
    } finally {
        state.isSubmitting = false;
        if (elements.btnConfirm) {
            elements.btnConfirm.disabled = false;
            elements.btnConfirm.innerHTML = `
                <span class="material-symbols-outlined" style="font-size: 18px;">how_to_reg</span>
                <span>Confirm Check-In & Grant Access</span>
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

        const found = state.employees.find(emp => {
            const id = (emp.id || '').toLowerCase();
            const badge = (emp.badgeNo || emp.badge_no || '').toLowerCase();
            const name = (emp.name || '').toLowerCase();
            return id === query || badge === query || name.includes(query);
        });

        if (found) {
            selectWorker(found);
        } else {
            showToast(`No enrolled worker matching "${elements.scanInput.value}" found.`, 'warning');
        }
    });

    elements.btnCancel?.addEventListener('click', () => {
        selectWorker(null);
        if (elements.scanInput) elements.scanInput.value = '';
    });

    elements.btnConfirm?.addEventListener('click', handleCheckIn);
});