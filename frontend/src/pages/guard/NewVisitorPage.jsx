import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { useToast } from '../../context/ToastContext';

export const NewVisitorPage = () => {
  const [searchParams] = useSearchParams();
  const { residents, registerVisitor } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(searchParams.get('unit') || 'A-203');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [category, setCategory] = useState('Guest / Family');
  const [purpose, setPurpose] = useState('Personal Visit');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard hotkeys
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        navigate('/guard/dashboard');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigate]);

  const selectedResident = residents.find(r => r.unitNumber === selectedUnit) || residents[0];

  const handleAuthorize = (e) => {
    e.preventDefault();
    if (!visitorName.trim()) {
      addToast('Please enter the visitor name', 'warning');
      return;
    }

    const created = registerVisitor({
      name: visitorName.trim(),
      phone: visitorPhone || '+91 98000 00000',
      category: category,
      purpose: purpose,
      hostUnit: selectedResident.unitNumber,
      hostResident: selectedResident.name,
      vehicleNumber: vehicleNumber.trim() || 'Walk-in',
      gate: 'Gate 01'
    });

    navigate(`/guard/dashboard`);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg max-w-5xl mx-auto pb-space-xl">
      {/* Top Operational Banner & Hotkeys */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-lowest px-space-lg py-space-sm rounded-xl shadow-sm border border-outline-variant/20">
        <div className="flex items-center gap-space-sm flex-wrap">
          <div className="flex items-center gap-space-2xs bg-secondary-container/70 text-on-secondary-container px-space-sm py-1 rounded-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-code-sm text-code-sm font-semibold tracking-wider uppercase">
              TERMINAL GATE 01 • VISITOR ONBOARDING
            </span>
          </div>
          <span className="hidden md:inline font-code-sm text-code-sm text-on-surface-variant/80">
            CHANNEL: SECURE RELAY ENCRYPTED
          </span>
        </div>
        <div className="flex items-center gap-space-sm">
          <div className="flex items-center gap-1.5 px-space-xs py-1 rounded bg-surface-container-high text-on-surface-variant font-code-sm text-code-sm">
            <kbd className="px-1 py-0.5 rounded bg-surface-container-lowest text-on-surface font-semibold shadow-xs">Esc</kbd>
            <span>to Cancel</span>
          </div>
        </div>
      </div>

      {/* Page Title & Live Clock */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div>
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
            Guard Security Operations
          </span>
          <h1 className="font-display-lg text-display-lg sm:text-[36px] text-primary tracking-tight">
            New Visitor Registration
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Register incoming visitor, verify resident authorization, and generate digital turnstile badge.
          </p>
        </div>

        <div className="flex items-center gap-space-md bg-surface-container-lowest px-space-md py-space-sm rounded-xl shadow-sm border border-outline-variant/20 self-start md:self-auto">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Gate Clock</span>
            <span className="font-headline-sm text-headline-sm text-primary tabular-nums font-semibold">
              {currentTime}
            </span>
          </div>
          <div className="h-8 w-px bg-outline-variant/30"></div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Terminal Status</span>
            <span className="font-headline-sm text-headline-sm text-secondary font-semibold">GATE 01</span>
          </div>
        </div>
      </div>

      {/* Stepper Bar: 1 Resident -> 2 Visitor -> 3 Confirm */}
      <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
          {/* Step 1 */}
          <div
            onClick={() => setStep(1)}
            className={`flex items-center gap-space-sm p-space-sm rounded-lg transition-all cursor-pointer ${
              step === 1 ? 'bg-primary-container text-on-primary shadow-sm' : 'bg-surface-container-low'
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold ${
              step === 1 ? 'bg-secondary-container text-primary' : 'bg-primary text-on-primary'
            }`}>
              1
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm font-semibold uppercase opacity-80">Step 01</span>
              <span className="font-body-md text-body-md font-medium truncate">Host Resident</span>
            </div>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => setStep(2)}
            className={`flex items-center gap-space-sm p-space-sm rounded-lg transition-all cursor-pointer ${
              step === 2 ? 'bg-primary-container text-on-primary shadow-sm' : 'bg-surface-container-low'
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold ${
              step === 2 ? 'bg-secondary-container text-primary' : 'bg-surface-container-highest text-on-surface-variant'
            }`}>
              2
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm font-semibold uppercase opacity-80">Step 02</span>
              <span className="font-body-md text-body-md font-medium truncate">Visitor Details</span>
            </div>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => setStep(3)}
            className={`flex items-center gap-space-sm p-space-sm rounded-lg transition-all cursor-pointer ${
              step === 3 ? 'bg-primary-container text-on-primary shadow-sm' : 'bg-surface-container-low'
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold ${
              step === 3 ? 'bg-secondary-container text-primary' : 'bg-surface-container-highest text-on-surface-variant'
            }`}>
              3
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm font-semibold uppercase opacity-80">Step 03</span>
              <span className="font-body-md text-body-md font-medium truncate">Confirm & Issue Badge</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form + Pass Preview */}
      <form onSubmit={handleAuthorize} className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Column (7 cols): Step Form Controls */}
        <div className="lg:col-span-7 flex flex-col gap-space-lg">
          {/* Step 1: Host Resident Picker */}
          {step === 1 && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/20 space-y-4">
              <h3 className="font-headline-sm text-headline-sm text-primary">Select Host Resident</h3>
              
              <div>
                <label className="block font-label-md text-on-surface mb-1 font-medium">Flat / Unit Number</label>
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 font-body-md focus:border-primary text-on-surface"
                >
                  {residents.map(r => (
                    <option key={r.id} value={r.unitNumber}>
                      Unit {r.unitNumber} — {r.name} ({r.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Resident Snapshot */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-lg">
                  {selectedResident.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-on-surface">{selectedResident.name}</h4>
                  <p className="font-body-sm text-secondary">Unit {selectedResident.unitNumber} • {selectedResident.phone}</p>
                  <span className="inline-flex items-center gap-1 text-primary text-xs font-semibold mt-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Intercom Line Connected
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container"
                >
                  Proceed to Visitor Details →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Visitor Details */}
          {step === 2 && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/20 space-y-4">
              <h3 className="font-headline-sm text-headline-sm text-primary">Visitor Information</h3>

              <div>
                <label className="block font-label-md text-on-surface mb-1 font-medium">Visitor Full Name</label>
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="e.g. Sunil Gavaskar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 font-body-md"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-on-surface mb-1 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 font-body-md"
                  >
                    <option value="Guest / Family">Guest / Family</option>
                    <option value="Cab / Taxi">Cab / Taxi (Uber/Ola)</option>
                    <option value="Delivery / Courier">Delivery / Courier</option>
                    <option value="Food Delivery">Food Delivery (Zomato/Swiggy)</option>
                    <option value="Contractor / Service">Contractor / Service</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-md text-on-surface mb-1 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 font-body-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-on-surface mb-1 font-medium">Vehicle Plate (If Driving)</label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder="e.g. MH-02-AB-1234 or Walk-in"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 font-body-md"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-on-surface mb-1 font-medium">Visit Purpose</label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g. Personal visit / Package drop"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 font-body-md"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl text-secondary hover:bg-surface-container font-label-md"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!visitorName.trim()) {
                      addToast('Please enter visitor name', 'warning');
                      return;
                    }
                    setStep(3);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container"
                >
                  Review & Confirm →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation View */}
          {step === 3 && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/20 space-y-4">
              <h3 className="font-headline-sm text-headline-sm text-primary">Authorize & Print Badge</h3>
              
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-2 text-body-sm">
                <div className="flex justify-between">
                  <span className="text-secondary">Visitor:</span>
                  <span className="font-semibold text-on-surface">{visitorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Destination Host:</span>
                  <span className="font-semibold text-on-surface">Unit {selectedResident.unitNumber} ({selectedResident.name})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Category:</span>
                  <span className="font-medium text-primary">{category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Vehicle:</span>
                  <span className="font-code-sm text-on-surface font-semibold">{vehicleNumber || 'Walk-in'}</span>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl text-secondary hover:bg-surface-container font-label-md"
                >
                  ← Edit Details
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md font-semibold shadow-md flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Confirm Entry & Issue Badge</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Live Pass Preview */}
        <div className="lg:col-span-5 bg-primary text-on-primary rounded-2xl p-space-lg shadow-xl relative overflow-hidden space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-semibold">
                DIGITAL TURNSTILE PASS
              </span>
              <h4 className="font-headline-sm text-xl font-bold text-on-primary mt-0.5">
                #PASS-PREVIEW
              </h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-on-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
            </div>
          </div>

          <div className="border-t border-on-primary/20 pt-3 space-y-2 text-body-sm">
            <div className="flex justify-between">
              <span className="text-on-primary/70">Visitor:</span>
              <span className="font-semibold">{visitorName || 'Awaiting Input'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-primary/70">Host Flat:</span>
              <span className="font-code-sm font-bold text-primary-fixed">{selectedResident.unitNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-primary/70">Gate Terminal:</span>
              <span className="font-code-sm">Gate 01 Main</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-on-primary/10 text-center font-code-sm text-xs tracking-widest uppercase">
            STATUS: READY TO ISSUE
          </div>
        </div>
      </form>
    </div>
  );
};
