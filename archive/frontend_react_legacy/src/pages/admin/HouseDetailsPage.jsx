import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const HouseDetailsPage = () => {
  const { id } = useParams();
  const { houses, residents, familyMembers, visitors, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [showIntercomModal, setShowIntercomModal] = useState(false);

  const house = houses.find(h => h.id === id || h.unitNumber === id) || houses[0];
  const resident = residents.find(r => r.unitNumber === house.unitNumber || r.name === house.residentName);
  const houseFamily = familyMembers.filter(f => f.unitNumber === house.unitNumber || (resident && f.residentId === resident.id));
  const unitVisitors = visitors.filter(v => v.hostUnit === house.unitNumber);

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Breadcrumbs */}
      <Breadcrumbs
        backTo="/admin/houses"
        backLabel="Back to Houses"
        items={[
          { label: 'Society', to: '/admin/houses' },
          { label: 'Houses', to: '/admin/houses' },
          { label: `Unit ${house.unitNumber}` }
        ]}
      />

      {/* Hero Unit Card */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-md flex-wrap">
              <h1 className="font-display-lg text-display-lg sm:text-[36px] text-primary tracking-tight">
                Unit {house.unitNumber}
              </h1>
              <StatusBadge status={house.status} />
              <span className="font-code-sm text-code-sm text-outline px-2.5 py-0.5 rounded bg-surface-container font-semibold">
                {house.type}
              </span>
            </div>
            <p className="font-body-md text-secondary">
              {house.blockName} • {house.floor} • Parking Bay: <strong className="text-on-surface">{house.parkingSlot}</strong>
            </p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <button
              type="button"
              onClick={() => setShowIntercomModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md font-semibold transition-all border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
              <span>Ring Intercom #{house.intercom}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate(`/guard/visitors/new?unit=${house.unitNumber}`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md font-semibold shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Issue Visitor Pass</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Primary Occupant + Vehicle RFID Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Column (7 cols): Resident & Family Roster */}
        <div className="lg:col-span-7 flex flex-col gap-space-lg">
          {/* Primary Resident Snapshot */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-primary">Primary Resident Profile</h3>
              {resident && <StatusBadge status={resident.status} />}
            </div>

            {resident ? (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-display-lg text-base font-bold shrink-0">
                  {resident.avatar}
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="font-headline-sm text-lg text-on-surface font-semibold">{resident.name}</h4>
                  <p className="font-body-sm text-secondary">{resident.category} • Resident since {resident.since}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-body-sm">
                    <div>
                      <span className="text-secondary block text-xs">Direct Phone</span>
                      <span className="font-semibold text-on-surface">{resident.phone}</span>
                    </div>
                    <div>
                      <span className="text-secondary block text-xs">Email Address</span>
                      <span className="font-semibold text-on-surface truncate block">{resident.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-secondary italic">No primary resident registered for this vacant unit.</p>
            )}
          </div>

          {/* Family Members Roster */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-primary">Family Members ({houseFamily.length})</h3>
              <Link to="/admin/family-members" className="font-label-sm text-primary hover:underline font-semibold">
                Manage Registry →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead>
                  <tr className="bg-surface-container-low/60 text-secondary font-label-sm text-label-sm border-b border-outline-variant/20">
                    <th className="py-3 px-space-md">Name</th>
                    <th className="py-3 px-space-md">Relation</th>
                    <th className="py-3 px-space-md">Phone</th>
                    <th className="py-3 px-space-md">RFID Tag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15 text-body-sm font-body-sm text-on-surface">
                  {houseFamily.length > 0 ? (
                    houseFamily.map((fam) => (
                      <tr key={fam.id} className="hover:bg-surface-container-low/50">
                        <td className="py-3 px-space-md font-medium">{fam.name}</td>
                        <td className="py-3 px-space-md text-secondary">{fam.relation}</td>
                        <td className="py-3 px-space-md text-secondary">{fam.phone}</td>
                        <td className="py-3 px-space-md font-code-sm text-primary">{fam.rfidTag}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-secondary italic">
                        No additional family members registered.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Vehicles & Recent Gate Activity */}
        <div className="lg:col-span-5 flex flex-col gap-space-lg">
          {/* Registered Vehicles */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/20 space-y-3">
            <h3 className="font-headline-sm text-headline-sm text-primary">Registered Vehicles & RFID</h3>
            {house.vehicles && house.vehicles.length > 0 ? (
              <div className="space-y-2">
                {house.vehicles.map((veh, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[20px]">directions_car</span>
                      <span className="font-code-sm font-bold text-on-surface">{veh}</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-secondary bg-surface-container-high px-2 py-0.5 rounded">
                      Parking: {house.parkingSlot}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary text-body-sm italic">No vehicles registered for this unit.</p>
            )}
          </div>

          {/* Unit Visitor History */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/20 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-primary">Unit Visitors</h3>
              <span className="font-code-sm text-code-sm text-secondary">{unitVisitors.length} Total</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {unitVisitors.map((vis) => (
                <div key={vis.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-container-low transition-colors border border-outline-variant/15 text-body-sm">
                  <div>
                    <p className="font-semibold text-on-surface">{vis.name}</p>
                    <p className="text-secondary text-xs">{vis.category} • {vis.entryTime}</p>
                  </div>
                  <StatusBadge status={vis.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Intercom Simulation Modal */}
      <Modal
        isOpen={showIntercomModal}
        onClose={() => setShowIntercomModal(false)}
        title={`Intercom Terminal: Unit ${house.unitNumber}`}
        subtitle={`Connecting digital audio link to #${house.intercom} (${house.residentName})`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-center py-4">
          <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto animate-pulse">
            <span className="material-symbols-outlined text-[32px]">phone_in_talk</span>
          </div>
          <div>
            <h4 className="font-headline-sm text-primary font-medium">Calling Unit {house.unitNumber}</h4>
            <p className="font-body-sm text-secondary mt-1">Intercom Hub channel encrypted and active</p>
          </div>
          <div className="flex justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                recordAudit('INTERCOM_CALL', `Intercom call initiated to Unit ${house.unitNumber}`);
                addToast(`Intercom connected to Unit ${house.unitNumber}.`, 'info');
                setShowIntercomModal(false);
              }}
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md font-semibold"
            >
              End Call
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
