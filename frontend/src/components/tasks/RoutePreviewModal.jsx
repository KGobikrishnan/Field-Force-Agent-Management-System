import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { MapPin, Navigation, Phone, MessageSquare, ExternalLink, Clock } from 'lucide-react';

export function RoutePreviewModal({ isOpen, onClose, tasks = [] }) {
  if (!isOpen) return null;

  const sortedTasks = [...tasks].sort((a, b) => (a.scheduledTime > b.scheduledTime ? 1 : -1));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Daily Route & Navigation Map"
      subtitle={`${sortedTasks.length} field stops planned for optimal travel time`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Simulated Map Display */}
        <div className="relative h-48 w-full rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 border border-blue-800 overflow-hidden flex flex-col justify-between p-4 shadow-sm">
          {/* Simulated Map Canvas Texture & Markers */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-slate-900/80 border border-white/20 px-3 py-1.5 rounded-xl backdrop-blur-md text-xs text-white">
              <Navigation className="w-3.5 h-3.5 text-blue-400 animate-spin" />
              <span className="font-bold">Optimal GPS Route</span>
              <span className="text-blue-200">• Total 18.4 km (~45 mins)</span>
            </div>

            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              <span>Launch Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Interactive simulated route stops graphic */}
          <div className="relative z-10 flex items-center justify-around px-4">
            {sortedTasks.slice(0, 4).map((task, idx) => (
              <div key={task.id} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg border-2 ${
                    task.status === 'Collected'
                      ? 'bg-emerald-500 border-white text-white'
                      : 'bg-blue-500 border-white text-white animate-bounce'
                  }`}
                >
                  {idx + 1}
                </div>
                <span className="text-[10px] text-white mt-1 max-w-[80px] truncate text-center font-semibold">
                  {task.customerName.split(' ')[0]}
                </span>
                <span className="text-[9px] text-blue-200 font-mono">{task.scheduledTime}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Turn-by-Turn Stop Order List */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Stop-by-Stop Agenda Sequence
          </h4>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {sortedTasks.map((task, index) => (
              <div
                key={task.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{task.customerName}</span>
                      <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded border border-blue-200">
                        {task.loanId}
                      </span>
                      <Badge variant={task.status} size="xs">
                        {task.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5 font-medium">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {task.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-extrabold text-blue-600 block font-mono">
                      ₹{task.emiAmountDue.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" />
                      {task.scheduledTime}
                    </span>
                  </div>

                  <a
                    href={`tel:${task.customerPhone}`}
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors shadow-xs"
                    title={`Call ${task.customerName}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`https://wa.me/${task.customerPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors border border-emerald-200"
                    title={`WhatsApp ${task.customerName}`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
