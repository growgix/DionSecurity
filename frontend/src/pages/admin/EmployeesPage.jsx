import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const EmployeesPage = () => {
  const { employees, recordAudit } = useDataStore();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New employee form
  const [name, setName] = useState('');
  const [role, setRole] = useState('Gate Security Officer');
  const [department, setDepartment] = useState('Security & Surveillance');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Main Gate 01');

  const isSupervisor = currentUser?.role === 'supervisor';
  const basePath = isSupervisor ? '/supervisor/workers' : '/admin/workforce';

  const presentCount = employees.filter(e => e.status === 'present' || e.status === 'late').length;
  const securityCount = employees.filter(e => e.department.includes('Security')).length;
  const facilitiesCount = employees.filter(e => !e.department.includes('Security')).length;

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.badgeNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'all' || emp.department === deptFilter;
    const matchesShift = shiftFilter === 'all' || emp.shift.includes(shiftFilter);
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesShift && matchesStatus;
  });

  const handleCreateEmployee = (e) => {
    e.preventDefault();
    recordAudit('WORKER_ENROLLED', `Enrolled new worker ${name} as ${role}`);
    addToast(`Worker ${name} enrolled with badge ID generated.`, 'success');
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Workforce Management</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Estate Personnel</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Workforce Employees (80 Staff)
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Complete active workforce registry across perimeter security, facility engineering, housekeeping, and horticulture.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => {
              recordAudit('EXPORT_WORKFORCE', 'Exported workforce roster CSV');
              addToast('Workforce roster exported.', 'info');
            }}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-surface-container-lowest text-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-surface-container-high transition-all border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Roster</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Enrol Employee</span>
          </button>
        </div>
      </section>

      {/* KPI Ribbon */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Total Workforce Headcount"
          value={employees.length}
          icon="groups"
          subtitle="Enrolled active personnel"
        />
        <MetricCard
          title="On Duty Today"
          value={presentCount}
          icon="check_circle"
          subtitle={`${((presentCount / employees.length) * 100).toFixed(0)}% Shift attendance`}
          badge="90% Quota"
        />
        <MetricCard
          title="Security & Surveillance"
          value={securityCount}
          icon="shield"
          subtitle="Guards, patrol & CCTV crew"
        />
        <MetricCard
          title="Facilities & Housekeeping"
          value={facilitiesCount}
          icon="construction"
          subtitle="Electricians, plumbers & cleaners"
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
              placeholder="Search by worker name, badge #, role..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
            >
              <option value="all">All Departments</option>
              <option value="Security & Surveillance">Security & Surveillance</option>
              <option value="Facilities & Engineering">Facilities & Engineering</option>
              <option value="Housekeeping & Sanitization">Housekeeping & Sanitization</option>
              <option value="Landscaping & Horticulture">Landscaping & Horticulture</option>
            </select>

            <select
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
            >
              <option value="all">All Shifts</option>
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="leave">On Leave</option>
              <option value="late">Late</option>
            </select>
          </div>
        </div>
      </section>

      {/* Employees Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[750px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3.5 px-space-lg">Badge & Name</th>
                <th className="py-3.5 px-space-md">Role & Dept</th>
                <th className="py-3.5 px-space-md">Shift</th>
                <th className="py-3.5 px-space-md">Duty Station</th>
                <th className="py-3.5 px-space-md">Daily Wage</th>
                <th className="py-3.5 px-space-md">Today's Status</th>
                <th className="py-3.5 px-space-lg text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => navigate(`${basePath}/${emp.id}`)}
                  className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-space-lg font-medium text-on-surface flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-label-sm font-semibold shrink-0">
                      {emp.avatar}
                    </div>
                    <div>
                      <span className="font-semibold text-primary block">{emp.name}</span>
                      <span className="font-code-sm text-code-sm text-secondary">{emp.badgeNo}</span>
                    </div>
                  </td>
                  <td className="py-4 px-space-md">
                    <p className="font-label-md font-semibold text-on-surface">{emp.role}</p>
                    <p className="font-body-sm text-secondary text-xs">{emp.department}</p>
                  </td>
                  <td className="py-4 px-space-md font-body-sm text-secondary">
                    {emp.shift}
                  </td>
                  <td className="py-4 px-space-md font-body-sm text-on-surface">
                    {emp.assignedLocation}
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm font-semibold text-primary">
                    ₹{emp.dailyWage}/day
                  </td>
                  <td className="py-4 px-space-md">
                    <StatusBadge status={emp.status} />
                  </td>
                  <td className="py-4 px-space-lg text-right">
                    <span className="inline-flex items-center gap-1 font-label-sm text-primary font-semibold">
                      <span>Profile</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enrol Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Enrol Estate Workforce Personnel"
        subtitle="Issue new employee badge and assign operational department."
      >
        <form onSubmit={handleCreateEmployee} className="space-y-4">
          <div>
            <label className="block font-label-md text-on-surface mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Anand Sharma"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-on-surface mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
              >
                <option value="Security & Surveillance">Security & Surveillance</option>
                <option value="Facilities & Engineering">Facilities & Engineering</option>
                <option value="Housekeeping & Sanitization">Housekeeping & Sanitization</option>
                <option value="Landscaping & Horticulture">Landscaping & Horticulture</option>
              </select>
            </div>
            <div>
              <label className="block font-label-md text-on-surface mb-1">Designation / Role</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Electrician, Patrol Guard"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-on-surface mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98000 00000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
              />
            </div>
            <div>
              <label className="block font-label-md text-on-surface mb-1">Station Assignment</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Block A & B Bay"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
              />
            </div>
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
              Issue Badge & Enrol
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
