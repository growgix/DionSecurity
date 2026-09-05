import { getVisitors } from '/public/js/api.js';

let regularVisitors = [];

async function loadData() {
    try {
        const res = await getVisitors();
        const allVisitors = res.data || [];

        // Group by phone or normalized name to find frequent / regular visitors
        const map = new Map();
        allVisitors.forEach(v => {
            const key = (v.phone || v.name || '').trim().toLowerCase();
            if (!key) return;
            if (!map.has(key)) {
                map.set(key, {
                    id: v.id,
                    name: v.name,
                    phone: v.phone,
                    purpose: v.purpose,
                    host_name: v.resident_name || v.host_name,
                    unit_number: v.house_unit_number || v.unit_number,
                    visitCount: 1,
                    lastVisit: v.check_in_time || v.created_at
                });
            } else {
                const item = map.get(key);
                item.visitCount++;
                if ((v.check_in_time || v.created_at) > item.lastVisit) {
                    item.lastVisit = v.check_in_time || v.created_at;
                }
            }
        });

        regularVisitors = Array.from(map.values()).sort((a, b) => b.visitCount - a.visitCount);
        renderTable();
    } catch (err) {
        console.error('Failed to load regular visitors:', err);
        document.getElementById('regularTableBody').innerHTML = `
            <tr><td colspan="7" class="text-center py-4 text-danger">Failed to process visitor frequencies.</td></tr>
        `;
    }
}

function renderTable() {
    const search = document.getElementById('searchInput').value.toLowerCase().trim();

    const filtered = regularVisitors.filter(v => {
        const name = (v.name || '').toLowerCase();
        const phone = (v.phone || '').toLowerCase();
        const purpose = (v.purpose || '').toLowerCase();
        return !search || name.includes(search) || phone.includes(search) || purpose.includes(search);
    });

    const tbody = document.getElementById('regularTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No frequent visitors found.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(v => `
        <tr>
            <td><strong>${escapeHtml(v.name || 'Anonymous')}</strong></td>
            <td>${escapeHtml(v.phone || '-')}</td>
            <td><span class="badge bg-light text-dark">${escapeHtml(v.purpose || 'General')}</span></td>
            <td>
                <div>${escapeHtml(v.host_name || 'Various')}</div>
                ${v.unit_number ? `<span class="badge bg-light text-dark border">${escapeHtml(v.unit_number)}</span>` : ''}
            </td>
            <td>
                <span class="badge ${v.visitCount > 1 ? 'bg-primary-subtle text-primary' : 'bg-secondary-subtle text-secondary'}">
                    ${v.visitCount} visits
                </span>
            </td>
            <td><small>${escapeHtml(v.lastVisit || '-')}</small></td>
            <td class="text-end">
                <a href="/pages/admin/visitor_details.php?id=${v.id}" class="btn btn-sm btn-outline-primary">
                    <span class="material-icons-outlined" style="font-size:16px;">visibility</span> History
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