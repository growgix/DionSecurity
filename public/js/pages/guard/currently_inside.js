/**
 * Dion Security — Currently Inside Premises Controller
 * Vanilla ES Module providing real-time live occupancy monitoring and fast checkout.
 */

import { api } from '../../api.js';

const state = {
  visitors: [],
  currentlyInside: [],
  searchQuery: '',
  selectedCategory: 'all',
  targetVisitor: null,
  isLoading: true
};

const elements = {
  kpiTotal: document.getElementById('kpi-active-occupancy'),
  kpiGuests: document.getElementById('kpi-guests-count'),
  kpiDelivery: document.getElementById('kpi-delivery-count'),
  kpiContractors: document.getElementById('kpi-contractors-count'),
  
  searchInput: document.getElementById('inside-search-input'),
  categorySelect: document.getElementById('inside-category-select'),
  btnExport: document.getElementById('btn-export-snapshot'),
  
  tbody: document.getElementById('inside-table-tbody'),
  
  // Modal
  modal: document.getElementById('inside-checkout-modal'),
  modalVisitorName: document.getElementById('modal-visitor-name'),
  modalBadge: document.getElementById('modal-pass-badge'),
  modalHost: document.getElementById('modal-host-unit'),
  modalVehicle: document.getElementById('modal-vehicle'),
  modalEntryTime: document.getElementById('modal-entry-time'),
  btnConfirmCheckout: document.getElementById('btn-confirm-checkout'),
  
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
    const res = await api.getVisitors();
    state.visitors = (res && res.data) ? res.data : [];
    updateInsideList();
  } catch (err) {
    console.error('Failed to load visitors:', err);
    showToast('Failed to load active visitor registry.', 'error');
  } finally {
    state.isLoading = false;
  }
}

function updateInsideList() {
  state.currentlyInside = state.visitors.filter(v => (v.status || '').toLowerCase() === 'inside');
  updateKPIs();
  renderTable();
}

function updateKPIs() {
  const total = state.currentlyInside.length;
  const guests = state.currentlyInside.filter(v => (v.category || '').includes('Guest')).length;
  const delivery = state.currentlyInside.filter(v => {
    const c = v.category || '';
    return c.includes('Cab') || c.includes('Delivery') || c.includes('Food');
  }).length;
  const contractors = state.currentlyInside.filter(v => {
    const c = v.category || '';
    return c.includes('Contractor') || c.includes('Service');
  }).length;

  if (elements.kpiTotal) elements.kpiTotal.textContent = total;
  if (elements.kpiGuests) elements.kpiGuests.textContent = guests;
  if (elements.kpiDelivery) elements.kpiDelivery.textContent = delivery;
  if (elements.kpiContractors) elements.kpiContractors.textContent = contractors;
}

function getFilteredVisitors() {
  const q = state.searchQuery.toLowerCase().trim();
  const cat = state.selectedCategory.toLowerCase();

  return state.currentlyInside.filter(v => {
    const matchesSearch = !q ||
      (v.name || '').toLowerCase().includes(q) ||
      (v.badgeNumber || v.badge_number || '').toLowerCase().includes(q) ||
      (v.hostUnit || v.host_unit || '').toLowerCase().includes(q) ||
      (v.vehicleNumber || v.vehicle_number || '').toLowerCase().includes(q);

    let matchesCategory = true;
    if (cat !== 'all') {
      matchesCategory = (v.category || '').toLowerCase().includes(cat);
    }

    return matchesSearch && matchesCategory;
  });
}

