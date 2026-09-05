import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { useToast } from '../../context/ToastContext';

export const AddPaymentPage = () => {
  const { employees, addPayment, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [employeeId, setEmployeeId] = useState('WRK-1001');
  const [type, setType] = useState('Monthly Salary');
  const [amount, setAmount] = useState('24500');
  const [mode, setMode] = useState('NEFT / Direct Bank');
  const [remarks, setRemarks] = useState('');

  const selectedEmployee = employees.find(e => e.id === employeeId) || employees[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      addToast('Please enter a valid payment amount.', 'warning');
      return;
    }

    addPayment({
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      amount: numAmount,
      type: type,
      mode: mode,
      remarks: remarks
    });

    navigate('/admin/payments');
  };

  return (
    <div className="flex flex-col w-full gap-space-lg max-w-3xl mx-auto pb-space-xl">
      {/* Header */}
      <div className="flex flex-col gap-space-2xs">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
          Financial Management • Voucher Disbursement
        </span>
        <h1 className="font-display-lg text-display-lg sm:text-[36px] text-primary tracking-tight">
          Record Payment / Wage Advance
        </h1>
        <p className="font-body-md text-body-md text-secondary">
          Generate financial disbursement voucher for salary, advance draw, or approved overtime compensation.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
        {/* Select Employee */}
        <div>
          <label className="block font-label-md text-on-surface mb-1 font-semibold">
            Beneficiary Workforce Personnel *
          </label>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-md font-medium"
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name} — {emp.role} (Daily Wage: ₹{emp.dailyWage}, Base: ₹{emp.monthlyWage})
              </option>
            ))}
          </select>
        </div>

        {/* Selected Employee Snapshot */}
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between text-body-sm">
          <div>
            <span className="font-semibold text-on-surface">{selectedEmployee.name}</span>
            <p className="text-secondary text-xs">{selectedEmployee.department} • Badge #{selectedEmployee.badgeNo}</p>
          </div>
          <span className="font-code-sm font-bold text-primary">Monthly Base: ₹{selectedEmployee.monthlyWage.toLocaleString()}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-label-md text-on-surface mb-1 font-semibold">
              Disbursement Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-md"
            >
              <option value="Monthly Salary">Monthly Salary</option>
              <option value="Wage Advance">Wage Advance</option>
              <option value="Overtime Allowance">Overtime Allowance</option>
              <option value="Festival Bonus">Festival Bonus</option>
            </select>
          </div>

          <div>
            <label className="block font-label-md text-on-surface mb-1 font-semibold">
              Disbursement Amount (₹) *
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 24500"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-code-sm text-base font-bold text-primary focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block font-label-md text-on-surface mb-1 font-semibold">
            Settlement Mode
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-md"
          >
            <option value="NEFT / Direct Bank">NEFT / Direct Bank Transfer</option>
            <option value="IMPS Instant">IMPS Instant Transfer</option>
            <option value="UPI Direct">UPI Direct Handle</option>
            <option value="Petty Cash Voucher">Petty Cash Voucher</option>
          </select>
        </div>

        <div>
          <label className="block font-label-md text-on-surface mb-1 font-semibold">
            Audit Remarks / Reference Voucher Notes
          </label>
          <textarea
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. Cycle settlement for period Sep 01 - Sep 15"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-md focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={() => navigate('/admin/payments')}
            className="px-5 py-2.5 rounded-xl text-secondary hover:bg-surface-container font-label-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Authorize & Disburse</span>
          </button>
        </div>
      </form>
    </div>
  );
};
