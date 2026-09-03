import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const ResidentsHousesPage = () => {
  const { houses, residents, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('all');
  const [callingHouse, setCallingHouse] = useState(null);

  const filteredHouses = houses.filter(h => {
    const matchesSearch = h.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.residentPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.vehicles.some(v => v.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesBlock = selectedBlock === 'all' || h.blockId === selectedBlock || h.blockName.includes(selectedBlock);
    return matchesSearch && matchesBlock;
  });

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <div className="flex flex-col gap-space-2xs">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
          Guard Security Terminal • Intercom Directory
        </span>
        <h1 className="font-display-lg text-display-lg sm:text-[36px] text-primary tracking-tight">
          Residents & Housing Directory
        </h1>
        <p className="font-body-md text-body-md text-secondary">
          Instant resident verification, direct intercom audio link, and resident-authorized visitor onboarding.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-sm">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by flat #, resident name, phone, vehicle plate..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface focus:outline-none focus:border-primary"
          />
        </div>

        <select
          value={selectedBlock}
          onChange={(e) => setSelectedBlock(e.target.value)}
          className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-sm text-on-surface"
        >
          <option value="all">All Blocks (A - F)</option>
          <option value="BLK-A">Block A</option>
          <option value="BLK-B">Block B</option>
          <option value="BLK-C">Block C</option>
          <option value="BLK-D">Block D</option>
        </select>
      </div>

      {/* Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
        {filteredHouses.map((house) => (
          <div
            key={house.id}
            className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow flex flex-col justify-between gap-3"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-headline-sm text-xl font-bold text-primary">Unit {house.unitNumber}</span>
                  <p className="font-body-sm text-secondary">{house.blockName} • Floor {house.floor}</p>
                </div>
                <StatusBadge status={house.status} />
              </div>

              {house.residentName !== '—' ? (
                <div className="mt-3 space-y-1 text-body-sm">
                  <p className="font-semibold text-on-surface">{house.residentName}</p>
                  <p className="text-secondary text-xs">Direct: {house.residentPhone}</p>
                  <p className="font-code-sm text-xs text-primary">Intercom: #{house.intercom}</p>
                  {house.vehicles.length > 0 && (
                    <p className="font-code-sm text-xs text-secondary mt-1">Plates: {house.vehicles.join(', ')}</p>
                  )}
                </div>
              ) : (
                <div className="mt-3 text-body-sm text-secondary italic">
                  Unit currently vacant.
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setCallingHouse(house)}
                className="flex-1 py-1.5 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-label-sm font-semibold flex items-center justify-center gap-1.5 border border-outline-variant/30 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">phone_in_talk</span>
                <span>Intercom</span>
              </button>
              <button
                type="button"
                onClick={() => navigate(`/guard/visitors/new?unit=${house.unitNumber}`)}
                className="flex-1 py-1.5 px-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                <span>Issue Pass</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Intercom Ringing Modal */}
      <Modal
        isOpen={!!callingHouse}
        onClose={() => setCallingHouse(null)}
        title={`Intercom Terminal: Unit ${callingHouse?.unitNumber}`}
        subtitle={`Connecting to #${callingHouse?.intercom} (${callingHouse?.residentName})`}
        maxWidth="max-w-md"
      >
        {callingHouse && (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto animate-pulse">
              <span className="material-symbols-outlined text-[32px]">phone_in_talk</span>
            </div>
            <div>
              <h4 className="font-headline-sm text-primary font-medium">Intercom Active: #{callingHouse.intercom}</h4>
              <p className="font-body-sm text-secondary mt-1">Secure relay channel established with host handset</p>
            </div>
            <div className="flex justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  recordAudit('INTERCOM_CALL', `Guard called Unit ${callingHouse.unitNumber} via Intercom Hub`);
                  addToast(`Intercom connected to Unit ${callingHouse.unitNumber}.`, 'info');
                  setCallingHouse(null);
                }}
                className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md font-semibold"
              >
                End Intercom Call
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
