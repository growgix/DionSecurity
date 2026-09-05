import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const VisitorDetailsPage = () => {
  const { id } = useParams();
  const { visitors, checkoutVisitor, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [showExitModal, setShowExitModal] = useState(false);

  const visitor = visitors.find(v => v.id === id || v.badgeNumber === id) || visitors[0];

  const handleExit = () => {
    checkoutVisitor(visitor.id, 'Gate 01');
    setShowExitModal(false);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Breadcrumbs */}
      <Breadcrumbs
        backTo="/admin/visitors"
        backLabel="Back to Visitors"
        items={[
          { label: 'Visitors', to: '/admin/visitors' },
          { label: 'Visitor Details' },
          { label: visitor.name }
        ]}
      />

      {/* Visitor Profile Hero Card */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-display-lg text-2xl font-bold shrink-0">
              {visitor.avatar}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-display-lg text-display-lg sm:text-[32px] text-primary tracking-tight">
                  {visitor.name}
                </h1>
                <StatusBadge status={visitor.status} />
              </div>
              <p className="font-body-md text-secondary">
                Pass ID: <strong className="font-code-sm text-primary font-bold">{visitor.badgeNumber}</strong> • Category: <span className="font-medium text-on-surface">{visitor.category}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <button
              type="button"
              onClick={() => {
                recordAudit('PRINT_PASS', `Printed digital badge ${visitor.badgeNumber}`);
                addToast(`Printing visitor badge #${visitor.badgeNumber}...`, 'info');
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md font-semibold transition-all border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Print Badge</span>
            </button>

            {visitor.status === 'inside' && (
              <button
                type="button"
                onClick={() => setShowExitModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-error text-on-error font-label-md font-semibold shadow-sm hover:bg-error/90 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Record Exit & Surrender Badge</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Digital Pass Spec & Host Authorization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Column (7 cols): Host resident & visit parameters */}
        <div className="lg:col-span-7 flex flex-col gap-space-lg">
          {/* Host Resident Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/20 space-y-4">
            <h3 className="font-headline-sm text-headline-sm text-primary">Host Resident Authorization</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <div>
                <span className="text-secondary text-xs block">Destination Unit</span>
                <Link to={`/admin/houses/${visitor.hostUnit}`} className="font-headline-sm text-lg font-bold text-primary hover:underline">
                  Unit {visitor.hostUnit}
                </Link>
              </div>
              <div>
                <span className="text-secondary text-xs block">Resident Host</span>
                <span className="font-semibold text-on-surface text-base">{visitor.hostResident}</span>
              </div>
              <div>
                <span className="text-secondary text-xs block">Visit Purpose</span>
                <span className="font-medium text-on-surface">{visitor.purpose}</span>
              </div>
              <div>
                <span className="text-secondary text-xs block">Pre-approved by App</span>
                <span className="font-semibold text-primary">{visitor.preApproved ? 'Yes (Mobile QR Token)' : 'No (Gate Verified)'}</span>
              </div>
            </div>
          </div>

          {/* Vehicular & Security Checkpoint Spec */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/20 space-y-4">
            <h3 className="font-headline-sm text-headline-sm text-primary">Checkpoint & Vehicle Telemetry</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-sm">
              <div className="space-y-1">
                <span className="text-secondary block text-xs">Vehicle Number</span>
                <span className="font-code-sm text-base font-bold text-on-surface">{visitor.vehicleNumber}</span>
              </div>
              <div className="space-y-1">
                <span className="text-secondary block text-xs">Visitor Phone</span>
                <span className="font-code-sm text-base font-semibold text-on-surface">{visitor.phone}</span>
              </div>
              <div className="space-y-1">
                <span className="text-secondary block text-xs">Entry Gate Terminal</span>
                <span className="font-semibold text-on-surface">{visitor.gate}</span>
              </div>
              <div className="space-y-1">
                <span className="text-secondary block text-xs">Duty Officer</span>
                <span className="font-semibold text-on-surface">{visitor.guardId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Turnstile digital badge & timeline */}
        <div className="lg:col-span-5 flex flex-col gap-space-lg">
          {/* Turnstile Badge Spec Card */}
          <div className="bg-primary text-on-primary rounded-2xl p-space-lg shadow-xl relative overflow-hidden space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-semibold">
                  DIGITAL VISITOR BADGE
                </span>
                <h4 className="font-headline-sm text-2xl font-bold text-on-primary mt-0.5">
                  #{visitor.badgeNumber}
                </h4>
              </div>
              <div className="w-10 h-10 rounded-xl bg-on-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
              </div>
            </div>

            <div className="border-t border-on-primary/20 pt-3 space-y-2 text-body-sm">
              <div className="flex justify-between">
                <span className="text-on-primary/70">Visitor:</span>
                <span className="font-semibold">{visitor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-primary/70">Access Authorized To:</span>
                <span className="font-code-sm font-bold text-primary-fixed">{visitor.hostUnit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-primary/70">Entry Timestamp:</span>
                <span className="font-code-sm">{visitor.entryTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-primary/70">Exit Timestamp:</span>
                <span className="font-code-sm">{visitor.exitTime}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-on-primary/10 text-center font-code-sm text-xs tracking-widest uppercase">
              ENCRYPTED RELAY: DION-PASS-ACTIVE
            </div>
          </div>

          {/* Audit Trail */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/20 space-y-3">
            <h3 className="font-headline-sm text-headline-sm text-primary">Turnstile Activity Trail</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-body-sm">
                <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></span>
                <div>
                  <p className="font-semibold text-on-surface">Entry Gate Trip: {visitor.gate}</p>
                  <p className="text-secondary text-xs">{visitor.entryTime} • Authorized by {visitor.guardId}</p>
                </div>
              </div>
              {visitor.status === 'exited' && (
                <div className="flex items-start gap-3 text-body-sm">
                  <span className="w-2 h-2 rounded-full bg-secondary mt-1.5 shrink-0"></span>
                  <div>
                    <p className="font-semibold text-on-surface">Exit Turnstile Logged</p>
                    <p className="text-secondary text-xs">{visitor.exitTime} • Pass Card Surrendered</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Exit Modal */}
      <Modal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="Confirm Visitor Checkout"
        subtitle={`Revoking badge #${visitor.badgeNumber} for ${visitor.name}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="font-body-md text-secondary">
            This will record the departure timestamp, update the live occupancy counter, and log the gate exit in the security audit stream.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowExitModal(false)}
              className="px-4 py-2 rounded-xl text-secondary hover:bg-surface-container font-label-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExit}
              className="px-5 py-2 rounded-xl bg-error text-on-error font-label-md font-semibold hover:bg-error/90"
            >
              Confirm Visitor Exit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
