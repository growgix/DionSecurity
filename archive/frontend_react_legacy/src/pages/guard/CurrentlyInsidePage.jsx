import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const CurrentlyInsidePage = () => {
  const { visitors, checkoutVisitor, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [exitTarget, setExitTarget] = useState(null);

  const currentlyInside = visitors.filter(v => v.status === 'inside');

  const filteredVisitors = currentlyInside.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.hostUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || v.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const handleConfirmExit = () => {
    if (exitTarget) {
      checkoutVisitor(exitTarget.id, 'Gate 01');
      setExitTarget(null);
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Perimeter Gate Operations</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Live Premises Occupancy</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Currently Inside
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Real-time occupancy registry of non-resident guests, ride-hailing cabs, couriers, and contractors active within the estate perimeter.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => {
              recordAudit('EXPORT_OCCUPANCY', 'Exported live occupancy ledger CSV');
              addToast('Live occupancy snapshot exported.', 'info');
            }}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-surface-container-lowest text-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-surface-container-high transition-all border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Snapshot</span>
          </button>
          <Link
            to="/guard/visitors/new"
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Authorize Entry</span>
          </Link>
        </div>
      </section>

      {/* KPI Ribbon */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Active Occupancy"
          value={currentlyInside.length}
          icon="groups"
          subtitle="Non-resident personnel on site"
          badge="Live"
          pulse={true}
        />
        <MetricCard
          title="Guests & Families"
          value={currentlyInside.filter(v => v.category.includes('Guest')).length}
          icon="person"
          subtitle="Authorized by residents"
        />
        <MetricCard
          title="Delivery & Cabs"
          value={currentlyInside.filter(v => v.category.includes('Cab') || v.category.includes('Delivery') || v.category.includes('Food')).length}
          icon="local_shipping"
          subtitle="Transit passes active"
        />
        <MetricCard
          title="Contractors & Techs"
          value={currentlyInside.filter(v => v.category.includes('Contractor') || v.category.includes('Regular')).length}
          icon="engineering"
          subtitle="Maintenance clearances"
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
              placeholder="Search active visitor, pass #, flat, vehicle..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
          >
            <option value="all">All Active Categories</option>
            <option value="guest">Guests</option>
            <option value="cab">Cabs</option>
            <option value="delivery">Delivery</option>
            <option value="contractor">Contractors</option>
          </select>
        </div>
      </section>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[750px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3.5 px-space-lg">Pass ID & Visitor</th>
                <th className="py-3.5 px-space-md">Category</th>
                <th className="py-3.5 px-space-md">Host / Unit</th>
                <th className="py-3.5 px-space-md">Vehicle</th>
                <th className="py-3.5 px-space-md">Entry Time</th>
                <th className="py-3.5 px-space-md">Duration Inside</th>
                <th className="py-3.5 px-space-lg text-right">Gate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {filteredVisitors.map((vis) => (
                <tr key={vis.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 px-space-lg font-medium text-on-surface flex items-center gap-3">
                    <span className="font-code-sm text-code-sm font-bold text-primary px-2 py-0.5 rounded bg-surface-container shrink-0">
                      {vis.badgeNumber}
                    </span>
                    <div>
                      <span className="font-semibold text-primary block">{vis.name}</span>
                      <span className="font-body-sm text-secondary text-xs">{vis.phone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-space-md">
                    <span className="font-label-sm px-2.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
                      {vis.category}
                    </span>
                  </td>
                  <td className="py-4 px-space-md">
                    <p className="font-code-sm font-bold text-primary">{vis.hostUnit}</p>
                    <p className="font-body-sm text-secondary text-xs">{vis.hostResident}</p>
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-secondary">
                    {vis.vehicleNumber}
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-secondary">
                    {vis.entryTime}
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm font-semibold text-primary">
                    {vis.duration}
                  </td>
                  <td className="py-4 px-space-lg text-right">
                    <button
                      type="button"
                      onClick={() => setExitTarget(vis)}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-error-container/40 text-error hover:bg-error hover:text-on-error transition-all font-label-sm font-semibold shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      <span>Record Exit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      <Modal
        isOpen={!!exitTarget}
        onClose={() => setExitTarget(null)}
        title="Confirm Visitor Exit & Pass Revocation"
        subtitle={`Recording departure for ${exitTarget?.name} (Badge #${exitTarget?.badgeNumber})`}
        maxWidth="max-w-md"
      >
        {exitTarget && (
          <div className="space-y-4">
            <p className="font-body-md text-secondary">
              Surrendered pass card #{exitTarget.badgeNumber} has been returned. Confirming will update the live occupancy counter and log departure in the audit ledger.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setExitTarget(null)}
                className="px-4 py-2 rounded-xl text-secondary hover:bg-surface-container font-label-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmExit}
                className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container shadow-md"
              >
                Confirm Exit & Clear Pass
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
