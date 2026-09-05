import { getTasks, createTask, updateTask, getEmployees } from '/public/js/api.js';

let tasks = [];
let employees = [];

async function loadData() {
    try {
        const [taskRes, empRes] = await Promise.all([
            getTasks(),
            getEmployees()
        ]);

        tasks = taskRes.data || [];
        employees = empRes.data || [];

        populateEmployeeDropdown();
        updateStats();
        renderTable();
    } catch (err) {
        console.error('Failed to load tasks:', err);
        document.getElementById('tasksTableBody').innerHTML = `
            <tr><td colspan="6" class="text-center py-4 text-danger">Failed to load tasks.</td></tr>
        `;
    }
}

function updateStats() {
    document.getElementById('statTotalTasks').textContent = tasks.length;
    const pending = tasks.filter(t => (t.status || '').toLowerCase() !== 'completed' && (t.status || '').toLowerCase() !== 'cancelled').length;
    document.getElementById('statPendingTasks').textContent = pending;
    const completed = tasks.filter(t => (t.status || '').toLowerCase() === 'completed').length;
    document.getElementById('statCompletedTasks').textContent = completed;
}

function populateEmployeeDropdown() {
    const select = document.getElementById('tAssigned');
    select.innerHTML = '<option value="">Select Officer...</option>';
    employees.forEach(emp => {
        const opt = document.createElement('option');
        opt.value = emp.id;
        opt.textContent = `${emp.name} (${emp.id} - ${emp.role || 'Guard'})`;
        select.appendChild(opt);
    });
}

function renderTable() {
    const search = document.getElementById('searchInput').value.toLowerCase().trim();
    const statusFilter = document.getElementById('statusFilter').value.toLowerCase();
    const priorityFilter = document.getElementById('priorityFilter').value.toLowerCase();

    const filtered = tasks.filter(t => {
        const title = (t.title || '').toLowerCase();
        const desc = (t.description || '').toLowerCase();
        const assignee = (t.assigned_to_name || t.assigned_to || '').toLowerCase();
        const st = (t.status || '').toLowerCase();
        const pr = (t.priority || '').toLowerCase();

        const matchesSearch = !search || title.includes(search) || desc.includes(search) || assignee.includes(search);
        const matchesStatus = !statusFilter || st === statusFilter;
        const matchesPriority = !priorityFilter || pr.includes(priorityFilter);

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const tbody = document.getElementById('tasksTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">No tasks found.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(t => {
        const st = (t.status || '').toLowerCase();
        let stBadge = 'bg-secondary-subtle text-secondary';
        if (st === 'completed') stBadge = 'bg-success-subtle text-success';
        else if (st === 'in_progress') stBadge = 'bg-info-subtle text-info';
        else if (st === 'pending') stBadge = 'bg-warning-subtle text-warning';

        const pr = (t.priority || '').toLowerCase();
        let prBadge = 'bg-light text-dark';
        if (pr === 'high' || pr === 'urgent') prBadge = 'bg-danger-subtle text-danger';
        else if (pr === 'medium') prBadge = 'bg-primary-subtle text-primary';

        return `
            <tr>
                <td>
                    <strong>${escapeHtml(t.title || 'Task Directive')}</strong>
                    ${t.description ? `<div class="text-muted small text-truncate" style="max-width:300px;">${escapeHtml(t.description)}</div>` : ''}
                </td>
                <td>${escapeHtml(t.assigned_to_name || t.assigned_to || 'Unassigned')}</td>
                <td><span class="badge ${prBadge}">${escapeHtml(t.priority || 'Normal')}</span></td>
                <td><span class="badge ${stBadge}">${escapeHtml(t.status || 'Pending')}</span></td>
                <td><small>${escapeHtml(t.due_date || '-')}</small></td>
                <td class="text-end">
                    <a href="/pages/admin/task_details.php?id=${t.id}" class="btn btn-sm btn-outline-secondary me-1" title="View Details">
                        <span class="material-icons-outlined" style="font-size:16px;">visibility</span>
                    </a>
                    <button class="btn btn-sm btn-outline-primary edit-task-btn" data-id="${t.id}" title="Edit Task">
                        <span class="material-icons-outlined" style="font-size:16px;">edit</span>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    attachActions();
}

function attachActions() {
    document.querySelectorAll('.edit-task-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const task = tasks.find(t => String(t.id) === String(id));
            if (task) openModal(task);
        });
    });
}

function openModal(t = null) {
    document.getElementById('taskId').value = t ? t.id : '';
    document.getElementById('taskModalTitle').textContent = t ? `Edit Directive #${t.id}` : 'Create Task Directive';
    document.getElementById('tTitle').value = t ? (t.title || '') : '';
    document.getElementById('tDesc').value = t ? (t.description || '') : '';
    document.getElementById('tAssigned').value = t ? (t.assigned_to_id || t.assigned_to || '') : '';
    document.getElementById('tPriority').value = t ? (t.priority || 'Medium') : 'Medium';
    document.getElementById('tStatus').value = t ? (t.status || 'pending') : 'pending';
    document.getElementById('tDue').value = t ? (t.due_date || '') : '';

    document.getElementById('taskModal').style.display = 'block';
    document.getElementById('modalBackdrop').style.display = 'block';
}

function closeModal() {
    document.getElementById('taskModal').style.display = 'none';
    document.getElementById('modalBackdrop').style.display = 'none';
}

document.getElementById('addTaskBtn').addEventListener('click', () => openModal());
document.getElementById('closeTaskModalBtn').addEventListener('click', closeModal);
document.getElementById('cancelTaskModalBtn').addEventListener('click', closeModal);
document.getElementById('modalBackdrop').addEventListener('click', closeModal);

document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('taskId').value;
    const payload = {
        title: document.getElementById('tTitle').value.trim(),
        description: document.getElementById('tDesc').value.trim(),
        assigned_to_id: document.getElementById('tAssigned').value,
        assigned_to: document.getElementById('tAssigned').value,
        priority: document.getElementById('tPriority').value,
        status: document.getElementById('tStatus').value,
        due_date: document.getElementById('tDue').value || null
    };

    try {
        if (id) {
            await updateTask(id, payload);
            const foundEmp = employees.find(e => String(e.id) === String(payload.assigned_to_id));
            tasks = tasks.map(t => String(t.id) === String(id) ? { ...t, ...payload, assigned_to_name: foundEmp ? foundEmp.name : payload.assigned_to_id } : t);
        } else {
            const res = await createTask(payload);
            const created = res.data || { id: Date.now(), ...payload };
            const foundEmp = employees.find(e => String(e.id) === String(payload.assigned_to_id));
            if (foundEmp) created.assigned_to_name = foundEmp.name;
            tasks.push(created);
        }
        closeModal();
        updateStats();
        renderTable();
    } catch (err) {
        alert('Failed to save directive: ' + (err.message || 'Server error'));
    }
});

document.getElementById('searchInput').addEventListener('input', renderTable);
document.getElementById('statusFilter').addEventListener('change', renderTable);
document.getElementById('priorityFilter').addEventListener('change', renderTable);

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

loadData();