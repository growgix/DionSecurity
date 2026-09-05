import { getTasks } from '/public/js/api.js';

async function loadDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        document.getElementById('taskTitle').textContent = 'Task Not Found';
        return;
    }

    try {
        const res = await getTasks();
        const tasks = res.data || [];
        const task = tasks.find(t => String(t.id) === String(id));

        if (!task) {
            document.getElementById('taskTitle').textContent = `Task #${id} Not Found`;
            return;
        }

        document.getElementById('taskTitle').textContent = task.title || 'Directive Details';
        document.getElementById('taskSubtitle').textContent = `Task #${task.id} • Assigned: ${task.assigned_to_name || task.assigned_to || 'Unassigned'}`;
        document.getElementById('taskDesc').textContent = task.description || 'No specific instructions provided.';
        document.getElementById('taskAssignee').textContent = task.assigned_to_name || task.assigned_to || 'Unassigned';
        document.getElementById('taskDue').textContent = task.due_date || 'No due date specified';
        document.getElementById('taskCreated').textContent = task.created_at || '-';
        document.getElementById('taskIdCode').textContent = `TASK-${task.id}`;

        const pr = (task.priority || '').toLowerCase();
        let prBadge = '<span class="badge bg-light text-dark">Normal</span>';
        if (pr === 'high' || pr === 'urgent') prBadge = '<span class="badge bg-danger-subtle text-danger">High Priority</span>';
        else if (pr === 'medium') prBadge = '<span class="badge bg-primary-subtle text-primary">Medium Priority</span>';
        document.getElementById('taskPriority').innerHTML = prBadge;

        const st = (task.status || '').toLowerCase();
        let stBadge = '<span class="badge bg-secondary-subtle text-secondary fs-6">Pending</span>';
        if (st === 'completed') stBadge = '<span class="badge bg-success-subtle text-success fs-6">Completed</span>';
        else if (st === 'in_progress') stBadge = '<span class="badge bg-info-subtle text-info fs-6">In Progress</span>';
        document.getElementById('taskStatusBadge').innerHTML = stBadge;

    } catch (err) {
        console.error('Failed to load task details:', err);
    }
}

loadDetails();