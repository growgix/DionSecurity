import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const SearchPersonPage = () => {
  const [searchParams] = useSearchParams();
  const { residents, employees, visitors, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filterType, setFilterType] = useState('all');

  // Search aggregations
  const residentMatches = residents.filter(r => 
    r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.unitNumber.toLowerCase().includes(query.toLowerCase()) ||
    r.phone.toLowerCase().includes(query.toLowerCase()) ||
    r.vehicles.some(v => v.toLowerCase().includes(query.toLowerCase()))
  );

  const employeeMatches = employees.filter(e =>
    e.name.toLowerCase().includes(query.toLowerCase()) ||
    e.badgeNo.toLowerCase().includes(query.toLowerCase()) ||
    e.role.toLowerCase().includes(query.toLowerCase()) ||
    e.id.toLowerCase().includes(query.toLowerCase())
  );

  const visitorMatches = visitors.filter(v =>
    v.name.toLowerCase().includes(query.toLowerCase()) ||
    v.badgeNumber.toLowerCase().includes(query.toLowerCase()) ||
    v.hostUnit.toLowerCase().includes(query.toLowerCase()) ||
    v.vehicleNumber.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full gap-space-lg max-w-5xl mx-auto pb-space-xl">
      {/* Header */}
      <div className="flex flex-col gap-space-2xs">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
          Guard Security Terminal • Fast Lookup
        </span>
        <h1 className="font-display-lg text-display-lg sm:text-[36px] text-primary tracking-tight">
          Search Person & Vehicle
        </h1>
        <p className="font-body-md text-body-md text-secondary">
          Live real-time search across residents, registered staff, active visitors, and authorized vehicle plates.
        </p>
      </div>

      {/* Primary Big Search Input Field */}
      <div className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 space-y-4">
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-4 text-primary text-[24px]">
            search
          </span>
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type person name, unit (e.g. A-203), badge #, or vehicle plate..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface font-body-lg text-base sm:text-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-inner"
          />
        </div>

        {/* Filter Segment Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-full font-label-md text-sm transition-colors whitespace-nowrap ${
              filterType === 'all' ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container text-secondary hover:text-on-surface'
            }`}
          >
            All Results ({residentMatches.length + employeeMatches.length + visitorMatches.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('residents')}
            className={`px-3.5 py-1.5 rounded-full font-label-md text-sm transition-colors whitespace-nowrap ${
              filterType === 'residents' ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container text-secondary hover:text-on-surface'
            }`}
          >
            Residents ({residentMatches.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('staff')}
            className={`px-3.5 py-1.5 rounded-full font-label-md text-sm transition-colors whitespace-nowrap ${
              filterType === 'staff' ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container text-secondary hover:text-on-surface'
            }`}
          >
            Staff & Workforce ({employeeMatches.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('visitors')}
            className={`px-3.5 py-1.5 rounded-full font-label-md text-sm transition-colors whitespace-nowrap ${
              filterType === 'visitors' ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container text-secondary hover:text-on-surface'
            }`}
          >
            Visitors ({visitorMatches.length})
          </button>
        </div>
      </div>

      {/* Search Results Display */}
      <div className="space-y-4">
        {/* Residents Results */}
        {(filterType === 'all' || filterType === 'residents') && residentMatches.length > 0 && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md sm:p-space-lg border border-outline-variant/20 space-y-3">
            <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">apartment</span>
              <span>Matched Residents ({residentMatches.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {residentMatches.map(res => (
                <div key={res.id} className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shrink-0">
                      {res.avatar}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-on-surface truncate">{res.name}</h4>
                      <p className="font-code-sm text-code-sm font-bold text-primary">Unit {res.unitNumber} ({res.blockName})</p>
                      <p className="text-secondary text-xs truncate">{res.phone} • {res.vehicles.join(', ') || 'No vehicle'}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/guard/visitors/new?unit=${res.unitNumber}`)}
                    className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm font-semibold hover:bg-primary-container shrink-0"
                  >
                    Issue Pass
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staff Results */}
        {(filterType === 'all' || filterType === 'staff') && employeeMatches.length > 0 && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md sm:p-space-lg border border-outline-variant/20 space-y-3">
            <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">badge</span>
              <span>Matched Workforce Personnel ({employeeMatches.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {employeeMatches.slice(0, 6).map(emp => (
                <div key={emp.id} className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-bold shrink-0">
                      {emp.avatar}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-on-surface truncate">{emp.name}</h4>
                      <p className="font-body-sm text-secondary text-xs">{emp.role} • {emp.id}</p>
                      <StatusBadge status={emp.status} />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      recordAudit('STAFF_BADGE_SCANNED', `Badge scanned for ${emp.name} (${emp.id})`);
                      addToast(`Badge verified: ${emp.name} is ${emp.status}.`, 'info');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm font-semibold shrink-0"
                  >
                    Verify ID
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visitors Results */}
        {(filterType === 'all' || filterType === 'visitors') && visitorMatches.length > 0 && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md sm:p-space-lg border border-outline-variant/20 space-y-3">
            <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">groups</span>
              <span>Matched Visitor Passes ({visitorMatches.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {visitorMatches.map(vis => (
                <div key={vis.id} className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-code-sm text-code-sm font-bold text-primary px-2 py-0.5 rounded bg-surface-container shrink-0">
                      {vis.badgeNumber}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-on-surface truncate">{vis.name}</h4>
                      <p className="font-body-sm text-secondary text-xs">Host: {vis.hostUnit} • {vis.category}</p>
                      <StatusBadge status={vis.status} />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/visitors/${vis.id}`)}
                    className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm font-semibold hover:bg-primary-container shrink-0"
                  >
                    Inspect
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
