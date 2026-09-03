import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const ExpectedVisitorsPage = () => {
  const { visitors, registerVisitor, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Invite Guest state
  const [guestName, setGuestName] = useState('');
  const [hostUnit, setHostUnit] = useState('B-101');
  const [hostResident, setHostResident] = useState('Harish Mehta');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestVehicle, setGuestVehicle] = useState('');

  const expectedVisitors = visitors.filter(v => v.status === 'expected' || v.preApproved);

  const handleAuthorizeEntry = (expectedVis) => {
    registerVisitor({
      name: expectedVis.name,
      category: expectedVis.category || 'Expected Guest',
      hostResident: expectedVis.hostResident,
      hostUnit: expectedVis.hostUnit,
      vehicleNumber: expectedVis.vehicleNumber,
      purpose: expectedVis.purpose || 'Pre-authorized Guest Visit',
      preApproved: true
    });
  };

  const handleCreateInvite = (e) => {
    e.preventDefault();
    const arrivalCode = Math.floor(100000 + Math.random() * 900000).toString();
    recordAudit('GUEST_INVITED', `Pre-authorized guest ${guestName} for Unit ${hostUnit} with code ${arrivalCode}`);
    addToast(`Guest invite generated with 6-digit arrival code: #${arrivalCode}`, 'success');
    setShowInviteModal(false);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Perimeter Gate Registry</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Pre-Authorizations</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Expected Visitors
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Pre-authorized resident invitations, guest QR codes, fast check-in arrival verification, and delivery transit passes.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>+ Pre-Authorize Guest</span>
          </button>
        </div>
      </section>

      {/* KPI Ribbon */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Total Pre-Authorizations"
          value="24"
          icon="schedule_send"
          subtitle="Generated for today"
        />
        <MetricCard
          title="Arrived & Cleared"
          value="16"
          icon="check_circle"
          subtitle="Fast turnstile authorized"
        />
        <MetricCard
          title="Pending Arrivals"
          value="8"
          icon="pending"
          subtitle="Expected within 4 hours"
          badge="Awaiting"
        />
        <MetricCard
          title="Active QR Tokens"
          value="24"
          icon="qr_code"
          subtitle="Digital turnstile bypass"
        />
      </section>

      {/* Expected Guests Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-headline-sm text-headline-sm text-primary">Pre-Approved Guest Roster</h3>
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by arrival code, name..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3.5 px-space-lg">Guest Name</th>
                <th className="py-3.5 px-space-md">Host Resident & Unit</th>
                <th className="py-3.5 px-space-md">Vehicle</th>
                <th className="py-3.5 px-space-md">Arrival Code</th>
                <th className="py-3.5 px-space-md">Status</th>
                <th className="py-3.5 px-space-lg text-right">Gate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {expectedVisitors.map((exp) => (
                <tr key={exp.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 px-space-lg font-medium text-on-surface flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm font-semibold shrink-0">
                      {exp.avatar}
                    </div>
                    <div>
                      <span className="font-semibold text-primary block">{exp.name}</span>
                      <span className="font-body-sm text-secondary text-xs">{exp.phone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-space-md">
                    <p className="font-code-sm font-bold text-primary">{exp.hostUnit}</p>
                    <p className="font-body-sm text-secondary text-xs">{exp.hostResident}</p>
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-secondary">
                    {exp.vehicleNumber}
                  </td>
                  <td className="py-4 px-space-md">
                    <span className="font-code-sm text-code-sm px-2.5 py-1 rounded bg-secondary-container text-primary font-bold tracking-wider">
                      #{exp.arrivalCode || '882194'}
                    </span>
                  </td>
                  <td className="py-4 px-space-md">
                    <StatusBadge status={exp.status} />
                  </td>
                  <td className="py-4 px-space-lg text-right">
                    {exp.status === 'expected' ? (
                      <button
                        type="button"
                        onClick={() => handleAuthorizeEntry(exp)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm font-semibold hover:bg-primary-container shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                        <span>Authorize Entry</span>
                      </button>
                    ) : (
                      <span className="text-secondary font-label-sm font-medium">Inside Premises</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Guest Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Pre-Authorize Visitor / Guest"
        subtitle="Generate a 6-digit fast-entry code and digital turnstile token."
      >
        <form onSubmit={handleCreateInvite} className="space-y-4">
          <div>
            <label className="block font-label-md text-on-surface mb-1">Guest Full Name</label>
            <input
              type="text"
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. Dr. Preeti Saxena"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-on-surface mb-1">Host Unit</label>
              <input
                type="text"
                required
                value={hostUnit}
                onChange={(e) => setHostUnit(e.target.value)}
                placeholder="e.g. B-101"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
              />
            </div>
            <div>
              <label className="block font-label-md text-on-surface mb-1">Host Resident Name</label>
              <input
                type="text"
                required
                value={hostResident}
                onChange={(e) => setHostResident(e.target.value)}
                placeholder="e.g. Harish Mehta"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-on-surface mb-1">Guest Phone Number</label>
              <input
                type="tel"
                required
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="+91 98200 00000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
              />
            </div>
            <div>
              <label className="block font-label-md text-on-surface mb-1">Vehicle Plate (Optional)</label>
              <input
                type="text"
                value={guestVehicle}
                onChange={(e) => setGuestVehicle(e.target.value)}
                placeholder="e.g. MH-02-PS-9900"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className="px-4 py-2 rounded-xl text-secondary hover:bg-surface-container font-label-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container"
            >
              Generate Arrival Code
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
