import { api } from '../../api.js';

const state = {
    houses: [],
    residents: [],
    searchQuery: '',
    selectedBlock: 'all',
    callingHouse: null
};

const elements = {
    searchInput: document.getElementById('search-input'),
    blockSelect: document.getElementById('block-select'),
    housesGrid: document.getElementById('houses-grid'),
    intercomModal: document.getElementById('intercom-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalSubtitle: document.getElementById('modal-subtitle'),
    intercomActiveText: document.getElementById('intercom-active-text'),
    modalClose: document.getElementById('modal-close'),
    btnEndIntercom: document.getElementById('btn-end-intercom'),
    toastContainer: document.getElementById('toast-container')
};

function showToast(message, type = 'info') {
    if (!elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="material-symbols-outlined" style="font-size: 18px;">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</span>
        <span class="toast-message">${escapeHtml(message)}</span>
        <button type="button" class="toast-close">&times;</button>
    `;
    toast.querySelector('.toast-close')?.addEventListener('click', () => toast.remove());
    elements.toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function loadData() {
    try {
        const [housesRes, residentsRes] = await Promise.all([
            api.getHouses(),
            api.getResidents()
        ]);

        state.houses = (housesRes && housesRes.data) ? housesRes.data : [];
        state.residents = (residentsRes && residentsRes.data) ? residentsRes.data : [];

        renderHouses();
    } catch (err) {
        console.error('Failed to load houses and residents:', err);
        showToast('Failed to load directory data.', 'error');
        if (elements.housesGrid) {
            elements.housesGrid.innerHTML = '<div class="loading-state">Failed to load directory. Please refresh.</div>';
        }
    }
}

function getFilteredHouses() {
    const q = state.searchQuery.toLowerCase().trim();
    const block = state.selectedBlock;

    return state.houses.filter(h => {
        const unit = (h.unitNumber || h.unit_number || '').toLowerCase();
        const resName = (h.residentName || h.resident_name || '').toLowerCase();
        const phone = (h.residentPhone || h.resident_phone || '').toLowerCase();
        const vehicles = Array.isArray(h.vehicles) ? h.vehicles.join(' ').toLowerCase() : '';
        const blockId = h.blockId || h.block_id || '';
        const blockName = h.blockName || h.block_name || '';

        const matchesQuery = !q || unit.includes(q) || resName.includes(q) || phone.includes(q) || vehicles.includes(q);
        const matchesBlock = block === 'all' || blockId === block || blockName.includes(block);

        return matchesQuery && matchesBlock;
    });
}

function renderHouses() {
    if (!elements.housesGrid) return;

    const filtered = getFilteredHouses();

    if (filtered.length === 0) {
        elements.housesGrid.innerHTML = `
            <div class="loading-state">
                No units matching search criteria.
            </div>
        `;
        return;
    }

    elements.housesGrid.innerHTML = filtered.map(house => {
        const unit = escapeHtml(house.unitNumber || house.unit_number || '—');
        const blockName = escapeHtml(house.blockName || house.block_name || 'Block A');
        const floor = escapeHtml(String(house.floor ?? '—'));
        const status = (house.status || 'occupied').toLowerCase();
        const resName = escapeHtml(house.residentName || house.resident_name || '—');
        const phone = escapeHtml(house.residentPhone || house.resident_phone || '—');
        const intercom = escapeHtml(house.intercom || '101');
        const vehicles = Array.isArray(house.vehicles) ? house.vehicles : [];
        const isVacant = !resName || resName === '—' || status === 'vacant';

        return `
            <div class="house-card">
                <div>
                    <div class="house-card-header">
                        <div>
                            <h3 class="unit-number">Unit ${unit}</h3>
                            <p class="block-floor">${blockName} • Floor ${floor}</p>
                        </div>
                        <span class="status-badge ${status}">${status}</span>
                    </div>

                    <div class="house-body">
                        ${!isVacant ? `
                            <p class="resident-name">${resName}</p>
                            <p class="resident-phone">Direct: ${phone}</p>
                            <p class="resident-intercom">Intercom: #${intercom}</p>
                            ${vehicles.length > 0 ? `
                                <p class="vehicle-plates">Plates: ${escapeHtml(vehicles.join(', '))}</p>
                            ` : ''}
                        ` : `
                            <p class="vacant-text">Unit currently vacant.</p>
                        `}
                    </div>
                </div>

                <div class="house-actions">
                    <button type="button" class="btn-intercom" data-unit="${unit}" data-name="${resName}" data-intercom="${intercom}">
                        <span class="material-symbols-outlined" style="font-size: 16px;">phone_in_talk</span>
                        <span>Intercom</span>
                    </button>
                    <a href="/pages/guard/visitor_checkin.php?unit=${encodeURIComponent(unit)}" class="btn-issue-pass">
                        <span class="material-symbols-outlined" style="font-size: 16px;">person_add</span>
                        <span>Issue Pass</span>
                    </a>
                </div>
            </div>
        `;
    }).join('');

    // Attach intercom events
    elements.housesGrid.querySelectorAll('.btn-intercom').forEach(btn => {
        btn.addEventListener('click', () => {
            const unit = btn.getAttribute('data-unit');
            const name = btn.getAttribute('data-name');
            const intercom = btn.getAttribute('data-intercom');
            openIntercom(unit, name, intercom);
        });
    });
}

function openIntercom(unit, name, intercom) {
    state.callingHouse = { unit, name, intercom };

    if (elements.modalTitle) elements.modalTitle.textContent = `Intercom Terminal: Unit ${unit}`;
    if (elements.modalSubtitle) elements.modalSubtitle.textContent = `Connecting to #${intercom} (${name})`;
    if (elements.intercomActiveText) elements.intercomActiveText.textContent = `Intercom Active: #${intercom}`;

    if (elements.intercomModal) elements.intercomModal.style.display = 'flex';
}

function closeIntercom() {
    if (elements.intercomModal) elements.intercomModal.style.display = 'none';
    state.callingHouse = null;
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();

    elements.searchInput?.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderHouses();
    });

    elements.blockSelect?.addEventListener('change', (e) => {
        state.selectedBlock = e.target.value;
        renderHouses();
    });

    elements.modalClose?.addEventListener('click', closeIntercom);

    elements.btnEndIntercom?.addEventListener('click', () => {
        if (state.callingHouse) {
            showToast(`Intercom call to Unit ${state.callingHouse.unit} ended.`, 'info');
        }
        closeIntercom();
    });
});