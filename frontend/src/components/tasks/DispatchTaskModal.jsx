import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Send } from 'lucide-react';

export function DispatchTaskModal({ isOpen, onClose }) {
  const { fieldExecutives, dispatchTask } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loanId, setLoanId] = useState(`LN-${Math.floor(1000 + Math.random() * 9000)}`);
  const [loanType, setLoanType] = useState('Micro-Enterprise Loan');
  const [emiAmountDue, setEmiAmountDue] = useState('8500');
  const totalLoanAmount = '100000';
  const [overdueDays, setOverdueDays] = useState('21');
  const [priority, setPriority] = useState('High');
  const [address, setAddress] = useState('');
  const [scheduledTime, setScheduledTime] = useState('11:00 AM');
  const [assignedExecutiveId, setAssignedExecutiveId] = useState(
    fieldExecutives[0]?.id || ''
  );
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !address) {
      alert('Please fill in Customer Name and Address');
      return;
    }

    const exec = fieldExecutives.find((e) => e.id === assignedExecutiveId);

    dispatchTask({
      loanId,
      type: 'Collection',
      customerName,
      customerPhone: customerPhone || '+91 98765 00000',
      address,
      coordinates: { lat: 28.6139, lng: 77.209 },
      zoneId: exec?.zoneId || 'north-metro',
      zoneName: exec?.zoneName || 'North Zone - Metro Branch',
      assignedExecutiveId,
      assignedExecutiveName: exec?.name || 'Assigned Agent',
      loanType,
      totalLoanAmount: Number(totalLoanAmount),
      emiAmountDue: Number(emiAmountDue),
      overdueDays: Number(overdueDays),
      overdueSeverity: Number(overdueDays) > 60 ? 'Critical' : Number(overdueDays) > 30 ? 'High' : 'Medium',
      priority,
      scheduledTime,
      notes,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dispatch Field Collection Task"
      subtitle="Allocate overdue recovery task to a field agent"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Customer & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Customer Name *</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Ramesh Chandra"
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Customer Phone</label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+91 98XXX XXXXX"
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Loan ID & Loan Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Loan Account ID</label>
            <input
              type="text"
              value={loanId}
              onChange={(e) => setLoanId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-blue-700 font-mono font-bold focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Loan Category</label>
            <select
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none"
            >
              <option>Micro-Enterprise Loan</option>
              <option>Agri Allied Micro Loan</option>
              <option>Two-Wheeler Loan</option>
              <option>Women Self-Help Group</option>
              <option>Working Capital Loan</option>
            </select>
          </div>
        </div>

        {/* EMI Due & Overdue Days */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">EMI Amount (₹)</label>
            <input
              type="number"
              value={emiAmountDue}
              onChange={(e) => setEmiAmountDue(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-blue-600 font-mono font-bold focus:outline-none"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Days Past Due (DPD)</label>
            <input
              type="number"
              value={overdueDays}
              onChange={(e) => setOverdueDays(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-mono focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none"
            >
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700">Customer Field Address *</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Shop / House No, Street, Landmark, City..."
            className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Assign Executive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Assign Field Executive</label>
            <select
              value={assignedExecutiveId}
              onChange={(e) => setAssignedExecutiveId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none"
            >
              {fieldExecutives.map((exec) => (
                <option key={exec.id} value={exec.id}>
                  {exec.name} ({exec.zoneName.split('-')[0].trim()}) - {exec.activeTasksCount} active tasks
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Scheduled Visit Time</label>
            <input
              type="text"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              placeholder="e.g. 11:30 AM"
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none"
            />
          </div>
        </div>

        {/* Dispatch Notes */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700">Instructions / Notes for Agent</label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Special instructions regarding shop timings, payment mode preferences..."
            className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Dispatch Task to Agent</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
