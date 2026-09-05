/**
 * Dion Security — Visitor Check-in & Registration Controller
 * Vanilla ES Module supporting 3-step onboarding and live digital pass generation.
 */

import { api } from '../../api.js';

const state = {
  residents: [],
  currentStep: 1,
  selectedResident: null,
  visitorData: {
    name: '',
    phone: '',
    category: 'Guest / Family',
    purpose: 'Personal Visit',
    vehicleNumber: 'Walk-in'
  },
  isSubmitting: false
};

const elements = {
  clockDisplay: document.getElementById('gate-clock-display'),
  unitSelect: document.getElementById('unit-select'),
  resSnapshotName: document.getElementById('snapshot-resident-name'),
  resSnapshotUnit: document.getElementById('snapshot-unit-phone'),
  resSnapshotAvatar: document.getElementById('snapshot-avatar'),
  
  // Step containers
  stepItem1: document.getElementById('step-item-1'),
  stepItem2: document.getElementById('step-item-2'),
  stepItem3: document.getElementById('step-item-3'),
  stepPanel1: document.getElementById('step-panel-1'),
  stepPanel2: document.getElementById('step-panel-2'),
  stepPanel3: document.getElementById('step-panel-3'),
  stepPanelSuccess: document.getElementById('step-panel-success'),
  
  // Inputs
  nameInput: document.getElementById('visitor-name-input'),
  phoneInput: document.getElementById('visitor-phone-input'),
  categorySelect: document.getElementById('visitor-category-select'),
  vehicleInput: document.getElementById('visitor-vehicle-input'),
  purposeInput: document.getElementById('visitor-purpose-input'),
  
  // Review fields
  reviewName: document.getElementById('review-visitor-name'),
  reviewHost: document.getElementById('review-host-unit'),
  reviewCategory: document.getElementById('review-category'),
  reviewVehicle: document.getElementById('review-vehicle'),
  
  // Live Pass Preview
  previewBadgeId: document.getElementById('preview-pass-badge'),
  previewVisitorName: document.getElementById('preview-visitor-name'),
  previewHostFlat: document.getElementById('preview-host-flat'),
  previewStatus: document.getElementById('preview-status-pill'),
  
  // Success card
  issuedPassBadge: document.getElementById('issued-pass-badge'),
  issuedVisitorName: document.getElementById('issued-visitor-name'),
  issuedHostUnit: document.getElementById('issued-host-unit'),
  issuedEntryTime: document.getElementById('issued-entry-time'),
  
  // Navigation buttons
  btnStep1Next: document.getElementById('step1-next-btn'),
  btnStep2Back: document.getElementById('step2-back-btn'),
  btnStep2Next: document.getElementById('step2-next-btn'),
  btnStep3Back: document.getElementById('step3-back-btn'),
  btnSubmit: document.getElementById('submit-visitor-btn'),
  btnNewRegistration: document.getElementById('btn-new-registration'),
  
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

function initClock() {
  function update() {
    if (elements.clockDisplay) {
      elements.clockDisplay.textContent = new Date().toLocaleTimeString('en-US', { hour12: true });
    }
  }
  update();
  setInterval(update, 1000);
}

function initHotkeys() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeTag = (document.activeElement && document.activeElement.tagName) || '';
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(activeTag.toUpperCase())) {
        document.activeElement.blur();
      } else {
        window.location.href = '/pages/guard/dashboard.php';
      }
    }
  });
}

async function loadResidents() {
  try {
    const res = await api.getResidents();
    state.residents = (res && res.data) ? res.data : [];
    
    // Check URL search params for ?unit=A-203
    const urlParams = new URLSearchParams(window.location.search);
    const targetUnit = urlParams.get('unit');

    renderUnitSelect(targetUnit);
  } catch (err) {
    console.error('Failed to load residents:', err);
    showToast('Failed to load resident directory.', 'error');
  }
}

