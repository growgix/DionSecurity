import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const PaymentsPage = () => {
  const { payments, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const totalDisbursed = payments.reduce((acc, p) => acc + p.amount, 0);

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || p.type.toLowerCase().includes(typeFilter.toLowerCase());
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Financial Governance</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Wage & Advance Ledger</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Workforce Payments & Wages
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Bi-weekly and monthly payroll reconciliation, wage advance disbursements, overtime settlements, and audit vouchers.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => {
              recordAudit('EXPORT_PAYMENTS', 'Exported payment vouchers ledger CSV');
              addToast('Payment disbursements ledger exported.', 'info');
            }}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-surface-container-lowest text-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-surface-container-high transition-all border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Ledger</span>
          </button>
          <Link
            to="/admin/payments/add"
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Record Payment / Advance</span>
          </Link>
        </div>
      </section>

      {/* KPI Ribbon */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Total Cycle Disbursements"
          value={`₹${totalDisbursed.toLocaleString()}`}
          icon="account_balance_wallet"
          subtitle="Cleared bank transfers"
        />
        <MetricCard
          title="Wage Advance Balance"
          value="₹32,500"
          icon="payments"
          subtitle="Recoverable next cycle"
        />
        <MetricCard
          title="Overtime Allowances"
          value="₹18,400"
          icon="more_time"
          subtitle="Verified shift hours"
        />
        <MetricCard
          title="Reconciled Vouchers"
          value={payments.length}
          icon="verified"
          subtitle="Zero discrepancy rate"
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
              placeholder="Search by employee, voucher ref #..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
          >
            <option value="all">All Payment Types</option>
            <option value="salary">Monthly Salary</option>
            <option value="advance">Wage Advance</option>
            <option value="overtime">Overtime</option>
          </select>
        </div>
      </section>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[750px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3.5 px-space-lg">Voucher Ref & Date</th>
                <th className="py-3.5 px-space-md">Employee</th>
                <th className="py-3.5 px-space-md">Disbursement Type</th>
                <th className="py-3.5 px-space-md">Mode</th>
                <th className="py-3.5 px-space-md">Disbursed Amount</th>
                <th className="py-3.5 px-space-lg text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 px-space-lg">
                    <span className="font-code-sm text-code-sm font-bold text-primary block">{p.referenceNo}</span>
                    <span className="font-body-sm text-secondary text-xs">{p.paymentDate}</span>
                  </td>
                  <td className="py-4 px-space-md font-medium">
                    <p className="font-semibold text-on-surface">{p.employeeName}</p>
                    <p className="font-code-sm text-code-sm text-secondary text-xs">{p.employeeId}</p>
                  </td>
                  <td className="py-4 px-space-md">
                    <span className="font-label-sm px-2.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                      {p.type}
                    </span>
                  </td>
                  <td className="py-4 px-space-md font-body-sm text-secondary">
                    {p.mode}
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-base font-bold text-primary">
                    ₹{p.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-space-lg text-right">
                    <StatusBadge status={p.status} />
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
