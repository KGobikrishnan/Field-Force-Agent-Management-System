import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { CheckCircle2 } from 'lucide-react';

export function AssignLeadModal({ lead, isOpen, onClose }) {
  const { fieldExecutives, assignLead } = useApp();

  const [selectedAgentId, setSelectedAgentId] = useState(
    lead?.assignedExecutiveId || fieldExecutives[0]?.id || ''
  );

  if (!lead) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAgentId) return;
    assignLead(lead.id, selectedAgentId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Field Agent to Lead"
      subtitle={`Customer: ${lead.customerName} (₹${lead.requestedAmount.toLocaleString('en-IN')} - ${lead.loanType})`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <p className="text-slate-600 font-medium">
          Select an available field executive to perform physical residence verification, KYC collection, and appraisal.
        </p>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {fieldExecutives.map((exec) => {
            const isSelected = selectedAgentId === exec.id;

            return (
              <label
                key={exec.id}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 text-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="agent"
                    value={exec.id}
                    checked={isSelected}
                    onChange={() => setSelectedAgentId(exec.id)}
                    className="text-blue-600 focus:ring-0"
                  />
                  <img
                    src={exec.avatar}
                    alt={exec.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">{exec.name}</span>
                    <span className="text-[11px] text-slate-500">{exec.zoneName.split('-')[0]}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono text-blue-700 font-bold block">
                    {exec.activeTasksCount} tasks active
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Score: {exec.efficiencyScore}%</span>
                </div>
              </label>
            );
          })}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Agent Assignment</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