function renderUnitSelect(targetUnit) {
  if (!elements.unitSelect) return;

  if (state.residents.length === 0) {
    elements.unitSelect.innerHTML = '<option value="">No residents found</option>';
    return;
  }

  elements.unitSelect.innerHTML = state.residents.map(r => `
    <option value="${escapeHtml(r.unitNumber)}" ${targetUnit === r.unitNumber ? 'selected' : ''}>
      Unit ${escapeHtml(r.unitNumber)} — ${escapeHtml(r.name)} (${escapeHtml(r.category || 'Resident')})
    </option>
  `).join('');

  const selectedVal = elements.unitSelect.value;
  state.selectedResident = state.residents.find(r => r.unitNumber === selectedVal) || state.residents[0];
  updateResidentSnapshot();
  updatePassPreview();
}

function updateResidentSnapshot() {
  if (!state.selectedResident) return;
  const r = state.selectedResident;
  if (elements.resSnapshotName) elements.resSnapshotName.textContent = r.name;
  if (elements.resSnapshotUnit) elements.resSnapshotUnit.textContent = `Unit ${r.unitNumber} • ${r.phone || 'No phone'}`;
  if (elements.resSnapshotAvatar) elements.resSnapshotAvatar.textContent = (r.avatar || r.name.substring(0, 2)).toUpperCase();
}

function updatePassPreview() {
  if (elements.previewVisitorName) {
    elements.previewVisitorName.textContent = state.visitorData.name.trim() || 'Awaiting Input';
  }
  if (elements.previewHostFlat && state.selectedResident) {
    elements.previewHostFlat.textContent = state.selectedResident.unitNumber;
  }
}

function setStep(step) {
  state.currentStep = step;

  // Stepper Header tabs
  [elements.stepItem1, elements.stepItem2, elements.stepItem3].forEach((el, idx) => {
    if (!el) return;
    el.classList.remove('active', 'completed');
    if (idx + 1 === step) el.classList.add('active');
    else if (idx + 1 < step) el.classList.add('completed');
  });

  // Step Panels
  elements.stepPanel1.style.display = step === 1 ? 'flex' : 'none';
  elements.stepPanel2.style.display = step === 2 ? 'flex' : 'none';
  elements.stepPanel3.style.display = step === 3 ? 'flex' : 'none';
  elements.stepPanelSuccess.style.display = step === 4 ? 'flex' : 'none';

  if (step === 3) {
    // Populate review fields
    if (elements.reviewName) elements.reviewName.textContent = state.visitorData.name;
    if (elements.reviewHost && state.selectedResident) {
      elements.reviewHost.textContent = `Unit ${state.selectedResident.unitNumber} (${state.selectedResident.name})`;
    }
    if (elements.reviewCategory) elements.reviewCategory.textContent = state.visitorData.category;
    if (elements.reviewVehicle) elements.reviewVehicle.textContent = state.visitorData.vehicleNumber || 'Walk-in';
  }
}

