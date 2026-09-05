import { api } from '../../api.js';

function getUrlParam(param) {
    const p = new URLSearchParams(window.location.search);
    return p.get(param);
}

async function loadBlockDetails() {
    const blockId = getUrlParam('id') || 'BLK-A';
    try {
        const [blockRes, housesRes] = await Promise.all([
            api.getBlockById(blockId).catch(() => ({ data: null })),
            api.getHouses().catch(() => ({ data: [] }))
        ]);

        const block = blockRes.data || (Array.isArray(blockRes) ? blockRes[0] : null);
        const allHouses = Array.isArray(housesRes) ? housesRes : (housesRes.data || []);

        if (!block) {
            document.getElementById('block-hero').innerHTML = '<div class="loading-state-box" style="color:var(--danger)">Block not found.</div>';
            return;
        }

        document.getElementById('breadcrumb-block-name').textContent = block.name;
        document.getElementById('block-detail-title').textContent = block.name;

        // Render Hero
        const total = block.totalUnits || 0;
        const occupied = block.occupiedUnits || 0;
        const pct = total > 0 ? ((occupied / total) * 100).toFixed(0) : 0;

        document.getElementById('block-hero').innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                <div>
                    <h2 style="font-size:24px; font-weight:800; color:var(--primary); margin:0;">${escapeHtml(block.name)}</h2>
                    <p style="color:var(--secondary); margin:4px 0 0 0;">Floors: ${escapeHtml(block.floors)} • Officer: <strong>${escapeHtml(block.securityOfficer || 'Unassigned')}</strong></p>
                </div>
                <span class="badge badge-success">${escapeHtml(block.status || 'Active')}</span>
            </div>
            <div class="hero-stats-strip">
                <div class="hero-stat-item">
                    <span class="hero-stat-label">Total Houses</span>
                    <span class="hero-stat-val">${total}</span>
                </div>
                <div class="hero-stat-item">
                    <span class="hero-stat-label">Occupied</span>
                    <span class="hero-stat-val" style="color:#16a34a;">${occupied}</span>
                </div>
                <div class="hero-stat-item">
                    <span class="hero-stat-label">Vacant</span>
                    <span class="hero-stat-val" style="color:#d97706;">${Math.max(0, total - occupied)}</span>
                </div>
                <div class="hero-stat-item">
                    <span class="hero-stat-label">Occupancy Rate</span>
                    <span class="hero-stat-val">${pct}%</span>
                </div>
            </div>
        `;

        // Filter houses for this block
        const blockHouses = allHouses.filter(h => 
            h.blockId === block.id || 
            (h.blockName && block.name && h.blockName.toLowerCase() === block.name.toLowerCase()) ||
            (h.unitNumber && h.unitNumber.startsWith(block.name.replace('Block ', '')))
        );

        document.getElementById('block-units-badge').textContent = `${blockHouses.length} Units`;

        const tbody = document.getElementById('block-houses-tbody');
        if (blockHouses.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading-cell">No registered units found for this block.</td></tr>';
            return;
        }

        tbody.innerHTML = blockHouses.map(h => `
            <tr>
                <td><a href="/pages/admin/house_details.php?id=${encodeURIComponent(h.id || h.unitNumber)}" style="font-weight:700; color:var(--primary);">Unit ${escapeHtml(h.unitNumber)}</a></td>
                <td>${escapeHtml(h.floor || 'Floor 1')}</td>
                <td>${escapeHtml(h.type || 'Standard Flat')}</td>
                <td><strong>${escapeHtml(h.residentName || 'Vacant')}</strong></td>
                <td><span class="badge badge-neutral">${escapeHtml(h.parkingSlot || 'None')}</span></td>
                <td>${escapeHtml(h.intercom || 'N/A')}</td>
                <td><span class="status-pill ${h.status === 'occupied' ? 'status-present' : 'status-absent'}">${escapeHtml(h.status || 'vacant')}</span></td>
            </tr>
        `).join('');

    } catch (err) {
        document.getElementById('block-hero').innerHTML = `<div class="loading-state-box" style="color:var(--danger)">Error: ${escapeHtml(err.message)}</div>`;
    }
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', loadBlockDetails);