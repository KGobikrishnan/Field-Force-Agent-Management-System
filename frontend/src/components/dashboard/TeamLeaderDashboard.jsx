import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import {
  Wallet,
  CheckCircle2,
  Users,
  Compass,
  ArrowRight,
  UserCheck,
  Send,
  Phone,
  FileCheck,
  XCircle,
} from 'lucide-react';

export function TeamLeaderDashboard() {
  const {
    currentUser,
    leads,
    filteredTasks,
    filteredExecutives,
    approveSettlement,
    rejectSettlement,
    setActiveTab,
  } = useApp();

  const teamCollectedToday = filteredTasks.reduce((s, t) => s + (t.amountCollected || 0), 0);
  const teamTarget = 140000;
  const targetPercent = Math.min(100, Math.round((teamCollectedToday / teamTarget) * 100));

  const unassignedLeads = leads.filter((l) => !l.assignedExecutiveId || l.stage === 'New Enquiry');
  const pendingApprovals = filteredTasks.filter((t) => t.amountCollected > 0 && !t.settlementApproved);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">Team Leader Command Dashboard</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Zone: {currentUser.zoneId || 'Metro Branch'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Overseeing assigned field executives, daily target attainment, task dispatch, and approvals
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('tasks')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm shadow-blue-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch Tasks</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Team Target Achieved"
          value={`₹${teamCollectedToday.toLocaleString('en-IN')}`}
          change={`${targetPercent}% of daily goal`}
          isPositive={targetPercent >= 70}
          icon={Wallet}
          accentColor="blue"
          subtitle={`Daily Goal: ₹${teamTarget.toLocaleString('en-IN')}`}
        />

        <StatCard
          title="Field Agents Under TL"
          value={`${filteredExecutives.length} Executives`}
          change="100% active on route"
          isPositive={true}
          icon={Users}
          accentColor="emerald"
          subtitle="Real-time GPS lock"
        />

        <StatCard
          title="Pending Settlements"
          value={`${pendingApprovals.length} Receipts`}
          change="Awaiting your approval"
          isPositive={pendingApprovals.length === 0}
          icon={CheckCircle2}
          accentColor="amber"
          subtitle="Verification required"
        />

        <StatCard
          title="Unassigned Leads"
          value={`${unassignedLeads.length} Incoming`}
          change="Requires agent dispatch"
          isPositive={false}
          icon={UserCheck}
          accentColor="purple"
          subtitle="Ready for allocation"
        />
      </div>

      {/* Target Progress Bar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">
            Team Daily Target Attainment
          </span>
          <span className="font-mono text-blue-600 font-extrabold text-sm">
            ₹{teamCollectedToday.toLocaleString('en-IN')} / ₹{teamTarget.toLocaleString('en-IN')} ({targetPercent}%)
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden relative border border-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
            style={{ width: `${targetPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500 font-medium">
          Tip: Prioritize Rahul Verma's 10:30 AM Connaught Place collection to exceed today's target by 12:00 PM.
        </p>
      </div>

      {/* Executives Live Status Tracker Grid */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Assigned Field Executives - Real-time Status
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('team')}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
          >
            <span>Full Team View</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExecutives.map((exec) => {
            const execPercent = Math.min(100, Math.round((exec.dailyCollected / exec.dailyTarget) * 100));

            return (
              <div
                key={exec.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={exec.avatar}
                      alt={exec.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{exec.name}</span>
                        <Badge variant={exec.status} size="xs">
                          {exec.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{exec.gpsStatus}</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${exec.phone}`}
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors shadow-xs"
                    title={`Call ${exec.name}`}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Target Progress:</span>
                    <span className="text-slate-800 font-bold">
                      ₹{exec.dailyCollected.toLocaleString('en-IN')} / ₹{exec.dailyTarget.toLocaleString('en-IN')} ({execPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${execPercent}%` }}
                    />
                  </div>
                </div>

                {/* Stats pills */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-[11px] text-center">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200">
                    <div className="text-slate-500">Active Tasks</div>
                    <div className="font-extrabold text-slate-900">{exec.activeTasksCount}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200">
                    <div className="text-slate-500">Completed</div>
                    <div className="font-extrabold text-emerald-600">{exec.completedTasksCount}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200">
                    <div className="text-slate-500">Score</div>
                    <div className="font-extrabold text-blue-600">{exec.efficiencyScore}%</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settlement Approval Requests queue for TL */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Field Collection Settlements Awaiting Your Approval
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {pendingApprovals.length} item{pendingApprovals.length !== 1 ? 's' : ''}
          </span>
        </div>

        {pendingApprovals.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
            No pending settlements in your team queue. All collections verified!
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingApprovals.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
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
                  <p className="text-xs text-slate-500 mt-1">
                    Agent: <span className="text-slate-800 font-semibold">{task.assignedExecutiveName}</span> • Payment Mode: {task.paymentMode} • Receipt: {task.receiptNo || 'Pending'}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-blue-600">
                      ₹{(task.amountCollected || task.emiAmountDue).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">Collected</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => approveSettlement(task.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => rejectSettlement(task.id, 'Discrepancy in receipt number')}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors border border-rose-200"
                      title="Reject Settlement"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
