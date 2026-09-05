/**
 * Dion Security — Guard Command Center (Dashboard) Controller
 * Vanilla ES Module with dynamic data hydration, hotkeys, and operational controls.
 */

import { api } from '../../api.js';

// State container
const state = {
  visitors: [],
  employees: [],
  gateLogs: [],
  currentlyInside: [],
  targetCheckoutVisitor: null,
  isLoading: true
};

// DOM Cache
const elements = {
  // Banner
  errorBanner: document.getElementById('dashboard-error-banner'),
  
  // Telemetry
  clockDisplay: document.getElementById('gate-clock-display'),
  visitorsTodayCount: document.getElementById('count-visitors-today'),
  visitorsInsideCount: document.getElementById('count-visitors-inside'),
  visitorsInsideBar: document.getElementById('bar-visitors-inside'),
  staffDutyCount: document.getElementById('count-staff-duty'),
  staffDutyBar: document.getElementById('bar-staff-duty'),
  insideActiveBadge: document.getElementById('inside-active-badge'),
  
  // Table
  tbodyInside: document.getElementById('inside-visitors-tbody'),
  
  // Modals
  fastExitModal: document.getElementById('fast-exit-modal'),
  exitVisitorName: document.getElementById('exit-visitor-name'),
  exitBadgeNumber: document.getElementById('exit-badge-number'),
  exitHostUnit: document.getElementById('exit-host-unit'),
  exitVehicle: document.getElementById('exit-vehicle'),
  exitEntryTime: document.getElementById('exit-entry-time'),
  confirmExitBtn: document.getElementById('confirm-exit-btn'),
  
  panicModal: document.getElementById('panic-modal'),
  openPanicBtn: document.getElementById('open-panic-btn'),
  panicLocationInput: document.getElementById('panic-location-input'),
  panicReasonInput: document.getElementById('panic-reason-input'),
  confirmPanicBtn: document.getElementById('confirm-panic-btn'),
  
  // Toast container
  toastContainer: document.getElementById('toast-container')
};

/**
 * Toast Notification Dispatcher
 */
function showToast(message, type = 'info') {
  if (!elements.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const iconMap = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info'
  };
  const icon = iconMap[type] || 'info';
  
  toast.innerHTML = `
    <span class="material-symbols-outlined" style="font-size: 18px;">${icon}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
    <button type="button" class="toast-close" aria-label="Close">&times;</button>
  `;
  
  toast.querySelector('.toast-close')?.addEventListener('click', () => {
    toast.remove();
  });
  
  elements.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Live Clock Ticker
 */
function initClock() {
  function updateClock() {
    const now = new Date();
    if (elements.clockDisplay) {
      elements.clockDisplay.textContent = now.toLocaleTimeString('en-US', { hour12: true });
    }
  }
  updateClock();
  setInterval(updateClock, 1000);
}

/**
 * Keyboard Shortcuts (F1 - F4)
 */
function initHotkeys() {
  window.addEventListener('keydown', (e) => {
    // Ignore when focus is inside an input, textarea, or select
    const tag = (document.activeElement && document.activeElement.tagName) || '';
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag.toUpperCase())) {
      return;
    }

    if (e.key === 'F1') {
      e.preventDefault();
      window.location.href = '/pages/guard/visitor_checkin.php';
    } else if (e.key === 'F2') {
      e.preventDefault();
      window.location.href = '/pages/guard/search.php';
    } else if (e.key === 'F3') {
      e.preventDefault();
      window.location.href = '/pages/guard/worker_entry.php';
    } else if (e.key === 'F4') {
      e.preventDefault();
      window.location.href = '/pages/guard/worker_exit.php';
    }
  });
}

/**
 * Data Hydration & Fetching
 */
async function loadDashboardData() {
  state.isLoading = true;
  if (elements.errorBanner) elements.errorBanner.style.display = 'none';

  try {
    const [visitorsRes, employeesRes, logsRes] = await Promise.allSettled([
      api.getVisitors(),
      api.getEmployees(),
      api.getGateLogs()
    ]);

    if (visitorsRes.status === 'fulfilled' && visitorsRes.value?.data) {
      state.visitors = Array.isArray(visitorsRes.value.data) ? visitorsRes.value.data : [];
    } else {
      state.visitors = [];
    }

    if (employeesRes.status === 'fulfilled' && employeesRes.value?.data) {
      state.employees = Array.isArray(employeesRes.value.data) ? employeesRes.value.data : [];
    } else {
      state.employees = [];
    }

    if (logsRes.status === 'fulfilled' && logsRes.value?.data) {
      state.gateLogs = Array.isArray(logsRes.value.data) ? logsRes.value.data : [];
    } else {
      state.gateLogs = [];
    }

    updateTelemetry();
    renderInsideTable();
  } catch (err) {
    console.error('Failed to load guard dashboard data:', err);
    if (elements.errorBanner) {
      elements.errorBanner.style.display = 'block';
      elements.errorBanner.textContent = 'Failed to load telemetry or active visitor ledger. Please refresh the page.';
    }
    showToast('Failed to connect to backend telemetry stream.', 'error');
  } finally {
    state.isLoading = false;
  }
}

