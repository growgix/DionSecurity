import { api } from '../../api.js';

let employeesData = [];

function showToast(message, type = 'success') {
    const toast = document.getElementById('create-task-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `create-task-toast ${type}`;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 4000);
}

async function loadEmployees() {
    const select = document.getElementById('task-assigned-to');
    try {
        const res = await api.getEmployees();
        employeesData = Array.isArray(res) ? res : (res.data || []);

        if (employeesData.length === 0) {
            select.innerHTML = '<option value="">No personnel available</option>';
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const preselected = params.get('worker');

        select.innerHTML = employeesData.map(emp => {
            const isSelected = (preselected && String(emp.id) === String(preselected)) ? 'selected' : '';
            return `<option value="${emp.id}" ${isSelected}>
                ${escapeHtml(emp.name)} — ${escapeHtml(emp.role || 'Staff')} (${escapeHtml(emp.department || 'Security')})
            </option>`;
        }).join('');
    } catch (err) {
        select.innerHTML = `<option value="">Error loading personnel: ${escapeHtml(err.message)}</option>`;
    }
}

async function handleSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('task-title').value.trim();
    const category = document.getElementById('task-category').value;
    const priority = document.getElementById('task-priority').value;
    const assignedToId = document.getElementById('task-assigned-to').value;
    const location = document.getElementById('task-location').value.trim();
    const dueDate = document.getElementById('task-due-date').value.trim();
    const description = document.getElementById('task-description').value.trim();

    if (!title) {
        showToast('Task title is required.', 'error');
        return;
    }

    const submitBtn = document.getElementById('btn-submit-task');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Dispatching...';

    try {
        await api.createTask({
            title,
            category,
            priority,
            assignedToId,
            location,
            dueDate: dueDate || 'Today, 05:00 PM',
            description: description || 'Work order dispatched by field supervisor.'
        });

        showToast('Task successfully created and dispatched!', 'success');
        setTimeout(() => {
            window.location.href = '/pages/supervisor/task_board.php';
        }, 1200);
    } catch (err) {
        showToast(err.message || 'Failed to dispatch task.', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <span class="material-symbols-outlined" style="font-size: 18px;">send</span>
            <span>Dispatch Work Order</span>
        `;
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
    loadEmployees();
    document.getElementById('create-task-form')?.addEventListener('submit', handleSubmit);
});