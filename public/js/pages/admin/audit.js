import { getAuditLogs } from '/public/js/api.js';

let auditLogs = [];

async function loadData() {
    try {
        const res = await getAuditLogs();
        auditLogs = res.data || [];
        renderTable();
    } catch (err) {
        console.error('Failed to load audit logs:', err);
        document.getElementById('auditTableBody').innerHTML = `
            <tr><td colspan="7" class="text-center py-4 text-danger">Failed to retrieve audit trail.</td></tr>
        `;
    }
}

function renderTable() {
    const search = document.getElementById('searchInput').value.toLowerCase().trim();
    const actionFilter = document.getElementById('actionFilter').value.toLowerCase();

    const filtered = auditLogs.filter(log => {
        const actor = (log.actor_name || log.actor || log.user_name || '').toLowerCase();
        const action = (log.action || '').toLowerCase();
        const entity = (log.entity || log.target || log.table_name || '').toLowerCase();
        const ip = (log.ip_address || '').toLowerCase();

        const matchesSearch = !search || actor.includes(search) || action.includes(search) || entity.includes(search) || ip.includes(search);
        const matchesAction = !actionFilter || action.includes(actionFilter);

        return matchesSearch && matchesAction;
    });

    const tbody = document.getElementById('auditTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No audit entries found matching criteria.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(log => {
        const act = (log.action || '').toLowerCase();
        let badge = 'bg-secondary-subtle text-secondary';
        if (act.includes('create') || act.includes('add')) badge = 'bg-success-subtle text-success';
        else if (act.includes('update') || act.includes('edit')) badge = 'bg-primary-subtle text-primary';
        else if (act.includes('delete') || act.includes('remove')) badge = 'bg-danger-subtle text-danger';
        else if (act.includes('login')) badge = 'bg-info-subtle text-info';

        return `
            <tr>
                <td><small class="text-muted font-monospace">${escapeHtml(log.created_at || log.timestamp || '-')}</small></td>
                <td><strong>${escapeHtml(log.actor_name || log.actor || log.user_name || 'System Actor')}</strong></td>
                <td><span class="badge bg-light text-dark border">${escapeHtml(log.actor_role || log.role || 'user')}</span></td>
                <td><span class="badge ${badge}">${escapeHtml(log.action || 'Event')}</span></td>
                <td><code>${escapeHtml(log.entity || log.target || log.table_name || 'System')}</code></td>
                <td><small>${escapeHtml(log.ip_address || '127.0.0.1')}</small></td>
                <td><small class="text-secondary">${escapeHtml(log.details || log.description || log.payload || '-')}</small></td>
            </tr>
        `;
    }).join('');
}

document.getElementById('refreshAuditBtn').addEventListener('click', loadData);
document.getElementById('searchInput').addEventListener('input', renderTable);
document.getElementById('actionFilter').addEventListener('change', renderTable);

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

loadData();