import { getEmployees } from '/public/js/api.js';

let employees = [];

async function loadData() {
    try {
        const res = await getEmployees();
        employees = res.data || [];
        updateShiftCounts();
        renderTable();
    } catch (err) {
        console.error('Failed to load shifts:', err);
    }
}

function updateShiftCounts() {
    let m = 0, e = 0, n = 0;
    employees.forEach(emp => {
        const s = (emp.shift || '').toLowerCase();
        if (s.includes('night')) n++;
        else if (s.includes('evening')) e++;
        else m++;
    });

    document.getElementById('shiftCountMorning').textContent = `${m} guards`;
    document.getElementById('shiftCountEvening').textContent = `${e} guards`;
    document.getElementById('shiftCountNight').textContent = `${n} guards`;
}

function renderTable() {
    const tbody = document.getElementById('shiftTableBody');
    if (employees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">No personnel registered.</td></tr>';
        return;
    }

    tbody.innerHTML = employees.map(emp => `
        <tr>
            <td>
                <strong>${escapeHtml(emp.name || 'Unnamed')}</strong>
                <div class="text-muted small">ID: ${escapeHtml(emp.id)}</div>
            </td>
            <td><span class="badge bg-light text-dark border">${escapeHtml(emp.role || 'Guard')}</span></td>
            <td>
                <span class="badge ${getShiftBadge(emp.shift)}">${escapeHtml(emp.shift || 'Morning')}</span>
            </td>
            <td>${escapeHtml(emp.assigned_area || 'Main Gate')}</td>
            <td>
                <span class="badge ${emp.status === 'present' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}">
                    ${escapeHtml(emp.status || 'Active')}
                </span>
            </td>
            <td class="text-end">
                <a href="/pages/admin/employee_profile.php?id=${emp.id}" class="btn btn-sm btn-outline-primary">
                    <span class="material-icons-outlined" style="font-size:16px;">visibility</span> Profile
                </a>
            </td>
        </tr>
    `).join('');
}

function getShiftBadge(shift) {
    const s = (shift || '').toLowerCase();
    if (s.includes('night')) return 'bg-dark text-white';
    if (s.includes('evening')) return 'bg-warning-subtle text-warning';
    return 'bg-primary-subtle text-primary';
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

loadData();