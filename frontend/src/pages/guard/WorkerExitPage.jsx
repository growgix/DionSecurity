import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const WorkerExitPage = () => {
  const { employees, checkoutWorker, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [scanQuery, setScanQuery] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);

  const presentWorkers = employees.filter(e => e.status === 'present' || e.status === 'late');

  const handleSearch = (e) => {
    e.preventDefault();
    const found = presentWorkers.find(
      e => e.id.toLowerCase() === scanQuery.trim().toLowerCase() ||
           e.badgeNo.toLowerCase() === scanQuery.trim().toLowerCase() ||
           e.name.toLowerCase().includes(scanQuery.trim().toLowerCase())
    );

    if (found) {
      setSelectedWorker(found);
    } else {
      addToast(`No on-duty worker matching "${scanQuery}" found.`, 'warning');
    }
  };

  const handleCheckOut = () => {
    if (selectedWorker) {
      checkoutWorker(selectedWorker.id);
      addToast(`Worker ${selectedWorker.name} checked out at Gate 01.`, 'success');
      navigate('/guard/dashboard');
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-lg max-w-4xl mx-auto pb-space-xl">
      {/* Header */}
      <div className="flex flex-col gap-space-2xs">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
          Guard Checkpoint • Shift Checkout
        </span>
        <h1 className="font-display-lg text-display-lg sm:text-[36px] text-primary tracking-tight">
          Worker Exit & Shift Log
        </h1>
        <p className="font-body-md text-body-md text-secondary">
          Scan worker badge card to record departure timestamp and verify shift completion.
        </p>
      </div>

      {/* Scanner Box */}
      <div className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
        <form onSubmit={handleSearch} className="space-y-3">
          <label className="block font-label-md text-on-surface font-semibold">
            Scan Employee RFID or Enter Badge ID / Name
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[22px]">
                logout
              </span>
              <input
                type="text"
                autoFocus
                value={scanQuery}
                onChange={(e) => setScanQuery(e.target.value)}
                placeholder="e.g. DION-E101, WRK-1001, or Ramesh Kumar..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-lg text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container shadow-sm"
            >
              Scan Exit
            </button>
          </div>
        </form>

        {/* Quick select list for demo */}
        <div className="pt-2 border-t border-outline-variant/20">
          <span className="font-label-sm text-label-sm text-secondary uppercase block mb-2">
            Currently On-Duty Personnel (Click to select for fast exit):
          </span>
          <div className="flex items-center gap-2 flex-wrap max-h-36 overflow-y-auto">
            {presentWorkers.slice(0, 10).map(emp => (
              <button
                key={emp.id}
                type="button"
                onClick={() => {
                  setSelectedWorker(emp);
                  setScanQuery(emp.badgeNo);
                }}
                className={`px-3 py-1.5 rounded-lg text-body-sm font-medium transition-colors border ${
                  selectedWorker?.id === emp.id
                    ? 'bg-primary text-on-primary border-primary font-bold'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface border-outline-variant/30'
                }`}
              >
                <span className="font-code-sm font-bold mr-1">{emp.badgeNo}</span>
                <span>{emp.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Worker Preview */}
      {selectedWorker && (
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-lg border border-primary/30 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high text-primary flex items-center justify-center font-bold text-lg">
                {selectedWorker.avatar}
              </div>
              <div>
                <h3 className="font-headline-sm text-xl font-bold text-primary">{selectedWorker.name}</h3>
                <p className="font-body-sm text-secondary">{selectedWorker.role} • <strong className="text-on-surface">{selectedWorker.department}</strong></p>
              </div>
            </div>
            <StatusBadge status={selectedWorker.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 text-body-sm">
            <div>
              <span className="text-secondary block text-xs">Badge Number</span>
              <span className="font-code-sm font-bold text-primary">{selectedWorker.badgeNo}</span>
            </div>
            <div>
              <span className="text-secondary block text-xs">Duty Shift</span>
              <span className="font-code-sm text-on-surface">{selectedWorker.shift}</span>
            </div>
            <div>
              <span className="text-secondary block text-xs">Check-In Time</span>
              <span className="font-code-sm font-semibold text-on-surface">{selectedWorker.todayAttendance.inTime}</span>
            </div>
            <div>
              <span className="text-secondary block text-xs">Duty Station</span>
              <span className="font-semibold text-on-surface">{selectedWorker.assignedLocation}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="font-body-sm text-secondary">
              Turnstile checkout timestamp will be updated in muster record.
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedWorker(null)}
                className="px-4 py-2 rounded-xl text-secondary hover:bg-surface-container font-label-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCheckOut}
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md font-semibold shadow-md flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Confirm Shift Checkout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
