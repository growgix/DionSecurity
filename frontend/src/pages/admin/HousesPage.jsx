import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const HousesPage = () => {
  const { houses, blocks, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const occupiedCount = houses.filter(h => h.status === 'occupied').length;
  const vacantCount = houses.filter(h => h.status === 'vacant').length;

  const filteredHouses = houses.filter(h => {
    const matchesSearch = h.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.parkingSlot.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBlock = selectedBlock === 'all' || h.blockId === selectedBlock || h.blockName.includes(selectedBlock);
    const matchesStatus = statusFilter === 'all' || h.status === statusFilter;
    return matchesSearch && matchesBlock && matchesStatus;
  });

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Estate Infrastructure</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Unit Ledger</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Houses & Apartments
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Detailed registry of all 255 apartment flats, penthouses, parking bays, and resident occupancy assignments.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => {
              recordAudit('EXPORT_HOUSES', 'Exported houses registry CSV');
              addToast('Houses registry exported.', 'info');
            }}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-surface-container-lowest text-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-surface-container-high transition-all border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Roster</span>
          </button>
        </div>
      </section>

      {/* KPI Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Total Units"
          value={houses.length}
          icon="apartment"
          subtitle="Across Blocks A to F"
        />
        <MetricCard
          title="Occupied Units"
          value={occupiedCount}
          icon="check_circle"
          subtitle="Verified resident families"
          badge="Occupied"
        />
        <MetricCard
          title="Vacant Units"
          value={vacantCount}
          icon="event_busy"
          subtitle="Available for allocation"
        />
        <MetricCard
          title="Intercom Net"
          value="100% Online"
          icon="hub"
          subtitle="Digital VoIP telemetry active"
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
              placeholder="Search by unit (e.g. A-101), resident, parking..."
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
            >
              <option value="all">All Statuses</option>
              <option value="occupied">Occupied</option>
              <option value="vacant">Vacant</option>
            </select>
          </div>
        </div>
      </section>

      {/* Houses Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3.5 px-space-lg">Unit Number</th>
                <th className="py-3.5 px-space-md">Block & Floor</th>
                <th className="py-3.5 px-space-md">Type</th>
                <th className="py-3.5 px-space-md">Primary Resident</th>
                <th className="py-3.5 px-space-md">Parking Slot</th>
                <th className="py-3.5 px-space-md">Intercom</th>
                <th className="py-3.5 px-space-md">Status</th>
                <th className="py-3.5 px-space-lg text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {filteredHouses.map((house) => (
                <tr
                  key={house.id}
                  onClick={() => navigate(`/admin/houses/${house.id}`)}
                  className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-space-lg font-bold text-primary">
                    {house.unitNumber}
                  </td>
                  <td className="py-4 px-space-md">
                    <p className="font-label-md font-semibold text-on-surface">{house.blockName}</p>
                    <p className="font-body-sm text-secondary">{house.floor}</p>
                  </td>
                  <td className="py-4 px-space-md font-body-sm text-secondary">
                    {house.type}
                  </td>
                  <td className="py-4 px-space-md">
                    {house.residentName !== '—' ? (
                      <div>
                        <span className="font-medium text-on-surface block">{house.residentName}</span>
                        <span className="font-body-sm text-secondary text-xs">{house.residentPhone}</span>
                      </div>
                    ) : (
                      <span className="text-secondary italic">Vacant Unit</span>
                    )}
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-secondary">
                    {house.parkingSlot}
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm font-semibold text-primary">
                    #{house.intercom}
                  </td>
                  <td className="py-4 px-space-md">
                    <StatusBadge status={house.status} />
                  </td>
                  <td className="py-4 px-space-lg text-right">
                    <span className="inline-flex items-center gap-1 font-label-sm text-primary font-semibold">
                      <span>Inspect</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
