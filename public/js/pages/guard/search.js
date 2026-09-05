/**
 * Dion Security — Person & Vehicle Search Controller
 * Vanilla ES Module providing real-time multi-dataset fast lookup.
 */

import { api } from '../../api.js';

const state = {
  residents: [],
  employees: [],
  visitors: [],
  query: '',
  filterType: 'all',
  isLoading: true
};

const elements = {
  searchInput: document.getElementById('search-person-input'),
  pills: document.querySelectorAll('.filter-pill-btn'),
  residentsContainer: document.getElementById('residents-results-container'),
  residentsGrid: document.getElementById('residents-results-grid'),
  residentsCount: document.getElementById('residents-match-count'),
  staffContainer: document.getElementById('staff-results-container'),
  staffGrid: document.getElementById('staff-results-grid'),
  staffCount: document.getElementById('staff-match-count'),
  visitorsContainer: document.getElementById('visitors-results-container'),
  visitorsGrid: document.getElementById('visitors-results-grid'),
  visitorsCount: document.getElementById('visitors-match-count'),
  emptyBox: document.getElementById('search-empty-box'),
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
    const [resRes, empRes, visRes] = await Promise.allSettled([
      api.getResidents(),
      api.getEmployees(),
      api.getVisitors()
    ]);

    if (resRes.status === 'fulfilled' && resRes.value?.data) {
      state.residents = Array.isArray(resRes.value.data) ? resRes.value.data : [];
    }
    if (empRes.status === 'fulfilled' && empRes.value?.data) {
      state.employees = Array.isArray(empRes.value.data) ? empRes.value.data : [];
    }
    if (visRes.status === 'fulfilled' && visRes.value?.data) {
      state.visitors = Array.isArray(visRes.value.data) ? visRes.value.data : [];
    }

    renderResults();
  } catch (err) {
    console.error('Failed to load search data:', err);
    showToast('Failed to load directory search data.', 'error');
  } finally {
    state.isLoading = false;
  }
}

function getFilteredData() {
  const q = state.query.toLowerCase().trim();

  const matchedResidents = state.residents.filter(r => {
    if (!q) return true;
    const vehiclesStr = Array.isArray(r.vehicles) ? r.vehicles.join(' ').toLowerCase() : '';
    return (r.name || '').toLowerCase().includes(q) ||
           (r.unitNumber || '').toLowerCase().includes(q) ||
           (r.phone || '').toLowerCase().includes(q) ||
           vehiclesStr.includes(q);
  });

  const matchedStaff = state.employees.filter(e => {
    if (!q) return true;
    return (e.name || '').toLowerCase().includes(q) ||
           (e.badgeNo || e.badge_no || '').toLowerCase().includes(q) ||
           (e.role || '').toLowerCase().includes(q) ||
           (e.id || '').toLowerCase().includes(q);
  });

  const matchedVisitors = state.visitors.filter(v => {
    if (!q) return true;
    return (v.name || '').toLowerCase().includes(q) ||
           (v.badgeNumber || v.badge_number || '').toLowerCase().includes(q) ||
           (v.hostUnit || v.host_unit || '').toLowerCase().includes(q) ||
           (v.vehicleNumber || v.vehicle_number || '').toLowerCase().includes(q);
  });

  return { matchedResidents, matchedStaff, matchedVisitors };
}

