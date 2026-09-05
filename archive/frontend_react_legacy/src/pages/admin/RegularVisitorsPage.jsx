import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const RegularVisitorsPage = () => {
  const { visitors, registerVisitor, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Filter domestic / regular visitors
  const regularVisitors = visitors.filter(v => v.category.includes('Regular') || v.category.includes('Domestic') || v.category.includes('Staff'));

  const handleFastEntry = (regVis) => {
    registerVisitor({
      name: regVis.name,
      category: regVis.category,
      hostResident: regVis.hostResident,
      hostUnit: regVis.hostUnit,
      vehicleNumber: regVis.vehicleNumber,
      purpose: 'Regular Daily Duty',
      preApproved: true
    });
  };

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Perimeter Gate Registry</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Domestic & Frequent Pass</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Regular Visitors & Domestic Staff
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Housekeeping aides, private chauffeurs, tutors, and registered daily service providers with fast biometric turnstile badges.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setShowRegisterModal(true)}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">badge</span>
            <span>+ Issue Regular Pass</span>
          </button>
        </div>
      </section>

      {/* KPI Ribbon */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Total Registered Staff"
          value="142"
          icon="badge"
          subtitle="Enrolled domestic personnel"
        />
        <MetricCard
          title="Currently Inside"
          value="38"
          icon="groups"
          subtitle="Active across towers"
          badge="On Duty"
        />
        <MetricCard
          title="Domestic Maids / Cooks"
          value="76"
          icon="cleaning_services"
          subtitle="Morning and evening shifts"
        />
        <MetricCard
          title="Private Chauffeurs"
          value="42"
          icon="directions_car"
          subtitle="Assigned parking & transit"
        />
      </section>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-headline-sm text-headline-sm text-primary">Recognized Regular Staff</h3>
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff name, flat..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3.5 px-space-lg">Staff Member</th>
                <th className="py-3.5 px-space-md">Category</th>
                <th className="py-3.5 px-space-md">Assigned Households</th>
                <th className="py-3.5 px-space-md">Pass ID</th>
                <th className="py-3.5 px-space-md">Status</th>
                <th className="py-3.5 px-space-lg text-right">Fast Pass Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {regularVisitors.map((reg) => (
                <tr key={reg.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 px-space-lg font-medium text-on-surface flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm font-semibold shrink-0">
                      {reg.avatar}
                    </div>
                    <div>
                      <span className="font-semibold text-primary block">{reg.name}</span>
                      <span className="font-body-sm text-secondary text-xs">{reg.phone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-space-md">
                    <span className="font-label-sm px-2.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                      {reg.category}
                    </span>
                  </td>
                  <td className="py-4 px-space-md">
                    <p className="font-code-sm font-bold text-primary">{reg.hostUnit}</p>
                    <p className="font-body-sm text-secondary text-xs">{reg.hostResident}</p>
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-primary font-semibold">
                    {reg.badgeNumber}
                  </td>
                  <td className="py-4 px-space-md">
                    <StatusBadge status={reg.status} />
                  </td>
                  <td className="py-4 px-space-lg text-right">
                    {reg.status !== 'inside' ? (
                      <button
                        type="button"
                        onClick={() => handleFastEntry(reg)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm font-semibold hover:bg-primary-container shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">login</span>
                        <span>Fast Entry</span>
                      </button>
                    ) : (
                      <span className="text-secondary font-label-sm font-medium">Active Inside</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Regular Pass Modal */}
      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        title="Issue Permanent Domestic Staff Pass"
        subtitle="Enrol frequent domestic staff member with assigned household clearances."
      >
        <div className="space-y-4">
          <div>
            <label className="block font-label-md text-on-surface mb-1">Full Legal Name</label>
            <input type="text" placeholder="e.g. Meenakshi Sundaram" className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-on-surface mb-1">Staff Category</label>
              <select className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md">
                <option value="Domestic Housekeeper">Domestic Housekeeper</option>
                <option value="Cook / Chef">Cook / Chef</option>
                <option value="Private Chauffeur">Private Chauffeur</option>
                <option value="Child Caretaker / Nanny">Child Caretaker / Nanny</option>
              </select>
            </div>
            <div>
              <label className="block font-label-md text-on-surface mb-1">Primary Host Unit</label>
              <input type="text" placeholder="e.g. A-102" className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowRegisterModal(false)} className="px-4 py-2 rounded-xl text-secondary hover:bg-surface-container font-label-md">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                recordAudit('REGULAR_PASS_ISSUED', 'Issued permanent domestic staff RFID pass');
                addToast('Regular domestic staff pass generated.', 'success');
                setShowRegisterModal(false);
              }}
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container"
            >
              Issue Digital Pass
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
