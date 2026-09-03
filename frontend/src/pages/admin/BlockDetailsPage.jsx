import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const BlockDetailsPage = () => {
  const { id } = useParams();
  const { blocks, houses, residents, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('houses');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const block = blocks.find(b => b.id === id) || blocks[0];
  const blockHouses = houses.filter(h => h.blockId === block.id || h.blockName === block.name);
  const blockResidents = residents.filter(r => r.blockId === block.id || r.blockName === block.name);

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        backTo="/admin/blocks"
        backLabel="Back to Blocks"
        items={[
          { label: 'Society', to: '/admin/blocks' },
          { label: 'Blocks', to: '/admin/blocks' },
          { label: block.name }
        ]}
      />

      {/* Primary Block Header & Oversight Actions */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-md flex-wrap">
              <h1 className="font-display-lg text-display-lg sm:text-[36px] text-primary tracking-tight">
                {block.name}
              </h1>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-primary text-label-sm font-label-sm shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>Active Sector</span>
              </div>
              <span className="font-label-sm text-label-sm text-outline px-2.5 py-0.5 rounded bg-surface-container">
                {block.wings}
              </span>
            </div>

            {/* Metric pill strip */}
            <div className="flex items-center flex-wrap gap-y-2 gap-x-space-md text-body-md font-body-md text-secondary pt-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">apartment</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">{block.totalHouses}</span>
                <span className="text-on-surface-variant">Houses</span>
              </div>
              <span className="text-outline-variant">•</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">{block.occupiedHouses}</span>
                <span className="text-on-surface-variant">Occupied</span>
              </div>
              <span className="text-outline-variant">•</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#A67C37]"></span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">{block.vacantHouses}</span>
                <span className="text-on-surface-variant">Vacant</span>
              </div>
              <span className="text-outline-variant">•</span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary">groups</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">{block.residentsCount}</span>
                <span className="text-on-surface-variant">Verified Residents</span>
              </div>
            </div>
          </div>

          {/* Action Cluster */}
          <div className="flex items-center gap-space-sm shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setShowDeactivateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-error-container/30 hover:bg-error-container text-on-error-container font-label-md text-label-md transition-all font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">block</span>
              <span>Deactivate Block</span>
            </button>
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-sm transition-all font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">edit_square</span>
              <span>Edit Block</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards in Executive Editorial Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        <MetricCard
          title="Occupancy Ratio"
          value={`${block.occupancyRate}%`}
          icon="pie_chart"
          subtitle={`${block.occupiedHouses} / ${block.totalHouses} units occupied`}
        />
        <MetricCard
          title="Assigned Supervisor"
          value={block.supervisor.split(' ')[1] || 'Thorne'}
          icon="supervisor_account"
          subtitle={block.supervisor}
        />
        <MetricCard
          title="Elevator Systems"
          value={`${block.elevators} Active`}
          icon="elevator"
          subtitle="All shafts certified & operational"
        />
        <MetricCard
          title="Gate Network"
          value={block.gateAccess}
          icon="sensor_door"
          subtitle="Direct pedestrian & vehicular access"
        />
      </div>

      {/* Tab Controls: Houses vs Residents */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 p-1 bg-surface-container rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('houses')}
              className={`px-4 py-1.5 rounded-lg font-label-md transition-colors ${
                activeTab === 'houses' ? 'bg-surface-container-lowest shadow-sm text-primary font-semibold' : 'text-secondary hover:text-on-surface'
              }`}
            >
              Housing Units ({blockHouses.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('residents')}
              className={`px-4 py-1.5 rounded-lg font-label-md transition-colors ${
                activeTab === 'residents' ? 'bg-surface-container-lowest shadow-sm text-primary font-semibold' : 'text-secondary hover:text-on-surface'
              }`}
            >
              Residents Roster ({blockResidents.length})
            </button>
          </div>

          <Link
            to="/admin/houses"
            className="inline-flex items-center gap-1 font-label-sm text-primary hover:underline font-semibold"
          >
            <span>Browse Global House Directory</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {/* Tab 1: Houses List */}
        {activeTab === 'houses' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[650px]">
              <thead>
                <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                  <th className="py-3 px-space-lg">Unit Number</th>
                  <th className="py-3 px-space-md">Floor & Type</th>
                  <th className="py-3 px-space-md">Primary Resident</th>
                  <th className="py-3 px-space-md">Parking Bay</th>
                  <th className="py-3 px-space-md">Occupancy</th>
                  <th className="py-3 px-space-lg text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
                {blockHouses.map((house) => (
                  <tr
                    key={house.id}
                    onClick={() => navigate(`/admin/houses/${house.id}`)}
                    className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-space-lg font-semibold text-primary">
                      {house.unitNumber}
                    </td>
                    <td className="py-3.5 px-space-md">
                      <p className="font-label-md">{house.type}</p>
                      <p className="font-body-sm text-secondary">{house.floor}</p>
                    </td>
                    <td className="py-3.5 px-space-md font-body-md">
                      {house.residentName !== '—' ? (
                        <span className="font-medium text-on-surface">{house.residentName}</span>
                      ) : (
                        <span className="text-secondary italic">Vacant</span>
                      )}
                    </td>
                    <td className="py-3.5 px-space-md font-code-sm text-code-sm text-secondary">
                      {house.parkingSlot}
                    </td>
                    <td className="py-3.5 px-space-md">
                      <StatusBadge status={house.status} />
                    </td>
                    <td className="py-3.5 px-space-lg text-right">
                      <span className="inline-flex items-center gap-1 font-label-sm text-primary font-semibold">
                        <span>Details</span>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Residents List */}
        {activeTab === 'residents' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[650px]">
              <thead>
                <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                  <th className="py-3 px-space-lg">Resident Name</th>
                  <th className="py-3 px-space-md">Unit</th>
                  <th className="py-3 px-space-md">Category</th>
                  <th className="py-3 px-space-md">Contact</th>
                  <th className="py-3 px-space-md">Vehicles</th>
                  <th className="py-3 px-space-lg text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
                {blockResidents.map((res) => (
                  <tr
                    key={res.id}
                    onClick={() => navigate(`/admin/residents`)}
                    className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-space-lg font-medium text-on-surface flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm font-semibold">
                        {res.avatar}
                      </div>
                      <span className="font-semibold">{res.name}</span>
                    </td>
                    <td className="py-3.5 px-space-md font-code-sm text-code-sm font-bold text-primary">
                      {res.unitNumber}
                    </td>
                    <td className="py-3.5 px-space-md font-body-sm text-secondary">
                      {res.category}
                    </td>
                    <td className="py-3.5 px-space-md font-body-sm text-secondary">
                      {res.phone}
                    </td>
                    <td className="py-3.5 px-space-md font-code-sm text-code-sm text-secondary">
                      {res.vehicles.join(', ') || 'None'}
                    </td>
                    <td className="py-3.5 px-space-lg text-right">
                      <StatusBadge status={res.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Block Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit ${block.name}`}
        subtitle="Update block configuration parameters."
      >
        <div className="space-y-4">
          <div>
            <label className="block font-label-md text-on-surface mb-1">Block Name</label>
            <input
              type="text"
              defaultValue={block.name}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
            />
          </div>
          <div>
            <label className="block font-label-md text-on-surface mb-1">Sector Assignment</label>
            <input
              type="text"
              defaultValue={block.sector}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 rounded-xl text-secondary hover:bg-surface-container font-label-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                recordAudit('BLOCK_EDITED', `Updated configuration for ${block.name}`);
                addToast(`Saved changes for ${block.name}.`, 'success');
                setShowEditModal(false);
              }}
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Deactivate Confirmation Modal */}
      <Modal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        title="Deactivate Residential Block"
        subtitle={`Are you sure you want to mark ${block.name} as deactivated?`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="font-body-md text-secondary">
            Deactivating this block will disable digital turnstile access credentials and flag all {block.occupiedHouses} occupied units for executive review.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowDeactivateModal(false)}
              className="px-4 py-2 rounded-xl text-secondary hover:bg-surface-container font-label-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                recordAudit('BLOCK_DEACTIVATED', `Deactivated ${block.name}`);
                addToast(`${block.name} has been deactivated.`, 'warning');
                setShowDeactivateModal(false);
              }}
              className="px-5 py-2 rounded-xl bg-error text-on-error font-label-md font-semibold hover:bg-error/90"
            >
              Confirm Deactivation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
