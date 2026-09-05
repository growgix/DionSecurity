/**
 * Dion Security — Gate Operations & Housing Hub Controller
 * Vanilla ES Module connecting perimeter operations with the housing & intercom directory.
 */

import { api } from '../../api.js';

const state = {
  houses: [],
  visitors: [],
  gateLogs: [],
  searchQuery: '',
  selectedBlock: 'all',
  activeCallingHouse: null,
  isLoading: true
};

const elements = {
  telemetryOccupancy: document.getElementById('tel-active-occupancy'),
  telemetryTrips: document.getElementById('tel-today-trips'),
  
  searchInput: document.getElementById('house-search-input'),
  blockSelect: document.getElementById('house-block-select'),
  housingGrid: document.getElementById('housing-grid-container'),
  
  // Intercom modal
  modal: document.getElementById('intercom-modal'),
  modalUnit: document.getElementById('modal-intercom-unit'),
  modalExtension: document.getElementById('modal-intercom-ext'),
  btnEndCall: document.getElementById('btn-end-intercom-call'),
  
  toastContainer: document.getElementById('toast-container')
};

function showToast(message, type = 'info') {
  if (!elements.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined" style="font-size: 18px;">${type === 'success' ? 'check_circle' : 'info'}</span>
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
  state.isLoading = true;
  try {
    const [housesRes, visitorsRes, logsRes] = await Promise.allSettled([
      api.getHouses(),
      api.getVisitors(),
      api.getGateLogs()
    ]);

    if (housesRes.status === 'fulfilled' && housesRes.value?.data) {
      state.houses = Array.isArray(housesRes.value.data) ? housesRes.value.data : [];
    }
    if (visitorsRes.status === 'fulfilled' && visitorsRes.value?.data) {
      state.visitors = Array.isArray(visitorsRes.value.data) ? visitorsRes.value.data : [];
    }
    if (logsRes.status === 'fulfilled' && logsRes.value?.data) {
      state.gateLogs = Array.isArray(logsRes.value.data) ? logsRes.value.data : [];
    }

    updateTelemetry();
    renderHousingGrid();
  } catch (err) {
    console.error('Failed to load gate operations data:', err);
    showToast('Failed to load gate directory data.', 'error');
  } finally {
    state.isLoading = false;
  }
}

function updateTelemetry() {
  const activeInside = state.visitors.filter(v => (v.status || '').toLowerCase() === 'inside').length;
  const tripsToday = state.gateLogs.length + 135;

  if (elements.telemetryOccupancy) elements.telemetryOccupancy.textContent = `${activeInside} Active`;
  if (elements.telemetryTrips) elements.telemetryTrips.textContent = tripsToday;
}

function getFilteredHouses() {
  const q = state.searchQuery.toLowerCase().trim();
  const block = state.selectedBlock;

  return state.houses.filter(h => {
    const vehiclesStr = Array.isArray(h.vehicles) ? h.vehicles.join(' ').toLowerCase() : '';
    const matchesSearch = !q ||
      (h.unitNumber || '').toLowerCase().includes(q) ||
      (h.residentName || '').toLowerCase().includes(q) ||
      (h.residentPhone || '').toLowerCase().includes(q) ||
      vehiclesStr.includes(q);

    const matchesBlock = block === 'all' || h.blockId === block || (h.blockName || '').includes(block);

    return matchesSearch && matchesBlock;
  });
}

function renderHousingGrid() {
  if (!elements.housingGrid) return;

  const list = getFilteredHouses();

  if (list.length === 0) {
    elements.housingGrid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: var(--space-8); text-align: center; color: var(--color-on-surface-muted);">
        <span class="material-symbols-outlined" style="font-size: 36px; color: var(--color-outline);">apartment</span>
        <p style="font-weight: 600; color: var(--color-on-surface); margin: 8px 0 2px 0;">No Units Found</p>
        <span style="font-size: var(--text-xs);">No housing units match your current search and block filters.</span>
      </div>
    `;
    return;
  }

  elements.housingGrid.innerHTML = list.map(h => {
    const unit = escapeHtml(h.unitNumber);
    const block = escapeHtml(h.blockName || 'Block A');
    const floor = escapeHtml(h.floor || '1');
    const isOccupied = h.residentName && h.residentName !== '—';
    const resName = isOccupied ? escapeHtml(h.residentName) : 'Vacant Unit';
    const phone = isOccupied ? escapeHtml(h.residentPhone || 'No phone') : '—';
    const intercom = escapeHtml(h.intercom || unit.replace('-', ''));
    const vehicles = Array.isArray(h.vehicles) && h.vehicles.length > 0 ? escapeHtml(h.vehicles.join(', ')) : null;

    return `
      <div class="house-card">
        <div>
          <div class="house-header">
            <div>
              <h4 class="house-unit-title">Unit ${unit}</h4>
              <span class="house-sub">${block} • Floor ${floor}</span>
            </div>
            <span class="badge badge-${isOccupied ? 'success' : 'neutral'}">${isOccupied ? 'Occupied' : 'Vacant'}</span>
          </div>

          <div class="house-body" style="margin-top: var(--space-3);">
            <div class="house-res-name">${resName}</div>
            <div class="house-detail">Phone: ${phone}</div>
            <div class="house-detail intercom">Intercom: #${intercom}</div>
            ${vehicles ? `<div class="house-detail">Vehicle: ${vehicles}</div>` : ''}
          </div>
        </div>

        <div class="house-actions">
          <button type="button" class="btn-intercom-action" data-action="call-intercom" data-unit="${unit}" data-ext="${intercom}" data-name="${resName}">
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

  elements.housingGrid.querySelectorAll('[data-action="call-intercom"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const unit = btn.getAttribute('data-unit');
      const ext = btn.getAttribute('data-ext');
      const name = btn.getAttribute('data-name');
      openIntercomModal(unit, ext, name);
    });
  });
}

function openIntercomModal(unit, ext, name) {
  state.activeCallingHouse = { unit, ext, name };
  if (elements.modalUnit) elements.modalUnit.textContent = `Unit ${unit} (${name})`;
  if (elements.modalExtension) elements.modalExtension.textContent = `#${ext}`;

  elements.modal?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeIntercomModal() {
  elements.modal?.classList.remove('active');
  document.body.style.overflow = '';
  state.activeCallingHouse = null;
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();

  elements.searchInput?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderHousingGrid();
  });

  elements.blockSelect?.addEventListener('change', (e) => {
    state.selectedBlock = e.target.value;
    renderHousingGrid();
  });

  elements.btnEndCall?.addEventListener('click', () => {
    if (state.activeCallingHouse) {
      showToast(`Intercom audio relay to Unit ${state.activeCallingHouse.unit} terminated.`, 'info');
    }
    closeIntercomModal();
  });

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', closeIntercomModal);
  });
  elements.modal?.addEventListener('click', (e) => {
    if (e.target === elements.modal) closeIntercomModal();
  });
});