import { getVisitors } from '/public/js/api.js';

let expectedList = [];

async function loadData() {
    try {
        const res = await getVisitors();
        const all = res.data || [];
        expectedList = all.filter(v => (v.status || '').toLowerCase() === 'expected' || (v.expected_date && !(v.check_in_time)));
        renderTable();
    } catch (err) {
        console.error('Failed to load expected visitors:', err);
        document.getElementById('expectedTableBody').innerHTML = `
            <tr><td colspan="7" class="text-center py-4 text-danger">Failed to retrieve expected visitors.</td></tr>
        `;
    }
}

function renderTable() {
    const search = document.getElementById('searchInput').value.toLowerCase().trim();

    const filtered = expectedList.filter(v => {
        const name = (v.name || '').toLowerCase();
        const code = (v.pass_code || v.badge_number || '').toLowerCase();
        const host = (v.resident_name || v.host_name || '').toLowerCase();
        const unit = (v.house_unit_number || v.unit_number || '').toLowerCase();
        return !search || name.includes(search) || code.includes(search) || host.includes(search) || unit.includes(search);
    });

    const tbody = document.getElementById('expectedTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No pending pre-approved visitors scheduled.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(v => `
        <tr>
            <td>
                <strong>${escapeHtml(v.name || 'Scheduled Guest')}</strong>
                ${v.phone ? `<br><small class="text-muted">${escapeHtml(v.phone)}</small>` : ''}
            </td>
            <td><code>${escapeHtml(v.pass_code || v.badge_number || 'EXP-' + v.id)}</code></td>
            <td>${escapeHtml(v.resident_name || v.host_name || 'Estate Resident')}</td>
            <td><span class="badge bg-light text-dark border">${escapeHtml(v.house_unit_number || v.unit_number || '-')}</span></td>
            <td>${escapeHtml(v.expected_date || v.created_at || 'Pending')}</td>
            <td><span class="badge bg-light text-dark">${escapeHtml(v.purpose || 'Visit')}</span></td>
            <td class="text-end">
                <span class="badge bg-warning-subtle text-warning">Pre-Approved</span>
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