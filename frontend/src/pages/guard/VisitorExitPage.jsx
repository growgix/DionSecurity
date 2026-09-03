import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const VisitorExitPage = () => {
  const { visitors, checkoutVisitor, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [scanBadge, setScanBadge] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  const currentlyInside = visitors.filter(v => v.status === 'inside');

  const handleSearchBadge = (e) => {
    e.preventDefault();
    const found = currentlyInside.find(
      v => v.badgeNumber.toLowerCase() === scanBadge.trim().toLowerCase() ||
           v.name.toLowerCase().includes(scanBadge.trim().toLowerCase())
    );

    if (found) {
      setSelectedVisitor(found);
    } else {
      addToast(`No active visitor pass matching "${scanBadge}" found.`, 'warning');
    }
  };

  const handleConfirmExit = () => {
    if (selectedVisitor) {
      checkoutVisitor(selectedVisitor.id, 'Gate 01');
      setSelectedVisitor(null);
      setScanBadge('');
      navigate('/guard/dashboard');
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-lg max-w-4xl mx-auto pb-space-xl">
      {/* Header */}
      <div className="flex flex-col gap-space-2xs">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
          Guard Checkpoint • Turnstile Checkout
        </span>
        <h1 className="font-display-lg text-display-lg sm:text-[36px] text-primary tracking-tight">
          Visitor Exit & Pass Return
        </h1>
        <p className="font-body-md text-body-md text-secondary">
          Scan RFID visitor badge, record vehicle departure timestamp, and revoke digital turnstile access.
        </p>
      </div>

      {/* Badge Scanner Input Box */}
      <div className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
        <form onSubmit={handleSearchBadge} className="space-y-3">
          <label className="block font-label-md text-on-surface font-semibold">
            Scan Badge RFID or Enter Pass ID / Visitor Name
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[22px]">
                qr_code_scanner
              </span>
              <input
                type="text"
                autoFocus
                value={scanBadge}
                onChange={(e) => setScanBadge(e.target.value)}
                placeholder="e.g. G-104, C-209, or visitor name..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-lg text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container shadow-sm"
            >
              Locate Pass
            </button>
          </div>
        </form>

        {/* Quick select from currently inside */}
        <div className="pt-2 border-t border-outline-variant/20">
          <span className="font-label-sm text-label-sm text-secondary uppercase block mb-2">
            Active Inside (Click to select for fast checkout):
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {currentlyInside.map(v => (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setSelectedVisitor(v);
                  setScanBadge(v.badgeNumber);
                }}
                className={`px-3 py-1.5 rounded-lg text-body-sm font-medium transition-colors border ${
                  selectedVisitor?.id === v.id
                    ? 'bg-primary text-on-primary border-primary font-bold'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface border-outline-variant/30'
                }`}
              >
                <span className="font-code-sm font-bold mr-1">#{v.badgeNumber}</span>
                <span>{v.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Pass Verification Card */}
      {selectedVisitor && (
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-lg border border-primary/30 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-lg">
                {selectedVisitor.avatar}
              </div>
              <div>
                <h3 className="font-headline-sm text-xl font-bold text-primary">{selectedVisitor.name}</h3>
                <p className="font-body-sm text-secondary">Pass ID: <strong className="text-primary">#{selectedVisitor.badgeNumber}</strong> • {selectedVisitor.category}</p>
              </div>
            </div>
            <StatusBadge status="inside" text="Currently Inside" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 text-body-sm">
            <div>
              <span className="text-secondary block text-xs">Host Unit</span>
              <span className="font-bold text-on-surface">{selectedVisitor.hostUnit}</span>
            </div>
            <div>
              <span className="text-secondary block text-xs">Vehicle</span>
              <span className="font-code-sm text-on-surface font-semibold">{selectedVisitor.vehicleNumber}</span>
            </div>
            <div>
              <span className="text-secondary block text-xs">Entry Timestamp</span>
              <span className="font-code-sm text-on-surface">{selectedVisitor.entryTime}</span>
            </div>
            <div>
              <span className="text-secondary block text-xs">Time on Premises</span>
              <span className="font-code-sm text-primary font-bold">{selectedVisitor.duration}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="font-body-sm text-secondary">
              Physical pass card returned and digital token revoked.
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedVisitor(null)}
                className="px-4 py-2 rounded-xl text-secondary hover:bg-surface-container font-label-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmExit}
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md font-semibold shadow-md flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Confirm Departure & Release</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
