import { getEmployees } from '/public/js/api.js';

let employees = [];

async function loadData() {
    try {
        const res = await getEmployees();
        employees = res.data || [];
        renderTable();
    } catch (err) {
        console.error('Failed to load employee history:', err);
    }
}

function renderTable() {
    const search = document.getElementById('searchInput').value.toLowerCase().trim();

    const filtered = employees.filter(e => {
        const name = (e.name || '').toLowerCase();
        const id = (e.id || '').toLowerCase();
        return !search || name.includes(search) || id.includes(search);
    });

    const tbody = document.getElementById('historyTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">No records found.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(e => `
        <tr>
            <td><code>${escapeHtml(e.id)}</code></td>
            <td><strong>${escapeHtml(e.name || 'Personnel')}</strong></td>
            <td>${escapeHtml(e.assigned_area || 'Main Gate')}</td>
            <td>${escapeHtml(e.created_at ? e.created_at.substring(0,10) : '2025-01-01')}</td>
            <td>
                <span class="badge ${e.status === 'present' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}">
                    ${escapeHtml(e.status || 'Active')}
                </span>
            </td>
            <td class="text-end">
                <a href="/pages/admin/employee_profile.php?id=${e.id}" class="btn btn-sm btn-outline-primary">
                    <span class="material-icons-outlined" style="font-size:16px;">history</span> Full Profile
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