/**
 * Telemetry Calculations & Updates
 */
function updateTelemetry() {
  // Visitors inside
  state.currentlyInside = state.visitors.filter(v => (v.status || '').toLowerCase() === 'inside');
  
  // Visitors today: visitors + 80 baseline per React code
  const visitorsTodayCount = state.visitors.length + 80;
  if (elements.visitorsTodayCount) {
    elements.visitorsTodayCount.textContent = visitorsTodayCount;
  }

  // Inside count & live occupancy
  if (elements.visitorsInsideCount) {
    elements.visitorsInsideCount.textContent = state.currentlyInside.length;
  }
  if (elements.visitorsInsideBar) {
    const occupancyPercent = Math.min(100, Math.round((state.currentlyInside.length / 30) * 100));
    elements.visitorsInsideBar.style.width = `${occupancyPercent}%`;
  }

  // Staff on duty
  const onDutyWorkers = state.employees.filter(e => {
    const s = (e.status || '').toLowerCase();
    return s === 'present' || s === 'late';
  });
  if (elements.staffDutyCount) {
    elements.staffDutyCount.textContent = onDutyWorkers.length;
  }
  if (elements.staffDutyBar) {
    const dutyPercent = Math.min(100, Math.round((onDutyWorkers.length / 80) * 100));
    elements.staffDutyBar.style.width = `${dutyPercent}%`;
  }

  // Active badge in table header
  if (elements.insideActiveBadge) {
    elements.insideActiveBadge.textContent = `${state.currentlyInside.length} Active`;
  }
}

/**
 * Render Currently Inside Table
 */