async function handleAuthorizeVisitor() {
  if (state.isSubmitting) return;

  if (!state.visitorData.name.trim()) {
    showToast('Visitor name is required.', 'warning');
    setStep(2);
    return;
  }

  const payload = {
    name: state.visitorData.name.trim(),
    phone: state.visitorData.phone.trim() || '+91 98000 00000',
    category: state.visitorData.category,
    purpose: state.visitorData.purpose.trim() || 'General Visit',
    hostUnit: state.selectedResident ? state.selectedResident.unitNumber : 'A-101',
    hostResident: state.selectedResident ? state.selectedResident.name : 'Resident Host',
    vehicleNumber: state.visitorData.vehicleNumber.trim() || 'Walk-in',
    gate: 'Gate 01'
  };

  try {
    state.isSubmitting = true;
    if (elements.btnSubmit) {
      elements.btnSubmit.disabled = true;
      elements.btnSubmit.innerHTML = `
        <span class="material-symbols-outlined spin" style="font-size: 18px;">progress_activity</span>
        <span>Authorizing Entry...</span>
      `;
    }

    const res = await api.createVisitor(payload);
    const createdVisitor = (res && res.data) ? res.data : null;

    if (createdVisitor) {
      // Update success card
      if (elements.issuedPassBadge) elements.issuedPassBadge.textContent = `#${createdVisitor.badgeNumber || createdVisitor.badge_number || 'PASS'}`;
      if (elements.issuedVisitorName) elements.issuedVisitorName.textContent = createdVisitor.name;
      if (elements.issuedHostUnit) elements.issuedHostUnit.textContent = createdVisitor.hostUnit || createdVisitor.host_unit;
      if (elements.issuedEntryTime) elements.issuedEntryTime.textContent = createdVisitor.entryTime || createdVisitor.entry_time || 'Just now';

      // Update pass preview card
      if (elements.previewBadgeId) elements.previewBadgeId.textContent = `#${createdVisitor.badgeNumber || createdVisitor.badge_number}`;
      if (elements.previewStatus) elements.previewStatus.textContent = 'STATUS: CLEARED (INSIDE)';

      showToast(`Pass #${createdVisitor.badgeNumber || createdVisitor.badge_number} issued for ${createdVisitor.name}. Turnstile cleared!`, 'success');
      setStep(4);
    }
  } catch (err) {
    console.error('Failed to register visitor:', err);
    showToast(`Registration failed: ${err.message || 'Server error'}`, 'error');
  } finally {
    state.isSubmitting = false;
    if (elements.btnSubmit) {
      elements.btnSubmit.disabled = false;
      elements.btnSubmit.innerHTML = `
        <span class="material-symbols-outlined" style="font-size: 18px;">verified</span>
        <span>Confirm Entry & Issue Badge</span>
      `;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initHotkeys();
  loadResidents();

  // Unit select change
  elements.unitSelect?.addEventListener('change', (e) => {
    state.selectedResident = state.residents.find(r => r.unitNumber === e.target.value) || null;
    updateResidentSnapshot();
    updatePassPreview();
  });

  // Inputs live sync
  elements.nameInput?.addEventListener('input', (e) => {
    state.visitorData.name = e.target.value;
    updatePassPreview();
  });
  elements.phoneInput?.addEventListener('input', (e) => {
    state.visitorData.phone = e.target.value;
  });
  elements.categorySelect?.addEventListener('change', (e) => {
    state.visitorData.category = e.target.value;
  });
  elements.vehicleInput?.addEventListener('input', (e) => {
    state.visitorData.vehicleNumber = e.target.value;
  });
  elements.purposeInput?.addEventListener('input', (e) => {
    state.visitorData.purpose = e.target.value;
  });

  // Stepper Header click events
  elements.stepItem1?.addEventListener('click', () => setStep(1));
  elements.stepItem2?.addEventListener('click', () => {
    if (state.selectedResident) setStep(2);
  });
  elements.stepItem3?.addEventListener('click', () => {
    if (state.visitorData.name.trim()) setStep(3);
    else showToast('Enter visitor name before reviewing.', 'warning');
  });

  // Button handlers
  elements.btnStep1Next?.addEventListener('click', () => setStep(2));
  elements.btnStep2Back?.addEventListener('click', () => setStep(1));
  elements.btnStep2Next?.addEventListener('click', () => {
    if (!state.visitorData.name.trim()) {
      showToast('Please enter the visitor full name.', 'warning');
      elements.nameInput?.focus();
      return;
    }
    setStep(3);
  });
  elements.btnStep3Back?.addEventListener('click', () => setStep(2));
  elements.btnSubmit?.addEventListener('click', handleAuthorizeVisitor);

  // New registration reset
  elements.btnNewRegistration?.addEventListener('click', () => {
    state.visitorData = {
      name: '',
      phone: '',
      category: 'Guest / Family',
      purpose: 'Personal Visit',
      vehicleNumber: 'Walk-in'
    };
    if (elements.nameInput) elements.nameInput.value = '';
    if (elements.phoneInput) elements.phoneInput.value = '';
    if (elements.vehicleInput) elements.vehicleInput.value = '';
    if (elements.purposeInput) elements.purposeInput.value = '';
    if (elements.categorySelect) elements.categorySelect.value = 'Guest / Family';
    if (elements.previewBadgeId) elements.previewBadgeId.textContent = '#PASS-PREVIEW';
    if (elements.previewStatus) elements.previewStatus.textContent = 'STATUS: READY TO ISSUE';
    updatePassPreview();
    setStep(1);
  });
});