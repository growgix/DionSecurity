/**
 * Dion Security — Visitor Exit & Pass Return Controller
 * Vanilla ES Module providing RFID badge scanning, pass verification, and turnstile checkout.
 */

import { api } from '../../api.js';

const state = {
  visitors: [],
  currentlyInside: [],
  selectedVisitor: null,
  isProcessing: false
};

const elements = {
  scanInput: document.getElementById('scan-badge-input'),
  scanForm: document.getElementById('scanner-form'),
  chipContainer: document.getElementById('quick-chips-container'),
  verificationCard: document.getElementById('verification-card'),
  
  // Verification details
  vAvatar: document.getElementById('v-avatar'),
  vName: document.getElementById('v-name'),
  vBadge: document.getElementById('v-badge'),
  vCategory: document.getElementById('v-category'),
  vHost: document.getElementById('v-host-unit'),
  vVehicle: document.getElementById('v-vehicle'),
  vEntryTime: document.getElementById('v-entry-time'),
  vDuration: document.getElementById('v-duration'),
  
  btnAuthorizeExit: document.getElementById('btn-authorize-exit'),
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

async function loadVisitors() {
  try {
    const res = await api.getVisitors();
    state.visitors = (res && res.data) ? res.data : [];
    state.currentlyInside = state.visitors.filter(v => (v.status || '').toLowerCase() === 'inside');
    renderQuickChips();
  } catch (err) {
    console.error('Failed to load visitors for exit:', err);
    showToast('Failed to load active visitor passes.', 'error');
  }
}

function renderQuickChips() {
  if (!elements.chipContainer) return;

  if (state.currentlyInside.length === 0) {
    elements.chipContainer.innerHTML = '<span style="font-size: var(--text-xs); color: var(--color-on-surface-muted);">No active visitors currently on premises.</span>';
    return;
  }

  elements.chipContainer.innerHTML = state.currentlyInside.map(v => {
    const isSelected = state.selectedVisitor?.id === v.id;
    const badge = escapeHtml(v.badgeNumber || v.badge_number || 'PASS');
    const name = escapeHtml(v.name || 'Visitor');

    return `
      <button type="button" class="chip-btn ${isSelected ? 'selected' : ''}" data-id="${escapeHtml(v.id)}">
        <span style="font-family: var(--font-mono); font-weight: 700; margin-right: 4px;">#${badge}</span>
        <span>${name}</span>
      </button>
    `;
  }).join('');

  elements.chipContainer.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const vid = btn.getAttribute('data-id');
      const v = state.currentlyInside.find(item => String(item.id) === String(vid));
      if (v) selectVisitor(v);
    });
  });
}

function selectVisitor(visitor) {
  state.selectedVisitor = visitor;
  renderQuickChips();

  if (!visitor) {
    if (elements.verificationCard) elements.verificationCard.style.display = 'none';
    return;
  }

  const badge = visitor.badgeNumber || visitor.badge_number || 'PASS';
  const name = visitor.name || 'Visitor';
  const avatar = (visitor.avatar || name.substring(0, 2)).toUpperCase();
  const category = visitor.category || 'Guest';
  const host = visitor.hostUnit || visitor.host_unit || 'A-101';
  const vehicle = visitor.vehicleNumber || visitor.vehicle_number || 'Walk-in';
  const entryTime = visitor.entryTime || visitor.entry_time || '—';
  const duration = visitor.duration || 'Just now';

  if (elements.vAvatar) elements.vAvatar.textContent = avatar;
  if (elements.vName) elements.vName.textContent = name;
  if (elements.vBadge) elements.vBadge.textContent = `#${badge}`;
  if (elements.vCategory) elements.vCategory.textContent = category;
  if (elements.vHost) elements.vHost.textContent = host;
  if (elements.vVehicle) elements.vVehicle.textContent = vehicle;
  if (elements.vEntryTime) elements.vEntryTime.textContent = entryTime;
  if (elements.vDuration) elements.vDuration.textContent = duration;

  if (elements.verificationCard) {
    elements.verificationCard.style.display = 'flex';
    elements.verificationCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

async function handleAuthorizeExit() {
  if (!state.selectedVisitor || state.isProcessing) return;
  const visitor = state.selectedVisitor;

  try {
    state.isProcessing = true;
    if (elements.btnAuthorizeExit) {
      elements.btnAuthorizeExit.disabled = true;
      elements.btnAuthorizeExit.innerHTML = `
        <span class="material-symbols-outlined spin" style="font-size: 18px;">progress_activity</span>
        <span>Revoking Pass & Logging Exit...</span>
      `;
    }

    await api.checkoutVisitor(visitor.id);

    showToast(`Pass #${visitor.badgeNumber || visitor.badge_number} surrendered. Turnstile checkout logged for ${visitor.name}.`, 'success');

    // Remove from local list
    state.currentlyInside = state.currentlyInside.filter(v => v.id !== visitor.id);
    selectVisitor(null);
    if (elements.scanInput) elements.scanInput.value = '';
    renderQuickChips();
  } catch (err) {
    console.error('Exit authorization failed:', err);
    showToast(`Exit checkout failed: ${err.message || 'Server error'}`, 'error');
  } finally {
    state.isProcessing = false;
    if (elements.btnAuthorizeExit) {
      elements.btnAuthorizeExit.disabled = false;
      elements.btnAuthorizeExit.innerHTML = `
        <span class="material-symbols-outlined" style="font-size: 18px;">logout</span>
        <span>Authorize Exit & Revoke Badge</span>
      `;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadVisitors();

  elements.scanForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = (elements.scanInput?.value || '').trim().toLowerCase();
    if (!query) return;

    const found = state.currentlyInside.find(v => {
      const b = (v.badgeNumber || v.badge_number || '').toLowerCase();
      const n = (v.name || '').toLowerCase();
      return b === query || b.includes(query) || n.includes(query);
    });

    if (found) {
      selectVisitor(found);
    } else {
      showToast(`No active visitor pass matching "${elements.scanInput?.value}" found.`, 'warning');
    }
  });

  elements.btnAuthorizeExit?.addEventListener('click', handleAuthorizeExit);
});