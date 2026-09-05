import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminDashboard = () => {
  const { visitors, employees, tasks, gateLogs, blocks, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('all');

  const currentlyInsideCount = visitors.filter(v => v.status === 'inside').length;
  const presentEmployeesCount = employees.filter(e => e.status === 'present' || e.status === 'late').length;
  const pendingTasksCount = tasks.filter(t => t.status === 'created' || t.status === 'assigned' || t.status === 'in_progress').length;
  const totalOccupancy = blocks.reduce((acc, b) => acc + b.occupiedHouses, 0);
  const totalUnits = blocks.reduce((acc, b) => acc + b.totalHouses, 0);
  const occupancyPercentage = ((totalOccupancy / totalUnits) * 100).toFixed(1);

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    recordAudit('ESTATE_BROADCAST', `Broadcast sent to ${broadcastTarget}: "${broadcastMessage.trim()}"`);
    addToast(`Broadcast dispatched to ${broadcastTarget === 'all' ? 'all estate gates and resident terminals' : broadcastTarget}!`, 'success');
    setBroadcastMessage('');
    setShowBroadcastModal(false);
  };

  return (
    <div className="flex flex-col w-full gap-space-xl">
      {/* Top Greeting & Executive Oversight Ribbon */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-xs">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-sm text-secondary font-label-sm text-label-sm uppercase tracking-wider flex-wrap">
            <span>Estate Executive Control</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-primary font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Greenwood Estates — Live Monitoring active
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Good morning, Admin
          </h1>
          <p className="font-label-md text-label-md text-secondary">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
          <div className="inline-flex items-center gap-space-xs px-space-md py-2 bg-surface-container rounded-lg shadow-sm">
            <span className="material-symbols-outlined text-[18px] text-secondary">calendar_today</span>
            <span className="font-label-md text-label-md text-on-surface">Live Day Protocol</span>
          </div>
          <button
            type="button"
            onClick={() => {
              recordAudit('EXPORT_REPORT', 'Exported executive brief PDF');
              addToast('Executive Daily Briefing PDF downloaded.', 'info');
            }}
            className="inline-flex items-center gap-space-xs px-space-md py-2 bg-primary text-on-primary rounded-lg shadow-sm hover:bg-primary-container transition-colors font-label-md"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Brief</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Visitors Today"
          value={visitors.length + 80}
          icon="sensor_door"
          subtitle="Total throughput at pedestrian and perimeter gates"
          delta="12% vs yest."
          deltaType="up"
        />

        <MetricCard
          title="Currently Inside"
          value={currentlyInsideCount}
          icon="groups"
          subtitle="Guests, contractors & delivery logistics"
          badge="Active on premises"
          pulse={true}
        />

        <MetricCard
          title="Employees Present"
          value={presentEmployeesCount}
          icon="badge"
          subtitle={`${presentEmployeesCount} of ${employees.length} verified staff rostered today`}
          delta={`${((presentEmployeesCount / employees.length) * 100).toFixed(0)}% quota`}
          deltaType="neutral"
        />

        <MetricCard
          title="Pending Tasks"
          value={pendingTasksCount}
          icon="task_alt"
          subtitle="Facilities, patrols & resident requisitions"
          badge={`${tasks.filter(t => t.priority === 'urgent').length} priority`}
          deltaType="error"
        />
      </section>

      {/* Two-Column Asymmetrical Grid: 65% Left, 35% Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        {/* Left Column (approx 65%) */}
        <div className="lg:col-span-8 flex flex-col gap-space-xl">
          
          {/* Section 1: Current Activity Table */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col border border-outline-variant/20">
            <div className="p-space-lg flex items-center justify-between bg-surface-container-lowest border-b border-outline-variant/20 flex-wrap gap-2">
              <div className="flex items-center gap-space-sm">
                <h2 className="font-headline-sm text-headline-sm text-primary">Current Activity</h2>
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-high text-secondary">
                  Realtime Stream
                </span>
              </div>
              <Link
                to="/admin/security/gate-activity"
                className="inline-flex items-center gap-1 text-primary font-label-md text-label-md hover:underline font-medium"
              >
                <span>View All Logs</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                    <th className="py-3 px-space-lg">Person</th>
                    <th className="py-3 px-space-md">Classification</th>
                    <th className="py-3 px-space-md">Location</th>
                    <th className="py-3 px-space-md">Entry</th>
                    <th className="py-3 px-space-lg text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
                  {visitors.slice(0, 5).map((visitor) => (
                    <tr
                      key={visitor.id}
                      onClick={() => navigate(`/admin/visitors/${visitor.id}`)}
                      className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-space-lg font-medium text-on-surface flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm text-label-sm font-semibold shrink-0">
                          {visitor.avatar}
                        </div>
                        <span className="truncate">{visitor.name}</span>
                      </td>
                      <td className="py-3.5 px-space-md">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                          {visitor.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-space-md font-code-sm text-code-sm text-secondary">
                        {visitor.hostUnit}
                      </td>
                      <td className="py-3.5 px-space-md font-code-sm text-code-sm text-secondary">
                        {visitor.entryTime}
                      </td>
                      <td className="py-3.5 px-space-lg text-right">
                        <StatusBadge status={visitor.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Perimeter Array & Gate Network Telemetry */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/20 flex flex-col gap-space-md">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-primary">Perimeter Array Telemetry</h2>
                <p className="font-body-sm text-body-sm text-secondary">4 Automated Gates, 14 Biometric Sensors</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Gate Net v4.2 Synchronized
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-2">
              <div className="p-space-md rounded-xl bg-surface-container-low/50 border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md font-semibold text-primary">Gate 01 (Main North)</span>
                  <StatusBadge status="cleared" text="Online" />
                </div>
                <div className="flex items-center justify-between text-body-sm text-secondary">
                  <span>Guard on duty: Officer C. Miller</span>
                  <span className="font-code-sm">Throughput: 86</span>
                </div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container-low/50 border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md font-semibold text-primary">Gate 02 (East Service)</span>
                  <StatusBadge status="cleared" text="Online" />
                </div>
                <div className="flex items-center justify-between text-body-sm text-secondary">
                  <span>Guard on duty: Officer D. Kadam</span>
                  <span className="font-code-sm">Throughput: 34</span>
                </div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (approx 35%) */}
        <div className="lg:col-span-4 flex flex-col gap-space-xl">
          
          {/* Quick Dispatch Actions */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/20 flex flex-col gap-space-sm">
            <h3 className="font-headline-sm text-headline-sm text-primary mb-1">Operational Dispatch</h3>
            
            <button
              type="button"
              onClick={() => setShowBroadcastModal(true)}
              className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">campaign</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md font-semibold text-on-surface">Estate Broadcast</p>
                  <p className="font-body-sm text-body-sm text-secondary">Dispatch alert to all gates</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/tasks/new')}
              className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary text-on-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">add_task</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md font-semibold text-on-surface">Assign Workforce Task</p>
                  <p className="font-body-sm text-body-sm text-secondary">Allocate staff to task</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/blocks')}
              className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">domain</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md font-semibold text-on-surface">Estate Infrastructure</p>
                  <p className="font-body-sm text-body-sm text-secondary">Manage 6 blocks & 255 units</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
            </button>
          </div>

          {/* Estate Governance Snapshot */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/20 flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-primary">Occupancy Ledger</h3>
              <span className="font-code-sm text-code-sm font-semibold text-primary">
                {occupancyPercentage}% Occupied
              </span>
            </div>

            <div className="space-y-3">
              {blocks.slice(0, 4).map((b) => (
                <div key={b.id} className="space-y-1">
                  <div className="flex justify-between text-body-sm font-medium">
                    <span className="text-on-surface">{b.name}</span>
                    <span className="text-secondary">{b.occupiedHouses} / {b.totalHouses} units</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all"
                      style={{ width: `${b.occupancyRate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/admin/blocks"
              className="font-label-sm text-label-sm text-primary font-semibold hover:underline mt-2 text-center"
            >
              View Full Society Roster & Wings →
            </Link>
          </div>
        </div>
      </div>

      {/* Estate Broadcast Modal */}
      <Modal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        title="Send Estate Broadcast"
        subtitle="Transmit priority operational notice to gate guards & facility personnel."
      >
        <form onSubmit={handleSendBroadcast} className="space-y-4">
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1 font-medium">
              Target Audience
            </label>
            <select
              value={broadcastTarget}
              onChange={(e) => setBroadcastTarget(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
            >
              <option value="all">All Gate Terminals & Facility Stations</option>
              <option value="Gate 01 & Gate 02 Only">Main Gates (Gate 01 & 02)</option>
              <option value="Security Personnel">Security Guards Only</option>
              <option value="Facilities & Engineering">Facilities Crew Only</option>
            </select>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1 font-medium">
              Broadcast Message
            </label>
            <textarea
              rows={3}
              required
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="e.g. Mandatory vehicle trunk inspection protocol active for all delivery logistics."
              className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowBroadcastModal(false)}
              className="px-4 py-2 rounded-xl text-secondary hover:bg-surface-container font-label-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container"
            >
              Dispatch Broadcast
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
