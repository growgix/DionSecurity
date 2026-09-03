import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const FamilyMembersPage = () => {
  const { familyMembers, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [relationFilter, setRelationFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New member form
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Spouse');
  const [unit, setUnit] = useState('A-203');
  const [phone, setPhone] = useState('');

  const filteredMembers = familyMembers.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.unitNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRelation = relationFilter === 'all' || m.relation.toLowerCase() === relationFilter.toLowerCase();
    return matchesSearch && matchesRelation;
  });

  const handleAddMember = (e) => {
    e.preventDefault();
    recordAudit('FAMILY_MEMBER_ADDED', `Added family member ${name} (${relation}) to Unit ${unit}`);
    addToast(`Family member ${name} registered for Unit ${unit}.`, 'success');
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Society Governance</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Family Registry</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Family Members
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Dependent family members, resident co-habitants, and secondary turnstile access badge credentials.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Add Family Member</span>
          </button>
        </div>
      </section>

      {/* Metric Snapshot */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Total Family Members"
          value="740"
          icon="group"
          subtitle="Registered co-habitants"
        />
        <MetricCard
          title="Spouses"
          value="385"
          icon="favorite"
          subtitle="Co-registered adults"
        />
        <MetricCard
          title="Children"
          value="248"
          icon="child_care"
          subtitle="Juvenile credentials"
        />
        <MetricCard
          title="Senior Dependents"
          value="107"
          icon="elderly"
          subtitle="Priority assistance flagged"
        />
      </section>

      {/* Filter Toolbar */}
      <section className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-sm">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by member name, primary resident, unit..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={relationFilter}
              onChange={(e) => setRelationFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
            >
              <option value="all">All Relations</option>
              <option value="spouse">Spouse</option>
              <option value="daughter">Daughter</option>
              <option value="son">Son</option>
              <option value="mother-in-law">Mother-in-law</option>
            </select>
          </div>
        </div>
      </section>

      {/* Family Members Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3.5 px-space-lg">Member Name</th>
                <th className="py-3.5 px-space-md">Relationship</th>
                <th className="py-3.5 px-space-md">Primary Resident & Unit</th>
                <th className="py-3.5 px-space-md">Contact</th>
                <th className="py-3.5 px-space-md">Assigned RFID</th>
                <th className="py-3.5 px-space-lg text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {filteredMembers.map((fam) => (
                <tr key={fam.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 px-space-lg font-semibold text-on-surface">
                    {fam.name}
                  </td>
                  <td className="py-4 px-space-md">
                    <span className="font-label-md px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                      {fam.relation}
                    </span>
                  </td>
                  <td className="py-4 px-space-md">
                    <p className="font-medium text-on-surface">{fam.residentName}</p>
                    <p className="font-code-sm text-code-sm font-bold text-primary">Unit {fam.unitNumber}</p>
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-secondary">
                    {fam.phone}
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-primary font-semibold">
                    {fam.rfidTag}
                  </td>
                  <td className="py-4 px-space-lg text-right">
                    <StatusBadge status={fam.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Family Member Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register Household Dependent"
        subtitle="Add a family member linked to an existing primary resident flat."
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block font-label-md text-on-surface mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alok Sharma"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-on-surface mb-1">Relationship</label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
              >
                <option value="Spouse">Spouse</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
              </select>
            </div>
            <div>
              <label className="block font-label-md text-on-surface mb-1">Host Unit</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. A-203"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-md text-on-surface mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98200 00000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded-xl text-secondary hover:bg-surface-container font-label-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container"
            >
              Issue Household Credential
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
