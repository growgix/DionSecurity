import { api } from '../../api.js';

let tasksData = [];
let updatingTaskId = null;

function showToast(message, type = 'success') {
    const toast = document.getElementById('task-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `task-toast ${type}`;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 4000);
}

function updateKpis(tasks) {
    const total = tasks.length;
    let created = 0, assigned = 0, progress = 0, completed = 0, verified = 0;

    tasks.forEach(t => {
        const s = (t.status || '').toLowerCase();
        if (s === 'created') created++;
        else if (s === 'assigned') assigned++;
        else if (s === 'in_progress') progress++;
        else if (s === 'completed') completed++;
        else if (s === 'verified') verified++;
    });

    document.getElementById('count-total-tasks').textContent = total;
    document.getElementById('count-created-tasks').textContent = created;
    document.getElementById('count-assigned-tasks').textContent = assigned;
    document.getElementById('count-progress-tasks').textContent = progress;
    document.getElementById('count-completed-tasks').textContent = completed;
    document.getElementById('count-verified-tasks').textContent = verified;

    document.getElementById('badge-created').textContent = created;
    document.getElementById('badge-assigned').textContent = assigned;
    document.getElementById('badge-in_progress').textContent = progress;
    document.getElementById('badge-completed').textContent = completed;
    document.getElementById('badge-verified').textContent = verified;
}

function renderKanban(tasks) {
    const columns = {
        created: document.getElementById('col-tasks-created'),
        assigned: document.getElementById('col-tasks-assigned'),
        in_progress: document.getElementById('col-tasks-in_progress'),
        completed: document.getElementById('col-tasks-completed'),
        verified: document.getElementById('col-tasks-verified')
    };

    Object.keys(columns).forEach(colKey => {
        if (columns[colKey]) {
            columns[colKey].innerHTML = '';
        }
    });

    const counts = { created: 0, assigned: 0, in_progress: 0, completed: 0, verified: 0 };

    tasks.forEach(task => {
        const status = (task.status || 'created').toLowerCase();
        const targetCol = columns[status];
        if (!targetCol) return;

        counts[status] = (counts[status] || 0) + 1;

        const priority = (task.priority || 'medium').toLowerCase();
        const remarksCount = (task.remarks && Array.isArray(task.remarks)) ? task.remarks.length : 0;
        const assignee = task.assignedToName || 'Unassigned';
        const location = task.location || 'Site Perimeter';
        const dueDate = task.dueDate || 'Standard';

        let actionBtnHtml = '';
        if (status === 'created') {
            actionBtnHtml = `<button type="button" class="btn-kanban-action" data-task-id="${task.id}" data-target-status="assigned" title="Dispatch to worker">Assign →</button>`;
        } else if (status === 'assigned') {
            actionBtnHtml = `<button type="button" class="btn-kanban-action" data-task-id="${task.id}" data-target-status="in_progress" title="Start field work">Start →</button>`;
        } else if (status === 'in_progress') {
            actionBtnHtml = `<button type="button" class="btn-kanban-action" data-task-id="${task.id}" data-target-status="completed" title="Mark finished">Done ✓</button>`;
        } else if (status === 'completed') {
            actionBtnHtml = `<button type="button" class="btn-kanban-action" data-task-id="${task.id}" data-target-status="verified" title="Supervisor sign-off">Verify ★</button>`;
        } else if (status === 'verified') {
            actionBtnHtml = `<span class="badge badge-success" style="font-size:10px;">Closed</span>`;
        }

        const card = document.createElement('div');
        card.className = 'task-card';
        card.innerHTML = `
            <div class="task-card-top">
                <span class="task-id-badge">${escapeHtml(task.id)}</span>
                <span class="priority-badge priority-${priority}">${escapeHtml(priority)}</span>
            </div>
            <h4 class="task-card-title">${escapeHtml(task.title)}</h4>
            <div class="task-card-meta">
                <div class="task-meta-row">
                    <span class="material-symbols-outlined task-meta-icon">person</span>
                    <strong>${escapeHtml(assignee)}</strong>
                </div>
                <div class="task-meta-row">
                    <span class="material-symbols-outlined task-meta-icon">location_on</span>
                    <span>${escapeHtml(location)}</span>
                </div>
            </div>
            <div class="task-card-footer">
                <span class="task-due-date">${escapeHtml(dueDate)}</span>
                <div class="task-actions-group">
                    <a href="/pages/supervisor/task_remarks.php?taskId=${encodeURIComponent(task.id)}" class="btn-remarks-link" title="View or Add Remarks">
                        <span class="material-symbols-outlined" style="font-size:14px;">chat</span>
                        <span>${remarksCount}</span>
                    </a>
                    ${actionBtnHtml}
                </div>
            </div>
        `;

        targetCol.appendChild(card);
    });

    Object.keys(columns).forEach(colKey => {
        if (counts[colKey] === 0 && columns[colKey]) {
            columns[colKey].innerHTML = `<div class="empty-col-state">No tasks in ${colKey.replace('_', ' ')}</div>`;
        }
    });

    updateKpis(tasks);
}

async function handleTransition(taskId, targetStatus) {
    if (updatingTaskId) return;
    updatingTaskId = taskId;

    try {
        await api.updateTaskStatus(taskId, targetStatus);
        
        const task = tasksData.find(t => String(t.id) === String(taskId));
        if (task) {
            task.status = targetStatus;
        }

        renderKanban(tasksData);
        showToast(`Task ${taskId} moved to "${targetStatus.replace('_', ' ').toUpperCase()}".`, 'success');
    } catch (err) {
        showToast(err.message || 'Failed to update task status.', 'error');
    } finally {
        updatingTaskId = null;
    }
}

async function loadTasks() {
    try {
        const res = await api.getTasks();
        tasksData = Array.isArray(res) ? res : (res.data || []);
        renderKanban(tasksData);
    } catch (err) {
        showToast(`Failed to load tasks: ${err.message}`, 'error');
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
    loadTasks();

    document.getElementById('btn-refresh-tasks')?.addEventListener('click', loadTasks);

    document.querySelector('.kanban-grid')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-kanban-action');
        if (!btn) return;
        const taskId = btn.getAttribute('data-task-id');
        const targetStatus = btn.getAttribute('data-target-status');
        if (taskId && targetStatus) {
            handleTransition(taskId, targetStatus);
        }
    });
});