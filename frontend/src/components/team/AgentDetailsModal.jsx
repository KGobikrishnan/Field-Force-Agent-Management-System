import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  Phone,
  Mail,
  BatteryCharging,
  Radio,
} from 'lucide-react';

export function AgentDetailsModal({ agent, isOpen, onClose, tasks = [] }) {
  if (!agent) return null;

  const agentTasks = tasks.filter((t) => t.assignedExecutiveId === agent.id);
  const targetPercent = Math.min(100, Math.round((agent.dailyCollected / agent.dailyTarget) * 100));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${agent.name} - Field Profile`}
      subtitle={`Agent ID: ${agent.id} • ${agent.zoneName}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-xs">
        {/* Profile Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-sm"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900">{agent.name}</span>
                <Badge variant={agent.status} size="xs">
                  {agent.status}
                </Badge>
              </div>
              <p className="text-slate-500 font-medium">{agent.role} • {agent.zoneName.split('-')[0]}</p>
              <div className="flex items-center gap-3 text-slate-500 text-[11px] font-medium">
                <span className="flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-600" /> {agent.gpsStatus}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <BatteryCharging className="w-3 h-3 text-emerald-600" /> {agent.battery}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Score</span>
            <div className="text-2xl font-extrabold font-mono text-blue-600">
              {agent.efficiencyScore}%
            </div>
          </div>
        </div>

        {/* Contact shortcuts */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${agent.phone}`}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-colors border border-blue-200"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>Call {agent.phone}</span>
          </a>
          <a
            href={`mailto:${agent.email}`}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors border border-slate-200"
          >
            <Mail className="w-3.5 h-3.5 text-slate-600" />
            <span>Send Email</span>
          </a>
        </div>

        {/* Performance Target Bar */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Today's Target Attainment</span>
            <span className="font-mono text-blue-600 font-extrabold">
              ₹{agent.dailyCollected.toLocaleString('en-IN')} / ₹{agent.dailyTarget.toLocaleString('en-IN')} ({targetPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full rounded-full bg-blue-600" style={{ width: `${targetPercent}%` }} />
          </div>
        </div>

        {/* Assigned Tasks preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800">
              Assigned Field Tasks ({agentTasks.length})
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {agentTasks.map((task) => (
              <div
                key={task.id}
                className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{task.customerName}</span>
                    <span className="font-mono text-[10px] text-slate-500">{task.loanId}</span>
                    <Badge variant={task.status} size="xs">
                      {task.status}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">{task.scheduledTime} • {task.address.slice(0, 35)}...</span>
                </div>
                <div className="font-mono font-bold text-blue-600">
                  ₹{task.emiAmountDue.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
