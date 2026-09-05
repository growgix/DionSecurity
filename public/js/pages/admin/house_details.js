import { api } from '../../api.js';

function getUrlParam(param) {
    const p = new URLSearchParams(window.location.search);
    return p.get(param);
}

async function loadHouseDetails() {
    const houseId = getUrlParam('id') || 'HSE-101';
    try {
        const [houseRes, familyRes] = await Promise.all([
            api.getHouseById(houseId).catch(() => ({ data: null })),
            api.getFamilyMembers().catch(() => ({ data: [] }))
        ]);

        const house = houseRes.data || (Array.isArray(houseRes) ? houseRes[0] : null);
        const allFamily = Array.isArray(familyRes) ? familyRes : (familyRes.data || []);

        if (!house) {
            document.getElementById('house-hero').innerHTML = '<div class="loading-state-box" style="color:var(--danger)">House unit not found.</div>';
            return;
        }

        document.getElementById('breadcrumb-unit-name').textContent = `Unit ${house.unitNumber}`;
        document.getElementById('house-detail-title').textContent = `Unit ${house.unitNumber} Dossier`;

        document.getElementById('house-hero').innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                <div>
                    <h2 style="font-size:24px; font-weight:800; color:var(--primary); margin:0;">Unit ${escapeHtml(house.unitNumber)}</h2>
                    <p style="color:var(--secondary); margin:4px 0 0 0;">${escapeHtml(house.blockName)} • ${escapeHtml(house.floor)} • ${escapeHtml(house.type)}</p>
                </div>
                <span class="status-pill ${house.status === 'occupied' ? 'status-present' : 'status-absent'}">${escapeHtml(house.status || 'vacant')}</span>
            </div>
            <div class="house-detail-grid">
                <div class="house-prop-item">
                    <span class="house-prop-label">Primary Resident</span>
                    <span class="house-prop-val">${escapeHtml(house.residentName || 'Unassigned')}</span>
                </div>
                <div class="house-prop-item">
                    <span class="house-prop-label">Resident Phone</span>
                    <span class="house-prop-val">${escapeHtml(house.residentPhone || 'N/A')}</span>
                </div>
                <div class="house-prop-item">
                    <span class="house-prop-label">Intercom Dial</span>
                    <span class="house-prop-val">#${escapeHtml(house.intercom || 'N/A')}</span>
                </div>
                <div class="house-prop-item">
                    <span class="house-prop-label">Dedicated Parking</span>
                    <span class="house-prop-val">${escapeHtml(house.parkingSlot || 'None')}</span>
                </div>
            </div>
        `;

        // Filter family members for this house
        const houseFamily = allFamily.filter(f => f.unitNumber === house.unitNumber);
        document.getElementById('family-count-badge').textContent = `${houseFamily.length} Members`;

        const tbody = document.getElementById('house-family-tbody');
        if (houseFamily.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading-cell">No dependent family members registered for this unit.</td></tr>';
            return;
        }

        tbody.innerHTML = houseFamily.map(m => `
            <tr>
                <td><strong>${escapeHtml(m.name)}</strong></td>
                <td>${escapeHtml(m.relation || 'Dependent')}</td>
                <td>${escapeHtml(m.phone || 'N/A')}</td>
                <td><span class="badge badge-neutral font-code-sm">${escapeHtml(m.rfidTag || 'N/A')}</span></td>
                <td><span class="badge badge-success">${escapeHtml(m.status || 'active')}</span></td>
            </tr>
        `).join('');

    } catch (err) {
        document.getElementById('house-hero').innerHTML = `<div class="loading-state-box" style="color:var(--danger)">Error: ${escapeHtml(err.message)}</div>`;
    }
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', loadHouseDetails);