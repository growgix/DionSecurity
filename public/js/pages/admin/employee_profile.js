import { getEmployees, getTasks } from '/public/js/api.js';

async function loadProfile() {
    const params = new URLSearchParams(window.location.search);
    const empId = params.get('id');

    if (!empId) {
        document.getElementById('profileName').textContent = 'Employee Not Specified';
        return;
    }

    try {
        const [empRes, taskRes] = await Promise.all([
            getEmployees(),
            getTasks().catch(() => ({ success: true, data: [] }))
        ]);

        const employees = empRes.data || [];
        const emp = employees.find(e => String(e.id) === String(empId));

        if (!emp) {
            document.getElementById('profileName').textContent = `Employee ${empId} Not Found`;
            return;
        }

        document.getElementById('profileName').textContent = emp.name || 'Employee Profile';
        document.getElementById('profileSubtext').textContent = `Rank: ${emp.role || 'Security'} • ID: ${emp.id}`;
        document.getElementById('pId').textContent = emp.id;
        document.getElementById('pRole').textContent = emp.role || 'Guard';
        document.getElementById('pPhone').textContent = emp.phone || 'N/A';
        document.getElementById('pEmail').textContent = emp.email || 'N/A';
        document.getElementById('pShift').textContent = emp.shift || 'Standard Day Shift';

        const st = (emp.status || '').toLowerCase();
        let badge = '<span class="badge bg-secondary-subtle text-secondary fs-6">Inactive</span>';
        if (st === 'present') badge = '<span class="badge bg-success-subtle text-success fs-6">Present / On Duty</span>';
        else if (st === 'leave') badge = '<span class="badge bg-warning-subtle text-warning fs-6">On Approved Leave</span>';
        else if (st === 'absent') badge = '<span class="badge bg-danger-subtle text-danger fs-6">Absent</span>';
        document.getElementById('profileStatusBadge').innerHTML = badge;

        // Tasks assigned
        const allTasks = taskRes.data || [];
        const assigned = allTasks.filter(t => String(t.assigned_to_id || t.assigned_to) === String(empId));

        const tbody = document.getElementById('empTasksBody');
        if (assigned.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center py-3 text-muted">No open tasks assigned to this employee.</td></tr>';
            return;
        }

        tbody.innerHTML = assigned.map(t => `
            <tr>
                <td><strong>${escapeHtml(t.title || 'Task')}</strong></td>
                <td><span class="badge ${t.priority === 'High' || t.priority === 'Urgent' ? 'bg-danger-subtle text-danger' : 'bg-light text-dark'}">${escapeHtml(t.priority || 'Normal')}</span></td>
                <td><span class="badge bg-info-subtle text-info">${escapeHtml(t.status || 'Pending')}</span></td>
                <td><small>${escapeHtml(t.due_date || '-')}</small></td>
            </tr>
        `).join('');

    } catch (err) {
        console.error('Failed to load employee profile:', err);
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

loadProfile();