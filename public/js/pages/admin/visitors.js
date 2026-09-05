import { getVisitors } from '/public/js/api.js';

let visitors = [];

async function loadData() {
    try {
        const res = await getVisitors();
        visitors = res.data || [];
        updateStats();
        renderTable();
    } catch (err) {
        console.error('Error loading visitors:', err);
        document.getElementById('visitorsTableBody').innerHTML = `
            <tr><td colspan="8" class="text-center py-4 text-danger">Failed to load visitors list.</td></tr>
        `;
    }
}

function updateStats() {
    document.getElementById('statTotalVisitors').textContent = visitors.length;
    const inside = visitors.filter(v => (v.status || '').toLowerCase() === 'inside' || (v.status || '').toLowerCase() === 'checked_in').length;
    document.getElementById('statCurrentlyInside').textContent = inside;
    const expected = visitors.filter(v => (v.status || '').toLowerCase() === 'expected').length;
    document.getElementById('statExpected').textContent = expected;
}

function renderTable() {
    const search = document.getElementById('searchInput').value.toLowerCase().trim();
    const status = document.getElementById('statusFilter').value.toLowerCase();
    const purpose = document.getElementById('purposeFilter').value.toLowerCase();

    const filtered = visitors.filter(v => {
        const name = (v.name || '').toLowerCase();
        const phone = (v.phone || '').toLowerCase();
        const host = (v.resident_name || v.host_name || '').toLowerCase();
        const house = (v.house_unit_number || v.unit_number || '').toLowerCase();
        const p = (v.purpose || '').toLowerCase();
        const st = (v.status || '').toLowerCase();

        const matchesSearch = !search || name.includes(search) || phone.includes(search) || host.includes(search) || house.includes(search);
        
        let matchesStatus = true;
        if (status === 'inside') {
            matchesStatus = st === 'inside' || st === 'checked_in';
        } else if (status) {
            matchesStatus = st === status;
        }

        const matchesPurpose = !purpose || p.includes(purpose);

        return matchesSearch && matchesStatus && matchesPurpose;
    });

    const tbody = document.getElementById('visitorsTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-muted">No visitors found matching filter criteria.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(v => {
        const isInside = (v.status || '').toLowerCase() === 'inside' || (v.status || '').toLowerCase() === 'checked_in';
        const isExpected = (v.status || '').toLowerCase() === 'expected';
        let badgeClass = 'bg-secondary-subtle text-secondary';
        let badgeLabel = v.status || 'Checked Out';

        if (isInside) {
            badgeClass = 'bg-success-subtle text-success';
            badgeLabel = 'Inside';
        } else if (isExpected) {
            badgeClass = 'bg-warning-subtle text-warning';
            badgeLabel = 'Expected';
        }

        return `
            <tr>
                <td>
                    <div class="fw-bold">${escapeHtml(v.name || 'Anonymous')}</div>
                    ${v.badge_number ? `<small class="text-muted">Badge: ${escapeHtml(v.badge_number)}</small>` : ''}
                </td>
                <td>${escapeHtml(v.phone || '-')}</td>
                <td>
                    <div>${escapeHtml(v.resident_name || v.host_name || 'Resident')}</div>
                    <span class="badge bg-light text-dark border">${escapeHtml(v.house_unit_number || v.unit_number || '-')}</span>
                </td>
                <td><span class="badge bg-light text-dark">${escapeHtml(v.purpose || 'Visit')}</span></td>
                <td><span class="badge ${badgeClass}">${badgeLabel}</span></td>
                <td><small>${escapeHtml(v.check_in_time || v.created_at || '-')}</small></td>
                <td><small>${escapeHtml(v.check_out_time || (isInside ? 'Still on premises' : '-'))}</small></td>
                <td class="text-end">
                    <a href="/pages/admin/visitor_details.php?id=${v.id}" class="btn btn-sm btn-outline-primary">
                        <span class="material-icons-outlined" style="font-size:16px;">visibility</span>
                    </a>
                </td>
            </tr>
        `;
    }).join('');
}

document.getElementById('searchInput').addEventListener('input', renderTable);
document.getElementById('statusFilter').addEventListener('change', renderTable);
document.getElementById('purposeFilter').addEventListener('change', renderTable);

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

loadData();