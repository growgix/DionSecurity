import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const ResidentsPage = () => {
  const { residents, blocks, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // New resident form
  const [newName, setNewName] = useState('');
  const [newUnit, setNewUnit] = useState('A-101');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCategory, setNewCategory] = useState('Owner');

  const filteredResidents = residents.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.phone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBlock = selectedBlock === 'all' || r.blockId === selectedBlock || r.blockName.includes(selectedBlock);
    const matchesCategory = categoryFilter === 'all' || r.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesBlock && matchesCategory;
  });

  const handleRegisterResident = (e) => {
    e.preventDefault();
    recordAudit('RESIDENT_REGISTERED', `Registered new resident ${newName} for Unit ${newUnit}`);
    addToast(`Resident ${newName} registered successfully for Unit ${newUnit}!`, 'success');
    setShowRegisterModal(false);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Society Governance</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Resident Registry</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Residents
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Verified resident database, household memberships, vehicle RFID tags, and turnstile access privileges.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => {
              recordAudit('EXPORT_RESIDENTS', 'Exported residents registry CSV');
              addToast('Residents directory exported.', 'info');
            }}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-surface-container-lowest text-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-surface-container-high transition-all border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Roster</span>
          </button>
          <button
            type="button"
            onClick={() => setShowRegisterModal(true)}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Register Resident</span>
          </button>
        </div>
      </section>

      {/* KPI Ribbon */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Verified Residents"
          value={residents.length * 80 + 19}
          icon="verified_user"
          subtitle="Biometric & ID verified"
        />
        <MetricCard
          title="Primary Owners"
          value="412"
          icon="home"
          subtitle="71% of total occupancy"
        />
        <MetricCard
          title="Tenants / Leases"
          value="167"
          icon="key"
          subtitle="Active registered lease deeds"
        />
        <MetricCard
          title="Active RFID Tags"
          value="1,280"
          icon="nfc"
          subtitle="Vehicles and turnstile keys"
        />
      </section>

      {/* Filter Toolbar */}
      <section className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-sm">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resident by name, unit, phone..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
            >
              <option value="all">All Blocks</option>
              {blocks.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
            >
              <option value="all">All Categories</option>
              <option value="owner">Owner</option>
              <option value="tenant">Tenant</option>
            </select>
          </div>
        </div>
      </section>

      {/* Residents Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[750px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3.5 px-space-lg">Resident Name</th>
                <th className="py-3.5 px-space-md">Unit & Block</th>
                <th className="py-3.5 px-space-md">Category</th>
                <th className="py-3.5 px-space-md">Direct Contact</th>
                <th className="py-3.5 px-space-md">Family</th>
                <th className="py-3.5 px-space-md">Vehicles</th>
                <th className="py-3.5 px-space-md">RFID Pass</th>
                <th className="py-3.5 px-space-lg text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {filteredResidents.map((res) => (
                <tr
                  key={res.id}
                  onClick={() => navigate(`/admin/houses/${res.unitNumber}`)}
                  className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-space-lg font-medium text-on-surface flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm font-semibold shrink-0">
                      {res.avatar}
                    </div>
                    <div>
                      <span className="font-semibold text-primary block">{res.name}</span>
                      <span className="font-body-sm text-secondary text-xs">{res.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-space-md">
                    <p className="font-code-sm text-code-sm font-bold text-primary">{res.unitNumber}</p>
                    <p className="font-body-sm text-secondary">{res.blockName}</p>
                  </td>
                  <td className="py-4 px-space-md font-body-sm">
                    {res.category}
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-secondary">
                    {res.phone}
                  </td>
                  <td className="py-4 px-space-md font-body-sm">
                    {res.familyCount} Members
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-secondary">
                    {res.vehicles.join(', ') || '—'}
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-primary font-semibold">
                    {res.rfidTag}
                  </td>
                  <td className="py-4 px-space-lg text-right">
                    <StatusBadge status={res.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Resident Modal */}
      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        title="Register Verified Resident"
        subtitle="Onboard a new primary resident and assign turnstile RFID credential."
      >
        <form onSubmit={handleRegisterResident} className="space-y-4">
          <div>
            <label className="block font-label-md text-on-surface mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Dr. Rajesh Varma"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-on-surface mb-1">Unit Number</label>
              <input
                type="text"
                required
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                placeholder="e.g. A-102"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
              />
            </div>
            <div>
              <label className="block font-label-md text-on-surface mb-1">Ownership Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
              >
                <option value="Owner">Owner</option>
                <option value="Tenant">Tenant</option>
                <option value="Armed Forces / Institutional">Armed Forces / Institutional</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-on-surface mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+91 98200 00000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
              />
            </div>
            <div>
              <label className="block font-label-md text-on-surface mb-1">Email Address</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="resident@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowRegisterModal(false)}
              className="px-4 py-2 rounded-xl text-secondary hover:bg-surface-container font-label-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container"
            >
              Authorize & Save Resident
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
