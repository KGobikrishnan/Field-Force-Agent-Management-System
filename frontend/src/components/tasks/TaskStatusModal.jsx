import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Calendar, CheckCircle2 } from 'lucide-react';

export function TaskStatusModal({ task, isOpen, onClose }) {
  const { updateTaskStatus } = useApp();

  const [status, setStatus] = useState(task ? task.status : 'Pending');
  const [priority, setPriority] = useState(task ? task.priority : 'Medium');
  const [notes, setNotes] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');

  if (!task) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTaskStatus(task.id, {
      status,
      priority,
      notes,
      rescheduleDate,
    });
    onClose();
  };

  const statusOptions = [
    { id: 'In Progress', label: 'In Progress / Reached Location', color: 'text-blue-700' },
    { id: 'Customer Unavailable', label: 'Customer Unavailable / House Locked', color: 'text-rose-700' },
    { id: 'Rescheduled', label: 'Rescheduled on Customer Request', color: 'text-orange-700' },
    { id: 'Escalated', label: 'Escalate to TL / Branch Recovery Legal', color: 'text-red-700' },
    { id: 'Pending', label: 'Pending Visit', color: 'text-amber-800' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Field Task Status"
      subtitle={`Customer: ${task.customerName} (${task.loanId})`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Status choices */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Select Disposition Status</label>
          <div className="space-y-1.5">
            {statusOptions.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  status === opt.id
                    ? 'bg-blue-50/60 border-blue-500 text-slate-900 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={opt.id}
                  checked={status === opt.id}
                  onChange={(e) => setStatus(e.target.value)}
                  className="text-blue-600 focus:ring-0"
                />
                <span className={opt.color}>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Reschedule Date if selected */}
        {status === 'Rescheduled' && (
          <div className="space-y-1.5 p-3 rounded-xl bg-orange-50 border border-orange-200">
            <label className="text-xs font-bold text-orange-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Next Visit Promise Date
            </label>
            <input
              type="date"
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-orange-500"
              required
            />
          </div>
        )}

        {/* Priority adjustment */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Task Priority</label>
          <div className="grid grid-cols-4 gap-2">
            {['Critical', 'High', 'Medium', 'Low'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`py-1.5 rounded-lg border text-xs font-bold transition-all ${
                  priority === p
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Field Remarks / Observations</label>
          <textarea
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Document customer remarks, reasons for delay, guarantor contact..."
            className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Action */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Disposition</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
