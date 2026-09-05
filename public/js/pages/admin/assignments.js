import { getEmployees } from '/public/js/api.js';

let employees = [];

async function loadData() {
    try {
        const res = await getEmployees();
        employees = res.data || [];
        renderTable();
    } catch (err) {
        console.error('Failed to load assignments:', err);
    }
}

function renderTable() {
    const search = document.getElementById('searchInput').value.toLowerCase().trim();

    const filtered = employees.filter(e => {
        const name = (e.name || '').toLowerCase();
        const role = (e.role || '').toLowerCase();
        const post = (e.assigned_area || 'Main Gate').toLowerCase();
        return !search || name.includes(search) || role.includes(search) || post.includes(search);
    });

    const tbody = document.getElementById('assignmentTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">No assignments match your search.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(e => `
        <tr>
            <td>
                <strong>${escapeHtml(e.name || 'Officer')}</strong>
                <div class="text-muted small">${escapeHtml(e.id)}</div>
            </td>
            <td><span class="badge bg-light text-dark border">${escapeHtml(e.role || 'Guard')}</span></td>
            <td>
                <span class="badge bg-primary-subtle text-primary fs-6">
                    ${escapeHtml(e.assigned_area || 'Main Gate Checkpoint')}
                </span>
            </td>
            <td>${escapeHtml(e.shift || 'Morning Shift')}</td>
            <td>
                <span class="badge ${e.status === 'present' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}">
                    ${escapeHtml(e.status || 'On Duty')}
                </span>
            </td>
            <td class="text-end">
                <a href="/pages/admin/employee_profile.php?id=${e.id}" class="btn btn-sm btn-outline-primary">
                    <span class="material-icons-outlined" style="font-size:16px;">badge</span> Profile
                </a>
            </td>
        </tr>
    `).join('');
}

document.getElementById('searchInput').addEventListener('input', renderTable);

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

loadData();