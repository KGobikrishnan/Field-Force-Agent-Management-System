import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { CollectPaymentModal } from '../tasks/CollectPaymentModal';
import { TaskStatusModal } from '../tasks/TaskStatusModal';
import { RoutePreviewModal } from '../tasks/RoutePreviewModal';
import { KycChecklistModal } from '../leads/KycChecklistModal';
import {
  Wallet,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Navigation,
  CheckCircle2,
  Play,
  Square,
  ShieldCheck,
  BatteryCharging,
  Radio,
  FileText,
  UserCheck,
} from 'lucide-react';

export function ExecutiveDashboard() {
  const {
    currentUser,
    tasks,
    leads,
    executiveShift,
    togglePunchIn,
    setActiveTab,
  } = useApp();

  // Tasks assigned to this executive (Rahul Verma by default)
  const myTasks = tasks.filter((t) => t.assignedExecutiveId === currentUser.id);
  const myLeads = leads.filter((l) => l.assignedExecutiveId === currentUser.id);

  // States for modals
  const [selectedTaskForPayment, setSelectedTaskForPayment] = useState(null);
  const [selectedTaskForStatus, setSelectedTaskForStatus] = useState(null);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [selectedLeadForKyc, setSelectedLeadForKyc] = useState(null);

  // Filter tab for Agenda
  const [agendaFilter, setAgendaFilter] = useState('all'); // 'all', 'collections', 'leads', 'pending'

  // Executive Target & Collected
  const dailyTarget = 70000;
  const dailyCollected = myTasks.reduce((s, t) => s + (t.amountCollected || 0), 0);
  const percentCollected = Math.min(100, Math.round((dailyCollected / dailyTarget) * 100));

  const completedCount = myTasks.filter((t) => t.status === 'Collected').length;
  const pendingCount = myTasks.filter((t) => t.status !== 'Collected').length;

  // Filter agenda items
  const filteredAgendaTasks = myTasks.filter((t) => {
    if (agendaFilter === 'pending') return t.status !== 'Collected';
    if (agendaFilter === 'leads') return false;
    return true;
  });

  const filteredAgendaLeads = myLeads.filter(() => {
    if (agendaFilter === 'collections') return false;
    return true;
  });

  return (
    <div className="space-y-5 max-w-4xl mx-auto pb-12">
      {/* Shift & Punch-In Header Banner with Blue Accent */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-white/80 shadow-md"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-blue-700 ${
                  executiveShift.isPunchedIn ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">{currentUser.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                  {currentUser.id}
                </span>
              </div>
              <p className="text-xs text-blue-100 flex items-center gap-2 font-medium">
                <span className="flex items-center gap-1">
                  <Radio className={`w-3 h-3 ${executiveShift.isPunchedIn ? 'text-emerald-300' : 'text-blue-300'}`} />
                  {executiveShift.isPunchedIn ? 'GPS Live (Connaught Place)' : 'GPS Offline'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <BatteryCharging className="w-3 h-3 text-emerald-300" />
                  {executiveShift.battery}
                </span>
              </p>
            </div>
          </div>

          {/* Punch In / Out Button */}
          <button
            onClick={togglePunchIn}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${
              executiveShift.isPunchedIn
                ? 'bg-rose-500/90 hover:bg-rose-500 text-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            {executiveShift.isPunchedIn ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>End Shift / Punch Out</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Day / Punch In</span>
              </>
            )}
          </button>
        </div>

        {/* Daily Target Progress Bar Card */}
        <div className="pt-3 border-t border-white/20 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-100 font-semibold flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-emerald-300" />
              Today's Field Collection Target
            </span>
            <span className="font-mono text-white font-extrabold">
              ₹{dailyCollected.toLocaleString('en-IN')} / ₹{dailyTarget.toLocaleString('en-IN')} ({percentCollected}%)
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-black/20 overflow-hidden relative shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-emerald-400 transition-all duration-500"
              style={{ width: `${percentCollected}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-blue-100 font-medium">
            <span>Completed: {completedCount} accounts</span>
            <span>Pending: {pendingCount} visits</span>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => {
            const firstPending = myTasks.find((t) => t.status !== 'Collected');
            if (firstPending) setSelectedTaskForPayment(firstPending);
            else alert('All current tasks collected!');
          }}
          className="p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-blue-400 transition-all text-left group shadow-xs hover:shadow-sm"
        >
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 w-fit mb-2 group-hover:scale-110 transition-transform">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900 block">Log Payment</span>
          <span className="text-[10px] text-slate-500 font-medium">UPI / Cash Receipt</span>
        </button>

        <button
          onClick={() => setIsRouteModalOpen(true)}
          className="p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-blue-400 transition-all text-left group shadow-xs hover:shadow-sm"
        >
          <div className="p-2 rounded-lg bg-sky-50 text-sky-600 w-fit mb-2 group-hover:scale-110 transition-transform">
            <Navigation className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900 block">Route & Map</span>
          <span className="text-[10px] text-slate-500 font-medium">{myTasks.length} Planned Stops</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className="p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-blue-400 transition-all text-left group shadow-xs hover:shadow-sm"
        >
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 w-fit mb-2 group-hover:scale-110 transition-transform">
            <UserCheck className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900 block">Verify KYC Leads</span>
          <span className="text-[10px] text-slate-500 font-medium">{myLeads.length} Enquiries</span>
        </button>

        <button
          onClick={() => setActiveTab('collections')}
          className="p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-blue-400 transition-all text-left group shadow-xs hover:shadow-sm"
        >
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 w-fit mb-2 group-hover:scale-110 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900 block">My Receipts</span>
          <span className="text-[10px] text-slate-500 font-medium">View Paid History</span>
        </button>
      </div>

      {/* Today's Agenda Timeline Header & Filter Pills */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Today's Agenda & Route Stops</h3>
            <span className="text-xs text-slate-500 font-medium">({myTasks.length + myLeads.length} Total Visits)</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'pending', label: 'Pending Only' },
              { id: 'collections', label: 'Collections' },
              { id: 'leads', label: 'KYC Leads' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAgendaFilter(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  agendaFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Agenda Cards List */}
        <div className="space-y-3">
          {/* Collection Tasks */}
          {filteredAgendaTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden bg-white shadow-xs ${
                task.status === 'Collected'
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : task.priority === 'Critical'
                  ? 'border-rose-200'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {task.scheduledTime}
                    </span>
                    <span className="font-bold text-base text-slate-900">{task.customerName}</span>
                    <span className="text-xs font-mono text-slate-500">({task.loanId})</span>
                    <Badge variant={task.status} size="xs">
                      {task.status}
                    </Badge>
                    {task.overdueDays > 0 && task.status !== 'Collected' && (
                      <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        {task.overdueDays} DPD Overdue
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 flex items-start gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{task.address}</span>
                  </p>

                  {task.notes && (
                    <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-200">
                      Note: {task.notes}
                    </p>
                  )}
                </div>

                {/* Amount Due & Action shortcuts */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block">
                      {task.status === 'Collected' ? 'Collected' : 'EMI Due'}
                    </span>
                    <span
                      className={`text-lg font-extrabold font-mono ${
                        task.status === 'Collected' ? 'text-emerald-600' : 'text-blue-600'
                      }`}
                    >
                      ₹{(task.amountCollected || task.emiAmountDue).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Call button */}
                    <a
                      href={`tel:${task.customerPhone}`}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title={`Call ${task.customerName}`}
                    >
                      <Phone className="w-4 h-4" />
                    </a>

                    {/* WhatsApp button */}
                    <a
                      href={`https://wa.me/${task.customerPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors border border-emerald-200"
                      title={`WhatsApp ${task.customerName}`}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>

                    {/* Navigation shortcut */}
                    <button
                      onClick={() => setIsRouteModalOpen(true)}
                      className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200"
                      title="Route Directions"
                    >
                      <Navigation className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Collect Payment / Update Status */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedTaskForStatus(task)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Update Status / Reschedule
                </button>

                {task.status !== 'Collected' ? (
                  <button
                    onClick={() => setSelectedTaskForPayment(task)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Collect Payment</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedTaskForPayment(task)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>View Receipt (#{task.receiptNo})</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* New Loan Leads / KYC Verification Agenda Visits */}
          {filteredAgendaLeads.map((lead) => (
            <div
              key={lead.id}
              className="p-4 rounded-2xl border border-blue-200 bg-white shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      LEAD VISIT
                    </span>
                    <span className="font-bold text-base text-slate-900">{lead.customerName}</span>
                    <span className="text-xs font-mono text-slate-500">({lead.id})</span>
                    <Badge variant={lead.stage} size="xs">
                      {lead.stage}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{lead.address}</span>
                  </p>

                  <p className="text-xs text-slate-500 font-medium">
                    Loan Requested: <span className="text-slate-900 font-bold">₹{lead.requestedAmount.toLocaleString('en-IN')}</span> ({lead.loanType})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${lead.customerPhone}`}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title={`Call ${lead.customerName}`}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://wa.me/${lead.customerPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors border border-emerald-200"
                    title={`WhatsApp ${lead.customerName}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  KYC Verified: {Object.values(lead.documentChecklist).filter(Boolean).length} of 6 docs
                </span>
                <button
                  onClick={() => setSelectedLeadForKyc(lead)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Checklist & Verification</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <CollectPaymentModal
        task={selectedTaskForPayment}
        isOpen={!!selectedTaskForPayment}
        onClose={() => setSelectedTaskForPayment(null)}
      />

      <TaskStatusModal
        task={selectedTaskForStatus}
        isOpen={!!selectedTaskForStatus}
        onClose={() => setSelectedTaskForStatus(null)}
      />

      <RoutePreviewModal
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        tasks={myTasks}
      />

      <KycChecklistModal
        lead={selectedLeadForKyc}
        isOpen={!!selectedLeadForKyc}
        onClose={() => setSelectedLeadForKyc(null)}
      />
    </div>
  );
}