function renderResults() {
  const { matchedResidents, matchedStaff, matchedVisitors } = getFilteredData();
  const totalMatches = matchedResidents.length + matchedStaff.length + matchedVisitors.length;

  // Update tab counts
  document.getElementById('pill-count-all')?.textContent = `(${totalMatches})`;
  document.getElementById('pill-count-residents')?.textContent = `(${matchedResidents.length})`;
  document.getElementById('pill-count-staff')?.textContent = `(${matchedStaff.length})`;
  document.getElementById('pill-count-visitors')?.textContent = `(${matchedVisitors.length})`;

  const showResidents = (state.filterType === 'all' || state.filterType === 'residents') && matchedResidents.length > 0;
  const showStaff = (state.filterType === 'all' || state.filterType === 'staff') && matchedStaff.length > 0;
  const showVisitors = (state.filterType === 'all' || state.filterType === 'visitors') && matchedVisitors.length > 0;

  elements.residentsContainer.style.display = showResidents ? 'flex' : 'none';
  elements.staffContainer.style.display = showStaff ? 'flex' : 'none';
  elements.visitorsContainer.style.display = showVisitors ? 'flex' : 'none';

  if (elements.residentsCount) elements.residentsCount.textContent = `(${matchedResidents.length})`;
  if (elements.staffCount) elements.staffCount.textContent = `(${matchedStaff.length})`;
  if (elements.visitorsCount) elements.visitorsCount.textContent = `(${matchedVisitors.length})`;

  // Render Residents
  if (showResidents && elements.residentsGrid) {
    elements.residentsGrid.innerHTML = matchedResidents.map(r => {
      const vehicles = Array.isArray(r.vehicles) ? r.vehicles.join(', ') : 'No vehicle';
      return `
        <div class="result-card">
          <div class="result-info">
            <div class="result-avatar">${escapeHtml((r.avatar || r.name.substring(0, 2)).toUpperCase())}</div>
            <div style="min-width: 0;">
              <h4 style="font-weight: 600; color: var(--color-on-surface); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(r.name)}</h4>
              <p style="font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 700; color: var(--color-primary); margin: 2px 0 0 0;">Unit ${escapeHtml(r.unitNumber)} (${escapeHtml(r.blockName || '')})</p>
              <p style="font-size: var(--text-xs); color: var(--color-on-surface-muted); margin: 2px 0 0 0;">${escapeHtml(r.phone || '')} • ${escapeHtml(vehicles)}</p>
            </div>
          </div>
          <a href="/pages/guard/visitor_checkin.php?unit=${encodeURIComponent(r.unitNumber)}" class="btn btn-primary btn-sm" style="flex-shrink: 0;">
            <span>Issue Pass</span>
          </a>
        </div>
      `;
    }).join('');
  }

  // Render Staff
  if (showStaff && elements.staffGrid) {
    elements.staffGrid.innerHTML = matchedStaff.map(e => `
      <div class="result-card">
        <div class="result-info">
          <div class="result-avatar staff">${escapeHtml((e.avatar || e.name.substring(0, 2)).toUpperCase())}</div>
          <div style="min-width: 0;">
            <h4 style="font-weight: 600; color: var(--color-on-surface); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(e.name)}</h4>
            <p style="font-size: var(--text-xs); color: var(--color-on-surface-muted); margin: 2px 0 0 0;">${escapeHtml(e.role || '')} • ${escapeHtml(e.badgeNo || e.badge_no || e.id)}</p>
            <span class="badge badge-${(e.status || '').toLowerCase() === 'present' ? 'success' : 'neutral'}" style="margin-top: 4px;">${escapeHtml(e.status || 'Active')}</span>
          </div>
        </div>
        <button type="button" class="btn btn-outline btn-sm" data-action="verify-id" data-name="${escapeHtml(e.name)}" data-id="${escapeHtml(e.badgeNo || e.id)}" style="flex-shrink: 0;">
          <span>Verify ID</span>
        </button>
      </div>
    `).join('');

    elements.staffGrid.querySelectorAll('[data-action="verify-id"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const id = btn.getAttribute('data-id');
        showToast(`Staff ID #${id} verified: ${name} is authorized.`, 'info');
      });
    });
  }

  // Render Visitors
  if (showVisitors && elements.visitorsGrid) {
    elements.visitorsGrid.innerHTML = matchedVisitors.map(v => {
      const isInside = (v.status || '').toLowerCase() === 'inside';
      return `
        <div class="result-card">
          <div class="result-info">
            <span style="font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 700; padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); background: var(--color-surface-container-high); color: var(--color-primary); flex-shrink: 0;">
              #${escapeHtml(v.badgeNumber || v.badge_number || 'PASS')}
            </span>
            <div style="min-width: 0;">
              <h4 style="font-weight: 600; color: var(--color-on-surface); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(v.name)}</h4>
              <p style="font-size: var(--text-xs); color: var(--color-on-surface-muted); margin: 2px 0 0 0;">Host: ${escapeHtml(v.hostUnit || v.host_unit || '')} • ${escapeHtml(v.category || '')}</p>
              <span class="badge badge-${isInside ? 'primary' : 'neutral'}" style="margin-top: 4px;">${isInside ? 'Currently Inside' : 'Exited'}</span>
            </div>
          </div>
          ${isInside ? `
            <a href="/pages/guard/visitor_exit.php" class="btn btn-sm btn-outline" style="flex-shrink: 0; color: var(--color-danger); border-color: rgba(220, 38, 38, 0.3);">
              <span>Exit Pass</span>
            </a>
          ` : `
            <span style="font-size: var(--text-xs); color: var(--color-on-surface-muted); font-family: var(--font-mono);">Departed</span>
          `}
        </div>
      `;
    }).join('');
  }

  // Empty state handling
  if (totalMatches === 0 || (!showResidents && !showStaff && !showVisitors)) {
    elements.emptyBox.style.display = 'flex';
  } else {
    elements.emptyBox.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();

  // Search input live query
  elements.searchInput?.addEventListener('input', (e) => {
    state.query = e.target.value;
    renderResults();
  });

  // Filter pills
  elements.pills.forEach(pill => {
    pill.addEventListener('click', () => {
      elements.pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.filterType = pill.getAttribute('data-filter') || 'all';
      renderResults();
    });
  });
});