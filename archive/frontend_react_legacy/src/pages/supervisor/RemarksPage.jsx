import React, { useState } from 'react';
import { useDataStore } from '../../context/DataStoreContext';
import { useToast } from '../../context/ToastContext';

export const RemarksPage = () => {
  const { tasks, addTaskRemark, recordAudit } = useDataStore();
  const { addToast } = useToast();

  const [selectedTask, setSelectedTask] = useState(tasks[0]?.id || 'TSK-881');
  const [remarkText, setRemarkText] = useState('');

  // Collect all remarks from tasks
  const allRemarks = tasks.flatMap(t => 
    (t.remarks || []).map(r => ({ ...r, taskTitle: t.title, taskId: t.id }))
  );

  const handlePost = (e) => {
    e.preventDefault();
    if (!remarkText.trim()) return;
    addTaskRemark(selectedTask, remarkText.trim());
    setRemarkText('');
  };

  return (
    <div className="flex flex-col w-full gap-space-lg sm:gap-space-xl">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm tracking-widest uppercase">
            <span>Operations Log</span>
            <span className="w-1 h-1 rounded-full bg-secondary"></span>
            <span>Supervisor Notes</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-[32px] text-primary tracking-tight">
            Field Remarks & Observations
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Live chronological stream of field supervisor remarks, technician observations, handover notices, and inspection flags.
          </p>
        </div>
      </section>

      {/* Grid: Post Form + Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Form (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/20 space-y-4">
          <h3 className="font-headline-sm text-headline-sm text-primary">Post Field Remark</h3>
          
          <form onSubmit={handlePost} className="space-y-3">
            <div>
              <label className="block font-label-md text-on-surface mb-1">Related Task / Location</label>
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-md"
              >
                {tasks.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.id} — {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-label-md text-on-surface mb-1">Observation / Note</label>
              <textarea
                rows={4}
                required
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                placeholder="Log observation, handover instruction, or equipment notice..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-md focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container shadow-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">post_add</span>
              <span>Publish Field Remark</span>
            </button>
          </form>
        </div>

        {/* Right Feed (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-primary">Live Remarks Stream</h3>
            <span className="font-code-sm text-code-sm text-secondary">{allRemarks.length} Total Logs</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {allRemarks.map((rem, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">{rem.author}</span>
                    <span className="font-code-sm text-xs font-bold text-secondary bg-surface-container-high px-2 py-0.5 rounded">
                      {rem.taskId}
                    </span>
                  </div>
                  <span className="font-code-sm text-xs text-secondary">{rem.time}</span>
                </div>
                <p className="font-body-md text-on-surface">{rem.text}</p>
                <p className="font-body-sm text-secondary text-xs">Linked: {rem.taskTitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
