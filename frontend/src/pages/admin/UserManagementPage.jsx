import React, { useState } from 'react';
import { useDataStore } from '../../context/DataStoreContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const UserManagementPage = () => {
  const { systemUsers, recordAudit } = useDataStore();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New user state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('guard');
  const [station, setStation] = useState('Gate 01');

  const adminCount = systemUsers.filter(u => u.role === 'admin').length;
  const guardCount = systemUsers.filter(u => u.role === 'guard').length;
  const supervisorCount = systemUsers.filter(u => u.role === 'supervisor').length;

  const filteredUsers = systemUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.station.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    recordAudit('USER_CREATED', `Created new system account for ${name} (${role.toUpperCase()})`);
    addToast(`System credentials generated for ${name} (${role.toUpperCase()}).`, 'success');
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Security Governance</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Access Control & RBAC</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            User Access & Permissions
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Manage authenticated portal access for Super Administrators, Main Gate Security Officers, and Field Supervisors.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Add System User</span>
          </button>
        </div>
      </section>

      {/* KPI Ribbon */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Total System Users"
          value={systemUsers.length}
          icon="manage_accounts"
          subtitle="Active operator accounts"
        />
        <MetricCard
          title="Super Administrators"
          value={adminCount}
          icon="admin_panel_settings"
          subtitle="Full root privileges"
        />
        <MetricCard
          title="Gate Officers"
          value={guardCount}
          icon="security"
          subtitle="Turnstiles & boom gates"
        />
        <MetricCard
          title="Field Supervisors"
          value={supervisorCount}
          icon="engineering"
          subtitle="Workforce & tasks muster"
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
              placeholder="Search by name, email, station..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
          >
            <option value="all">All Roles</option>
            <option value="admin">Super Admin</option>
            <option value="guard">Gate Guard</option>
            <option value="supervisor">Field Supervisor</option>
          </select>
        </div>
      </section>

      {/* Users Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[750px]">
            <thead>
              <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                <th className="py-3.5 px-space-lg">User Name</th>
                <th className="py-3.5 px-space-md">Role</th>
                <th className="py-3.5 px-space-md">Assigned Station</th>
                <th className="py-3.5 px-space-md">2FA / Security</th>
                <th className="py-3.5 px-space-md">Last Active</th>
                <th className="py-3.5 px-space-md">Status</th>
                <th className="py-3.5 px-space-lg text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-body-md font-body-md text-on-surface">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 px-space-lg font-medium text-on-surface flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm font-semibold shrink-0">
                      {user.avatar}
                    </div>
                    <div>
                      <span className="font-semibold text-primary block">{user.name}</span>
                      <span className="font-body-sm text-secondary text-xs">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-space-md">
                    <span className="font-label-sm px-2.5 py-0.5 rounded bg-surface-container font-semibold uppercase text-xs text-primary">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-space-md font-body-sm text-on-surface">
                    {user.station}
                  </td>
                  <td className="py-4 px-space-md">
                    <span className="inline-flex items-center gap-1 font-label-sm text-xs font-semibold text-primary">
                      <span className="material-symbols-outlined text-[14px]">lock</span>
                      <span>2FA Enabled</span>
                    </span>
                  </td>
                  <td className="py-4 px-space-md font-code-sm text-code-sm text-secondary">
                    {user.lastLogin}
                  </td>
                  <td className="py-4 px-space-md">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="py-4 px-space-lg text-right">
                    <button
                      type="button"
                      onClick={() => {
                        recordAudit('PASSWORD_RESET', `Password reset link sent to ${user.email}`);
                        addToast(`Password reset link dispatched to ${user.email}.`, 'info');
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm font-semibold transition-colors border border-outline-variant/30"
                    >
                      <span className="material-symbols-outlined text-[14px]">key</span>
                      <span>Reset</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create System User Account"
        subtitle="Authorize an operator account with isolated role permissions."
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block font-label-md text-on-surface mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Officer Vikramaditya Rao"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-on-surface mb-1">Corporate Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@dionventures.internal"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
              />
            </div>
            <div>
              <label className="block font-label-md text-on-surface mb-1">Portal Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 font-body-md"
              >
                <option value="guard">Main Gate Guard (/guard)</option>
                <option value="supervisor">Field Supervisor (/supervisor)</option>
                <option value="admin">Super Administrator (/admin)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-label-md text-on-surface mb-1">Assigned Terminal / Station</label>
            <input
              type="text"
              required
              value={station}
              onChange={(e) => setStation(e.target.value)}
              placeholder="e.g. Gate 02 East Service or Command Central"
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
              Issue System Credentials
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
