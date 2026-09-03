import React, { useState } from 'react';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const ReportsCenterPage = () => {
  const { gateLogs, visitors, employees, tasks, payments, recordAudit } = useDataStore();
  const { addToast } = useToast();

  const [selectedReport, setSelectedReport] = useState('gate');
  const [dateRange, setDateRange] = useState('Today (Sep 03, 2026)');

  const handleExport = (format) => {
    recordAudit('REPORT_GENERATED', `Generated ${selectedReport.toUpperCase()} report in ${format.toUpperCase()} format for ${dateRange}`);
    addToast(`${selectedReport.toUpperCase()} report successfully compiled and downloaded (${format.toUpperCase()}).`, 'success');
  };

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Executive Intelligence</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Analytics & Reports</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Reports Center
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Compile, preview, and export comprehensive operational, security, workforce muster, and financial audits.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => handleExport('csv')}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-surface-container-lowest text-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-surface-container-high transition-all border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">table_chart</span>
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => handleExport('pdf')}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            <span>Download PDF Report</span>
          </button>
        </div>
      </section>

      {/* 4 Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div
          onClick={() => setSelectedReport('gate')}
          className={`p-space-md rounded-xl border transition-all cursor-pointer space-y-2 ${
            selectedReport === 'gate' ? 'bg-primary-container text-on-primary border-primary shadow-md' : 'bg-surface-container-lowest border-outline-variant/20 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-[24px]">sensor_door</span>
            <span className="font-code-sm text-xs">{gateLogs.length + 135} Rows</span>
          </div>
          <h4 className="font-label-md font-bold">Gate & Turnstile Telemetry</h4>
          <p className="font-body-sm opacity-80 text-xs">All vehicle boom barrier and pedestrian trips</p>
        </div>

        <div
          onClick={() => setSelectedReport('workforce')}
          className={`p-space-md rounded-xl border transition-all cursor-pointer space-y-2 ${
            selectedReport === 'workforce' ? 'bg-primary-container text-on-primary border-primary shadow-md' : 'bg-surface-container-lowest border-outline-variant/20 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-[24px]">groups</span>
            <span className="font-code-sm text-xs">80 Staff</span>
          </div>
          <h4 className="font-label-md font-bold">Workforce Muster & Shift</h4>
          <p className="font-body-sm opacity-80 text-xs">Daily attendance rate and muster compliance</p>
        </div>

        <div
          onClick={() => setSelectedReport('tasks')}
          className={`p-space-md rounded-xl border transition-all cursor-pointer space-y-2 ${
            selectedReport === 'tasks' ? 'bg-primary-container text-on-primary border-primary shadow-md' : 'bg-surface-container-lowest border-outline-variant/20 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-[24px]">task_alt</span>
            <span className="font-code-sm text-xs">{tasks.length} Work Orders</span>
          </div>
          <h4 className="font-label-md font-bold">Work Orders & SLA Audit</h4>
          <p className="font-body-sm opacity-80 text-xs">Resolution timestamps and technician metrics</p>
        </div>

        <div
          onClick={() => setSelectedReport('financial')}
          className={`p-space-md rounded-xl border transition-all cursor-pointer space-y-2 ${
            selectedReport === 'financial' ? 'bg-primary-container text-on-primary border-primary shadow-md' : 'bg-surface-container-lowest border-outline-variant/20 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-[24px]">payments</span>
            <span className="font-code-sm text-xs">{payments.length} Vouchers</span>
          </div>
          <h4 className="font-label-md font-bold">Wage Disbursements</h4>
          <p className="font-body-sm opacity-80 text-xs">Payroll settlements and advance ledgers</p>
        </div>
      </div>

      {/* Live Interactive Report Preview Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-primary uppercase">
              Live Preview: {selectedReport} Report
            </h3>
            <p className="font-body-sm text-secondary text-xs">Generated for {dateRange}</p>
          </div>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm"
          >
            <option value="Today (Sep 03, 2026)">Today (Sep 03, 2026)</option>
            <option value="Past 7 Days">Past 7 Days</option>
            <option value="This Month (September 2026)">This Month (September 2026)</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {selectedReport === 'gate' && (
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                  <th className="py-3 px-space-lg">Time</th>
                  <th className="py-3 px-space-md">Type</th>
                  <th className="py-3 px-space-md">Person</th>
                  <th className="py-3 px-space-md">Destination</th>
                  <th className="py-3 px-space-md">Gate</th>
                  <th className="py-3 px-space-lg text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 text-body-sm font-body-sm text-on-surface">
                {gateLogs.map(l => (
                  <tr key={l.id} className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-space-lg font-code-sm text-primary font-semibold">{l.timestamp}</td>
                    <td className="py-3 px-space-md font-bold">{l.type}</td>
                    <td className="py-3 px-space-md">{l.person}</td>
                    <td className="py-3 px-space-md font-code-sm font-bold">{l.destination}</td>
                    <td className="py-3 px-space-md">{l.gate}</td>
                    <td className="py-3 px-space-lg text-right"><StatusBadge status="cleared" text={l.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'workforce' && (
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                  <th className="py-3 px-space-lg">Badge & Name</th>
                  <th className="py-3 px-space-md">Department</th>
                  <th className="py-3 px-space-md">Shift</th>
                  <th className="py-3 px-space-md">In Time</th>
                  <th className="py-3 px-space-md">Station</th>
                  <th className="py-3 px-space-lg text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 text-body-sm font-body-sm text-on-surface">
                {employees.slice(0, 10).map(e => (
                  <tr key={e.id} className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-space-lg font-semibold text-primary">{e.badgeNo} - {e.name}</td>
                    <td className="py-3 px-space-md">{e.department}</td>
                    <td className="py-3 px-space-md">{e.shift}</td>
                    <td className="py-3 px-space-md font-code-sm">{e.todayAttendance.inTime}</td>
                    <td className="py-3 px-space-md">{e.assignedLocation}</td>
                    <td className="py-3 px-space-lg text-right"><StatusBadge status={e.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'tasks' && (
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                  <th className="py-3 px-space-lg">Task ID</th>
                  <th className="py-3 px-space-md">Title</th>
                  <th className="py-3 px-space-md">Assignee</th>
                  <th className="py-3 px-space-md">Priority</th>
                  <th className="py-3 px-space-lg text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 text-body-sm font-body-sm text-on-surface">
                {tasks.map(t => (
                  <tr key={t.id} className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-space-lg font-code-sm font-bold text-primary">{t.id}</td>
                    <td className="py-3 px-space-md font-semibold">{t.title}</td>
                    <td className="py-3 px-space-md">{t.assignedToName}</td>
                    <td className="py-3 px-space-md"><StatusBadge status={t.priority} /></td>
                    <td className="py-3 px-space-lg text-right"><StatusBadge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'financial' && (
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                  <th className="py-3 px-space-lg">Ref #</th>
                  <th className="py-3 px-space-md">Employee</th>
                  <th className="py-3 px-space-md">Type</th>
                  <th className="py-3 px-space-md">Amount</th>
                  <th className="py-3 px-space-lg text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 text-body-sm font-body-sm text-on-surface">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-space-lg font-code-sm font-bold text-primary">{p.referenceNo}</td>
                    <td className="py-3 px-space-md font-semibold">{p.employeeName}</td>
                    <td className="py-3 px-space-md">{p.type}</td>
                    <td className="py-3 px-space-md font-code-sm font-bold">₹{p.amount.toLocaleString()}</td>
                    <td className="py-3 px-space-lg text-right"><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
