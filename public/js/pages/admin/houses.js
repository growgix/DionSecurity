import { api } from '../../api.js';

let housesData = [];

function renderHouses(list) {
    const tbody = document.getElementById('houses-tbody');
    const badge = document.getElementById('houses-count-badge');
    if (badge) badge.textContent = `${list.length} Units`;

    if (!list || list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="loading-cell">No units match search criteria.</td></tr>';
        return;
    }

    tbody.innerHTML = list.map(h => `
        <tr>
            <td>
                <a href="/pages/admin/house_details.php?id=${encodeURIComponent(h.id || h.unitNumber)}" style="font-weight:700; color:var(--primary);">
                    Unit ${escapeHtml(h.unitNumber)}
                </a>
            </td>
            <td>${escapeHtml(h.blockName || 'Block')}</td>
            <td>${escapeHtml(h.floor || 'Floor 1')}</td>
            <td>${escapeHtml(h.type || 'Standard')}</td>
            <td><strong>${escapeHtml(h.residentName || 'Vacant')}</strong></td>
            <td><span class="badge badge-neutral">${escapeHtml(h.parkingSlot || 'None')}</span></td>
            <td>${escapeHtml(h.intercom || 'N/A')}</td>
            <td>
                <span class="status-pill ${h.status === 'occupied' ? 'status-present' : 'status-absent'}">
                    ${escapeHtml(h.status || 'vacant')}
                </span>
            </td>
        </tr>
    `).join('');
}

function updateKpis(list) {
    const total = list.length;
    let occupied = 0;
    let vacant = 0;

    list.forEach(h => {
        if ((h.status || '').toLowerCase() === 'occupied') occupied++;
        else vacant++;
    });

    document.getElementById('kpi-total-houses').textContent = total;
    document.getElementById('kpi-occupied-houses').textContent = occupied;
    document.getElementById('kpi-vacant-houses').textContent = vacant;
}

function filterHouses() {
    const q = (document.getElementById('filter-search')?.value || '').toLowerCase().trim();
    const st = document.getElementById('filter-status')?.value || 'all';

    const filtered = housesData.filter(h => {
        if (q) {
            const u = (h.unitNumber || '').toLowerCase();
            const r = (h.residentName || '').toLowerCase();
            const b = (h.blockName || '').toLowerCase();
            const p = (h.parkingSlot || '').toLowerCase();
            if (!u.includes(q) && !r.includes(q) && !b.includes(q) && !p.includes(q)) return false;
        }
        if (st !== 'all') {
            if ((h.status || '').toLowerCase() !== st) return false;
        }
        return true;
    });

    renderHouses(filtered);
}

async function loadHouses() {
    try {
        const res = await api.getHouses();
        housesData = Array.isArray(res) ? res : (res.data || []);
        updateKpis(housesData);
        filterHouses();
    } catch (err) {
        document.getElementById('houses-tbody').innerHTML = `
            <tr><td colspan="8" class="loading-cell" style="color:var(--danger)">Failed to load houses: ${escapeHtml(err.message)}</td></tr>
        `;
    }
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
    loadHouses();
    document.getElementById('filter-search')?.addEventListener('input', filterHouses);
    document.getElementById('filter-status')?.addEventListener('change', filterHouses);
    document.getElementById('btn-refresh-houses')?.addEventListener('click', loadHouses);
});