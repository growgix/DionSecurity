import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const BlocksPage = () => {
  const { blocks, addBlock, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Block Form state
  const [newBlockName, setNewBlockName] = useState('');
  const [newBlockSector, setNewBlockSector] = useState('Sector 2 (Central Boulevard)');
  const [newBlockWings, setNewBlockWings] = useState('Wings G1 – G4');
  const [newBlockUnits, setNewBlockUnits] = useState(40);

  const totalUnits = blocks.reduce((sum, b) => sum + b.totalHouses, 0);
  const totalOccupied = blocks.reduce((sum, b) => sum + b.occupiedHouses, 0);
  const totalResidents = blocks.reduce((sum, b) => sum + b.residentsCount, 0);
  const avgOccupancy = ((totalOccupied / totalUnits) * 100).toFixed(1);

  const filteredBlocks = blocks.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.wings.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = sectorFilter === 'all' || b.sector.includes(sectorFilter);
    return matchesSearch && matchesSector;
  });

  const handleCreateBlock = (e) => {
    e.preventDefault();
    if (!newBlockName.trim()) return;

    addBlock({
      name: newBlockName.trim(),
      sector: newBlockSector,
      wings: newBlockWings,
      totalHouses: Number(newBlockUnits)
    });

    setNewBlockName('');
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Architectural Ledger Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Estate Infrastructure</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Residential Sectors</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Blocks
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Manage apartment blocks and view occupancy information across the Greenwood Heights estate perimeter.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => {
              recordAudit('EXPORT_BLOCKS', 'Exported blocks registry CSV');
              addToast('Blocks infrastructure registry exported.', 'info');
            }}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-surface-container-lowest text-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-surface-container-high transition-all border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Registry</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Add Block</span>
          </button>
        </div>
      </section>

      {/* Metric Snapshot Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Total Blocks"
          value={blocks.length}
          icon="domain"
          subtitle="Sector 1-4 perimeter"
        />
        <MetricCard
          title="Total Units"
          value={totalUnits}
          icon="apartment"
          subtitle="100% Configured in Ledger"
        />
        <MetricCard
          title="Occupancy Rate"
          value={`${avgOccupancy}%`}
          icon="pie_chart"
          subtitle={`${totalOccupied} / ${totalUnits} occupied`}
        />
        <MetricCard
          title="Resident Headcount"
          value={totalResidents}
          icon="group"
          subtitle="Active verified badges"
        />
      </section>

      {/* Filter & Utility Toolbar */}
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
              placeholder="Search blocks by name, sector or wing..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
            >
              <option value="all">All Sectors</option>
              <option value="Sector 1">Sector 1</option>
              <option value="Sector 2">Sector 2</option>
              <option value="Sector 3">Sector 3</option>
              <option value="Sector 4">Sector 4</option>
            </select>
          </div>
        </div>
      </section>

      {/* Blocks Data Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3.5 px-space-lg">Block Name</th>
                <th className="py-3.5 px-space-md">Sector & Wings</th>
                <th className="py-3.5 px-space-md">Houses</th>
                <th className="py-3.5 px-space-md">Occupancy</th>
                <th className="py-3.5 px-space-md">Residents</th>
                <th className="py-3.5 px-space-md">Gate Access</th>
                <th className="py-3.5 px-space-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {filteredBlocks.map((block) => (
                <tr
                  key={block.id}
                  onClick={() => navigate(`/admin/blocks/${block.id}`)}
                  className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-space-lg font-medium text-on-surface flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center font-display-lg text-sm font-semibold shrink-0">
                      {block.name.replace('Block ', '')}
                    </div>
                    <div>
                      <span className="font-semibold text-primary block">{block.name}</span>
                      <span className="font-code-sm text-code-sm text-secondary">{block.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-space-md">
                    <p className="font-label-md text-on-surface">{block.sector}</p>
                    <p className="font-body-sm text-secondary">{block.wings}</p>
                  </td>
                  <td className="py-4 px-space-md font-body-sm">
                    <span className="font-semibold text-on-surface">{block.totalHouses}</span>
                    <span className="text-secondary text-xs block">({block.occupiedHouses} Occ / {block.vacantHouses} Vac)</span>
                  </td>
                  <td className="py-4 px-space-md">
                    <div className="flex items-center gap-2">
                      <span className="font-code-sm font-semibold">{block.occupancyRate}%</span>
                      <div className="w-16 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${block.occupancyRate}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm font-semibold text-on-surface">
                    {block.residentsCount}
                  </td>
                  <td className="py-4 px-space-md font-body-sm text-secondary">
                    {block.gateAccess}
                  </td>
                  <td className="py-4 px-space-lg text-right">
                    <Link
                      to={`/admin/blocks/${block.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm font-semibold transition-colors"
                    >
                      <span>View Wing</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Block Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New Residential Block"
        subtitle="Add a new sector wing to the Greenwood Heights perimeter configuration."
      >
        <form onSubmit={handleCreateBlock} className="space-y-4">
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1 font-medium">
              Block Name
            </label>
            <input
              type="text"
              required
              value={newBlockName}
              onChange={(e) => setNewBlockName(e.target.value)}
              placeholder="e.g. Block G (Garden Terraces)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1 font-medium">
                Sector Location
              </label>
              <input
                type="text"
                required
                value={newBlockSector}
                onChange={(e) => setNewBlockSector(e.target.value)}
                placeholder="e.g. Sector 2 (Central Boulevard)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1 font-medium">
                Total Housing Units
              </label>
              <input
                type="number"
                min={1}
                max={200}
                required
                value={newBlockUnits}
                onChange={(e) => setNewBlockUnits(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1 font-medium">
              Wing Architecture Breakdown
            </label>
            <input
              type="text"
              value={newBlockWings}
              onChange={(e) => setNewBlockWings(e.target.value)}
              placeholder="e.g. Wings G1 – G4"
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
              Register Block
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
