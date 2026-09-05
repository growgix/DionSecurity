import { getTasks } from '/public/js/api.js';

let tasks = [];

async function loadData() {
    try {
        const res = await getTasks();
        tasks = res.data || [];
        renderTable();
    } catch (err) {
        console.error('Failed to load task history:', err);
    }
}

function renderTable() {
    const search = document.getElementById('searchInput').value.toLowerCase().trim();

    const filtered = tasks.filter(t => {
        const title = (t.title || '').toLowerCase();
        const assignee = (t.assigned_to_name || t.assigned_to || '').toLowerCase();
        return !search || title.includes(search) || assignee.includes(search);
    });

    const tbody = document.getElementById('taskHistoryBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No task records found.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(t => {
        const st = (t.status || '').toLowerCase();
        let stBadge = 'bg-secondary-subtle text-secondary';
        if (st === 'completed') stBadge = 'bg-success-subtle text-success';
        else if (st === 'in_progress') stBadge = 'bg-info-subtle text-info';

        return `
            <tr>
                <td><strong>${escapeHtml(t.title || 'Directive')}</strong></td>
                <td>${escapeHtml(t.assigned_to_name || t.assigned_to || 'Personnel')}</td>
                <td><span class="badge bg-light text-dark">${escapeHtml(t.priority || 'Normal')}</span></td>
                <td><span class="badge ${stBadge}">${escapeHtml(t.status || 'Pending')}</span></td>
                <td><small>${escapeHtml(t.created_at ? t.created_at.substring(0,10) : '-')}</small></td>
                <td><small>${escapeHtml(t.due_date || '-')}</small></td>
                <td class="text-end">
                    <a href="/pages/admin/task_details.php?id=${t.id}" class="btn btn-sm btn-outline-primary">
                        <span class="material-icons-outlined" style="font-size:16px;">visibility</span> Details
                    </a>
                </td>
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