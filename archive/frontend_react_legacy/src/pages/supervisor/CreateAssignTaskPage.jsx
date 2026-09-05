import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDataStore } from '../../context/DataStoreContext';
import { useToast } from '../../context/ToastContext';

export const CreateAssignTaskPage = () => {
  const [searchParams] = useSearchParams();
  const { employees, blocks, createTask, recordAudit } = useDataStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const preselectedWorker = searchParams.get('worker');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Facilities & Engineering');
  const [priority, setPriority] = useState('high');
  const [assignedToId, setAssignedToId] = useState(preselectedWorker || 'WRK-1002');
  const [location, setLocation] = useState('Block A, Elevator Shaft #02');
  const [dueDate, setDueDate] = useState('Today, 05:00 PM');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast('Please enter a task title.', 'warning');
      return;
    }

    createTask({
      title: title.trim(),
      description: description.trim(),
      category: category,
      priority: priority,
      assignedToId: assignedToId,
      location: location,
      dueDate: dueDate
    });

    navigate('/supervisor/tasks/board');
  };

  return (
    <div className="flex flex-col w-full gap-space-lg max-w-4xl mx-auto pb-space-xl">
      {/* Header */}
      <div className="flex flex-col gap-space-2xs">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">
          Workforce Operations • Work Order Dispatch
        </span>
        <h1 className="font-display-lg text-display-lg sm:text-[36px] text-primary tracking-tight">
          Create & Assign Task
        </h1>
        <p className="font-body-md text-body-md text-secondary">
          Dispatch operational tasks to on-duty personnel with priority tags, deadlines, and location specs.
        </p>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 space-y-5">
        {/* Task Title */}
        <div>
          <label className="block font-label-md text-on-surface mb-1 font-semibold">
            Task Title / Work Order Summary *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Block A Main Elevator Sensor Recalibration"
            className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-md text-on-surface focus:outline-none focus:border-primary"
          />
        </div>

        {/* Category & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-label-md text-on-surface mb-1 font-semibold">
              Operational Department
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-md"
            >
              <option value="Facilities & Engineering">Facilities & Engineering</option>
              <option value="Security & Surveillance">Security & Surveillance</option>
              <option value="Housekeeping & Sanitization">Housekeeping & Sanitization</option>
              <option value="Landscaping & Horticulture">Landscaping & Horticulture</option>
            </select>
          </div>

          <div>
            <label className="block font-label-md text-on-surface mb-1 font-semibold">
              Priority Classification
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-md"
            >
              <option value="urgent">🔴 Urgent (Immediate Response)</option>
              <option value="high">🟠 High (Within 4 Hours)</option>
              <option value="medium">🟡 Medium (Same Day)</option>
              <option value="low">🟢 Low (Routine Inspection)</option>
            </select>
          </div>
        </div>

        {/* Assignee & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-label-md text-on-surface mb-1 font-semibold">
              Assign to Personnel (80 Enrolled Workers) *
            </label>
            <select
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-md font-medium"
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} — {emp.role} ({emp.department}) [{emp.status.toUpperCase()}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-label-md text-on-surface mb-1 font-semibold">
              Location / Area *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Block A, Elevator Shaft #02"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-md"
            />
          </div>
        </div>

        {/* Target Deadline */}
        <div>
          <label className="block font-label-md text-on-surface mb-1 font-semibold">
            Target Completion Deadline
          </label>
          <input
            type="text"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="e.g. Today, 05:00 PM or Tomorrow 12:00 PM"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-md"
          />
        </div>

        {/* Protocol / Instructions */}
        <div>
          <label className="block font-label-md text-on-surface mb-1 font-semibold">
            Work Protocol & Technical Instructions
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe specific safety steps, spare parts required, or handover notes..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-md focus:outline-none focus:border-primary"
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={() => navigate('/supervisor/tasks/board')}
            className="px-5 py-2.5 rounded-xl text-secondary hover:bg-surface-container font-label-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>Dispatch Work Order</span>
          </button>
        </div>
      </form>
    </div>
  );
};
