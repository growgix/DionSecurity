import React, { useState } from 'react';
import { useDataStore } from '../../context/DataStoreContext';
import { useToast } from '../../context/ToastContext';

export const SettingsPage = () => {
  const { settings, updateSettings, recordAudit } = useDataStore();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    societyName: settings?.societyName || 'Dion Ventures Sector 4',
    address: settings?.address || 'Plot 104, Sovereign Parkway, Sector 4, Dion Enclave',
    emergencyContact: settings?.emergencyContact || '+91 22 4900 8888',
    securityHotline: settings?.securityHotline || '+91 22 4900 9999',
    visitorPassExpiryHours: settings?.visitorPassExpiryHours || 12,
    requireResidentApproval: settings?.requireResidentApproval ?? true,
    autoGateBarrier: settings?.autoGateBarrier ?? true,
    intercomVoIP: settings?.intercomVoIP ?? true
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(formData);
    recordAudit('SETTINGS_UPDATED', 'Updated estate security and perimeter system parameters');
    addToast('Estate parameters saved successfully.', 'success');
  };

  return (
    <div className="flex flex-col w-full gap-space-lg max-w-4xl mx-auto pb-space-xl">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>System Administration</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Configuration & Telemetry</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            System & Estate Settings
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Configure estate identity, gate access policies, ANPR camera sensitivity, and VoIP intercom relays.
          </p>
        </div>
      </section>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Society Info */}
        <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
          <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px]">apartment</span>
            <span>Estate Property Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-on-surface mb-1">Estate / Society Name</label>
              <input
                type="text"
                value={formData.societyName}
                onChange={(e) => handleChange('societyName', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-md"
              />
            </div>
            <div>
              <label className="block font-label-md text-on-surface mb-1">Security Command Hotline</label>
              <input
                type="text"
                value={formData.securityHotline}
                onChange={(e) => handleChange('securityHotline', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-md"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-md text-on-surface mb-1">Physical Estate Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-md"
            />
          </div>
        </div>

        {/* Section 2: Gate Security Policies */}
        <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
          <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px]">shield</span>
            <span>Perimeter Gate & Access Policies</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <div>
                <span className="font-semibold text-on-surface block">Resident Pre-approval for Cab & Delivery</span>
                <span className="text-secondary text-xs">Require host resident notification before gate entry clearance</span>
              </div>
              <input
                type="checkbox"
                checked={formData.requireResidentApproval}
                onChange={(e) => handleChange('requireResidentApproval', e.target.checked)}
                className="w-5 h-5 accent-primary rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <div>
                <span className="font-semibold text-on-surface block">Automatic Boom Barrier ANPR Trigger</span>
                <span className="text-secondary text-xs">Open barrier automatically for verified resident vehicle license plates</span>
              </div>
              <input
                type="checkbox"
                checked={formData.autoGateBarrier}
                onChange={(e) => handleChange('autoGateBarrier', e.target.checked)}
                className="w-5 h-5 accent-primary rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <div>
                <span className="font-semibold text-on-surface block">VoIP Intercom Audio Hub Active</span>
                <span className="text-secondary text-xs">Enable 2-way digital audio connection from guard stations to flat handsets</span>
              </div>
              <input
                type="checkbox"
                checked={formData.intercomVoIP}
                onChange={(e) => handleChange('intercomVoIP', e.target.checked)}
                className="w-5 h-5 accent-primary rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>Save & Apply Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