function renderTable() {
  if (!elements.tbody) return;

  const list = getFilteredVisitors();

  if (list.length === 0) {
    elements.tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-10 text-secondary">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
            <span class="material-symbols-outlined" style="font-size: 36px; color: var(--color-outline);">group_off</span>
            <span style="font-size: var(--text-base); font-weight: 600; color: var(--color-on-surface);">No Active Visitors Found</span>
            <span style="font-size: var(--text-xs); color: var(--color-on-surface-muted);">
              ${state.searchQuery ? 'No active visitors match your search.' : 'All registered visitors have checked out.'}
            </span>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  elements.tbody.innerHTML = list.map(v => {
    const id = escapeHtml(v.id);
    const badge = escapeHtml(v.badgeNumber || v.badge_number || 'PASS');
    const name = escapeHtml(v.name || 'Visitor');
    const category = escapeHtml(v.category || 'Guest');
    const hostUnit = escapeHtml(v.hostUnit || v.host_unit || 'A-101');
    const hostRes = escapeHtml(v.hostResident || v.host_resident || '');
    const host = hostRes ? `${hostUnit} (${hostRes})` : hostUnit;
    const vehicle = escapeHtml(v.vehicleNumber || v.vehicle_number || 'Walk-in');
    const entryTime = escapeHtml(v.entryTime || v.entry_time || '—');
    const duration = escapeHtml(v.duration || 'Just now');

    return `
      <tr>
        <td class="py-3.5 px-space-lg">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="pass-badge">#${badge}</span>
            <span style="font-weight: 600; color: var(--color-on-surface);">${name}</span>
          </div>
        </td>
        <td class="py-3.5 px-space-md">
          <span class="category-tag">${category}</span>
        </td>
        <td class="py-3.5 px-space-md font-mono" style="font-size: var(--text-xs); font-weight: 600; color: var(--color-primary);">
          ${host}
        </td>
        <td class="py-3.5 px-space-md font-mono" style="font-size: var(--text-xs); color: var(--color-on-surface-muted);">
          ${vehicle}
        </td>
        <td class="py-3.5 px-space-md font-mono" style="font-size: var(--text-xs); color: var(--color-on-surface-muted);">
          ${entryTime}
        </td>
        <td class="py-3.5 px-space-md font-mono" style="font-size: var(--text-xs); font-weight: 700; color: var(--color-primary);">
          ${duration}
        </td>
        <td class="py-3.5 px-space-lg text-right">
          <button type="button" class="btn-checkout" data-action="checkout" data-id="${id}">
            <span class="material-symbols-outlined" style="font-size: 16px;">logout</span>
            <span>Check Out</span>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  elements.tbody.querySelectorAll('[data-action="checkout"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const vid = btn.getAttribute('data-id');
      const target = state.currentlyInside.find(v => String(v.id) === String(vid));
      if (target) openCheckoutModal(target);
    });
  });
}

function openCheckoutModal(visitor) {
  state.targetVisitor = visitor;
  if (elements.modalVisitorName) elements.modalVisitorName.textContent = visitor.name;
  if (elements.modalBadge) elements.modalBadge.textContent = `#${visitor.badgeNumber || visitor.badge_number || 'PASS'}`;
  if (elements.modalHost) elements.modalHost.textContent = visitor.hostUnit || visitor.host_unit;
  if (elements.modalVehicle) elements.modalVehicle.textContent = visitor.vehicleNumber || visitor.vehicle_number || 'Walk-in';
  if (elements.modalEntryTime) elements.modalEntryTime.textContent = visitor.entryTime || visitor.entry_time || '—';

  elements.modal?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
  elements.modal?.classList.remove('active');
  document.body.style.overflow = '';
  state.targetVisitor = null;
}

async function handleConfirmCheckout() {
  if (!state.targetVisitor) return;
  const visitor = state.targetVisitor;

  try {
    if (elements.btnConfirmCheckout) {
      elements.btnConfirmCheckout.disabled = true;
      elements.btnConfirmCheckout.innerHTML = `
        <span class="material-symbols-outlined spin" style="font-size: 16px;">progress_activity</span>
        <span>Checking out...</span>
      `;
    }

    await api.checkoutVisitor(visitor.id);

    visitor.status = 'exited';
    visitor.exitTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    updateInsideList();
    showToast(`Visitor ${visitor.name} checked out. Pass #${visitor.badgeNumber || visitor.badge_number} surrendered.`, 'success');
    closeCheckoutModal();
  } catch (err) {
    console.error('Checkout failed:', err);
    showToast(`Checkout failed: ${err.message || 'Server error'}`, 'error');
  } finally {
    if (elements.btnConfirmCheckout) {
      elements.btnConfirmCheckout.disabled = false;
      elements.btnConfirmCheckout.innerHTML = `
        <span class="material-symbols-outlined" style="font-size: 18px;">check</span>
        <span>Confirm Exit & Surrender Badge</span>
      `;
    }
  }
}

function exportSnapshotCSV() {
  const list = state.currentlyInside;
  if (list.length === 0) {
    showToast('No active visitors inside to export.', 'info');
    return;
  }

  const headers = ['Pass ID', 'Visitor Name', 'Category', 'Host Unit', 'Vehicle', 'Entry Time', 'Status'];
  const rows = list.map(v => [
    `"${v.badgeNumber || v.badge_number || ''}"`,
    `"${v.name || ''}"`,
    `"${v.category || ''}"`,
    `"${v.hostUnit || v.host_unit || ''}"`,
    `"${v.vehicleNumber || v.vehicle_number || ''}"`,
    `"${v.entryTime || v.entry_time || ''}"`,
    `"Inside"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `dion_live_occupancy_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Occupancy snapshot downloaded.', 'info');
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();

  elements.searchInput?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderTable();
  });

  elements.categorySelect?.addEventListener('change', (e) => {
    state.selectedCategory = e.target.value;
    renderTable();
  });

  elements.btnExport?.addEventListener('click', exportSnapshotCSV);

  elements.btnConfirmCheckout?.addEventListener('click', handleConfirmCheckout);

  // Close modal listeners
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', closeCheckoutModal);
  });
  elements.modal?.addEventListener('click', (e) => {
    if (e.target === elements.modal) closeCheckoutModal();
  });
});