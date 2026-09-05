import { api } from '../../api.js';

let blocksData = [];

function renderBlocks(list) {
    const container = document.getElementById('blocks-container');
    if (!list || list.length === 0) {
        container.innerHTML = '<div class="loading-state-box">No blocks found matching query.</div>';
        return;
    }

    container.innerHTML = list.map(b => {
        const total = b.totalUnits || 0;
        const occupied = b.occupiedUnits || 0;
        const pct = total > 0 ? ((occupied / total) * 100).toFixed(0) : 0;
        const officer = b.securityOfficer || 'Unassigned';

        return `
            <a href="/pages/admin/block_details.php?id=${encodeURIComponent(b.id)}" class="block-card">
                <div class="block-card-header">
                    <h3 class="block-name">${escapeHtml(b.name)}</h3>
                    <span class="badge badge-success">${escapeHtml(b.status || 'Active')}</span>
                </div>
                <div class="block-stats-row">
                    <div class="stat-sub-item">
                        <span class="stat-sub-label">Floors</span>
                        <span class="stat-sub-val">${escapeHtml(b.floors || 'N/A')}</span>
                    </div>
                    <div class="stat-sub-item">
                        <span class="stat-sub-label">Units (Occupancy)</span>
                        <span class="stat-sub-val">${occupied} / ${total} (${pct}%)</span>
                    </div>
                </div>
                <div class="block-officer-row">
                    <span class="material-symbols-outlined" style="font-size: 16px; color: var(--primary);">shield_person</span>
                    <span>Officer: <strong>${escapeHtml(officer)}</strong></span>
                </div>
            </a>
        `;
    }).join('');
}

function updateKpis(list) {
    let totalUnits = 0;
    let totalOccupied = 0;

    list.forEach(b => {
        totalUnits += Number(b.totalUnits || 0);
        totalOccupied += Number(b.occupiedUnits || 0);
    });

    const avg = totalUnits > 0 ? ((totalOccupied / totalUnits) * 100).toFixed(1) : '0';

    document.getElementById('kpi-total-blocks').textContent = list.length;
    document.getElementById('kpi-total-units').textContent = totalUnits;
    document.getElementById('kpi-occupied-units').textContent = totalOccupied;
    document.getElementById('kpi-avg-occupancy').textContent = `${avg}%`;
}

function filterBlocks() {
    const q = (document.getElementById('filter-search')?.value || '').toLowerCase().trim();
    const filtered = blocksData.filter(b => {
        return (b.name || '').toLowerCase().includes(q) ||
               (b.securityOfficer || '').toLowerCase().includes(q) ||
               (b.id || '').toLowerCase().includes(q);
    });
    renderBlocks(filtered);
}

async function loadBlocks() {
    try {
        const res = await api.getBlocks();
        blocksData = Array.isArray(res) ? res : (res.data || []);
        updateKpis(blocksData);
        filterBlocks();
    } catch (err) {
        document.getElementById('blocks-container').innerHTML = `
            <div class="loading-state-box" style="color: var(--danger);">
                Error loading blocks: ${escapeHtml(err.message)}
            </div>
        `;
    }
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
    loadBlocks();
    document.getElementById('filter-search')?.addEventListener('input', filterBlocks);
    document.getElementById('btn-refresh-blocks')?.addEventListener('click', loadBlocks);
});