function renderInsideTable() {
  if (!elements.tbodyInside) return;

  if (state.currentlyInside.length === 0) {
    elements.tbodyInside.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-8 text-secondary">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 24px 0;">
            <span class="material-symbols-outlined" style="font-size: 32px; color: var(--color-outline);">group_off</span>
            <span style="font-size: var(--text-sm); font-weight: 500;">No active visitors currently on estate premises.</span>
            <span style="font-size: var(--text-xs); color: var(--color-on-surface-muted);">All registered visitors have checked out.</span>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  elements.tbodyInside.innerHTML = state.currentlyInside.map(vis => {
    const id = escapeHtml(vis.id);
    const badge = escapeHtml(vis.badgeNumber || vis.badge_number || 'PASS');
    const name = escapeHtml(vis.name || 'Visitor');
    const category = escapeHtml(vis.category || 'Guest');
    const hostUnit = escapeHtml(vis.hostUnit || vis.host_unit || 'A-101');
    const hostResident = escapeHtml(vis.hostResident || vis.host_resident || '');
    const hostText = hostResident ? `${hostUnit} (${hostResident})` : hostUnit;
    const entryTime = escapeHtml(vis.entryTime || vis.entry_time || '—');
    const vehicle = escapeHtml(vis.vehicleNumber || vis.vehicle_number || 'None');

    return `
      <tr data-visitor-id="${id}">
        <td class="py-3 px-space-lg">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="pass-badge">${badge}</span>
            <span style="font-weight: 600; color: var(--color-on-surface);">${name}</span>
          </div>
        </td>
        <td class="py-3 px-space-md">
          <span class="category-tag">${category}</span>
        </td>
        <td class="py-3 px-space-md" style="font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 500; color: var(--color-on-surface-variant);">
          ${hostText}
        </td>
        <td class="py-3 px-space-md" style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-on-surface-muted);">
          ${entryTime}
        </td>
        <td class="py-3 px-space-md" style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-on-surface-muted);">
          ${vehicle}
        </td>
        <td class="py-3 px-space-lg text-right">
          <button type="button" class="btn-fast-exit" data-action="fast-exit" data-id="${id}">
            <span class="material-symbols-outlined" style="font-size: 16px;">logout</span>
            <span>Exit Pass</span>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // Attach exit listeners
  elements.tbodyInside.querySelectorAll('[data-action="fast-exit"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const visId = btn.getAttribute('data-id');
      const visitor = state.currentlyInside.find(v => String(v.id) === String(visId));
      if (visitor) {
        openFastExitModal(visitor);
      }
    });
  });
}

/**
 * Fast Exit Modal Flow
 */
function openFastExitModal(visitor) {
  state.targetCheckoutVisitor = visitor;

  const badge = visitor.badgeNumber || visitor.badge_number || 'PASS';
  const name = visitor.name || 'Visitor';
  const hostUnit = visitor.hostUnit || visitor.host_unit || 'A-101';
  const hostResident = visitor.hostResident || visitor.host_resident || '';
  const vehicle = visitor.vehicleNumber || visitor.vehicle_number || 'None';
  const entryTime = visitor.entryTime || visitor.entry_time || '—';

  if (elements.exitVisitorName) elements.exitVisitorName.textContent = name;
  if (elements.exitBadgeNumber) elements.exitBadgeNumber.textContent = `#${badge}`;
  if (elements.exitHostUnit) elements.exitHostUnit.textContent = hostResident ? `${hostUnit} (${hostResident})` : hostUnit;
  if (elements.exitVehicle) elements.exitVehicle.textContent = vehicle;
  if (elements.exitEntryTime) elements.exitEntryTime.textContent = entryTime;

  openModal(elements.fastExitModal);
}

async function handleConfirmExit() {
  if (!state.targetCheckoutVisitor) return;

  const visitor = state.targetCheckoutVisitor;
  const originalBtnContent = elements.confirmExitBtn.innerHTML;

  try {
    elements.confirmExitBtn.disabled = true;
    elements.confirmExitBtn.innerHTML = `
      <span class="material-symbols-outlined spin" style="font-size: 16px;">progress_activity</span>
      <span>Checking out...</span>
    `;

    await api.checkoutVisitor(visitor.id);

    // Update local state
    visitor.status = 'exited';
    visitor.exitTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    updateTelemetry();
    renderInsideTable();

    showToast(`Visitor ${visitor.name} successfully checked out. Pass #${visitor.badgeNumber || visitor.badge_number} surrendered.`, 'success');
    closeModal(elements.fastExitModal);
  } catch (err) {
    console.error('Fast checkout failed:', err);
    showToast(`Checkout failed: ${err.message || 'Server error'}`, 'error');
  } finally {
    elements.confirmExitBtn.disabled = false;
    elements.confirmExitBtn.innerHTML = originalBtnContent;
    state.targetCheckoutVisitor = null;
  }
}

/**
 * Emergency Panic Protocol Flow
 */
function openPanicModal() {
  openModal(elements.panicModal);
}

async function handleConfirmPanic() {
  const location = (elements.panicLocationInput && elements.panicLocationInput.value.trim()) || 'Main Gate 01';
  const reason = (elements.panicReasonInput && elements.panicReasonInput.value.trim()) || 'Guard Emergency Panic Trigger';

  const originalBtnContent = elements.confirmPanicBtn.innerHTML;

  try {
    elements.confirmPanicBtn.disabled = true;
    elements.confirmPanicBtn.innerHTML = `
      <span class="material-symbols-outlined spin" style="font-size: 16px;">progress_activity</span>
      <span>Triggering Protocol...</span>
    `;

    await api.triggerPanic({ location, reason });

    showToast(`EMERGENCY PROTOCOL ACTIVATED: Perimeter sirens sounding at ${location}! Supervisors & Police notified.`, 'error');
    closeModal(elements.panicModal);
  } catch (err) {
    console.error('Panic trigger failed:', err);
    showToast(`Failed to trigger panic alarm: ${err.message || 'Network error'}`, 'error');
  } finally {
    elements.confirmPanicBtn.disabled = false;
    elements.confirmPanicBtn.innerHTML = originalBtnContent;
  }
}

/**
 * Generic Modal Helpers
 */
function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('active');
  document.body.style.overflow = '';
}

function initModals() {
  // Close buttons with [data-close-modal]
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-backdrop');
      if (modal) closeModal(modal);
    });
  });

  // Click on backdrop outside dialog closes modal
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop);
      }
    });
  });

  // Escape key closes open modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-backdrop.active');
      if (activeModal) closeModal(activeModal);
    }
  });

  // Fast exit confirmation
  if (elements.confirmExitBtn) {
    elements.confirmExitBtn.addEventListener('click', handleConfirmExit);
  }

  // Panic trigger buttons
  if (elements.openPanicBtn) {
    elements.openPanicBtn.addEventListener('click', openPanicModal);
  }
  if (elements.confirmPanicBtn) {
    elements.confirmPanicBtn.addEventListener('click', handleConfirmPanic);
  }
}

/**
 * Controller Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initHotkeys();
  initModals();
  loadDashboardData();
});