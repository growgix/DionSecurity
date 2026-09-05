import { getEmployees } from '/public/js/api.js';

let employees = [];

async function loadData() {
    try {
        const res = await getEmployees();
        employees = res.data || [];
        renderTable();
    } catch (err) {
        console.error('Failed to load attendance history:', err);
    }
}

function renderTable() {
    const search = document.getElementById('searchInput').value.toLowerCase().trim();

    const filtered = employees.filter(e => {
        const name = (e.name || '').toLowerCase();
        const id = (e.id || '').toLowerCase();
        return !search || name.includes(search) || id.includes(search);
    });

    const tbody = document.getElementById('attendanceTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">No attendance logs found.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(e => {
        const st = (e.status || '').toLowerCase();
        let badge = 'bg-secondary-subtle text-secondary';
        if (st === 'present') badge = 'bg-success-subtle text-success';
        else if (st === 'leave') badge = 'bg-warning-subtle text-warning';
        else if (st === 'absent') badge = 'bg-danger-subtle text-danger';

        return `
            <tr>
                <td><strong>${escapeHtml(e.name || 'Officer')}</strong></td>
                <td><code>${escapeHtml(e.id)}</code></td>
                <td>${escapeHtml(e.shift || 'Morning Shift')}</td>
                <td><span class="badge ${badge}">${escapeHtml(e.status || 'Present')}</span></td>
                <td><span class="text-success"><span class="material-icons-outlined align-middle" style="font-size:18px;">check_circle</span> Verified</span></td>
            </tr>
        `;
    }).join('');
}

document.getElementById('searchInput').addEventListener('input', renderTable);

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

loadData();