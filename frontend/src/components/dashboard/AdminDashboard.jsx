import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import {
  DailyCollectionsTrendChart,
  TeamPerformanceBarChart,
  PortfolioAgingDonut,
} from './ChartsSection';
import {
  Wallet,
  AlertTriangle,
  Users,
  Target,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldAlert,
  Download,
  Phone,
  FileCheck,
} from 'lucide-react';

export function AdminDashboard() {
  const {
    tasks,
    metrics,
    fieldExecutives,
    approveSettlement,
    rejectSettlement,
    setActiveTab,
    addToast,
  } = useApp();

  const pendingSettlements = tasks.filter((t) => t.amountCollected > 0 && !t.settlementApproved);
  const criticalOverdues = tasks.filter((t) => t.overdueDays > 30 && t.status !== 'Collected');

  const handleExportSummary = () => {
    addToast('Generating Organization Collections & NPA Risk Report (CSV)...', 'info');
    setTimeout(() => {
      addToast('Report generated and downloaded to your local drive.', 'success');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">Super Admin Command Center</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Live Network
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Real-time portfolio collections, field agent tracking, and high-risk default oversight
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSummary}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Global Audit</span>
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm shadow-blue-500/20"
          >
            <span>Dispatch Tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Collections Today"
          value={`₹${metrics.totalCollectedToday.toLocaleString('en-IN')}`}
          change="+14.8% vs yesterday"
          isPositive={true}
          icon={Wallet}
          accentColor="blue"
          subtitle="Target: ₹3,20,000"
        />

        <StatCard
          title="Total Overdue at Risk"
          value={`₹${metrics.totalOverdue.toLocaleString('en-IN')}`}
          change={`${metrics.criticalOverdueCount} Critical DPD accounts`}
          isPositive={false}
          icon={AlertTriangle}
          accentColor="rose"
          subtitle="90+ DPD Delinquency"
        />

        <StatCard
          title="Field Force On Duty"
          value={`${fieldExecutives.filter((e) => e.status === 'On Duty').length} / ${fieldExecutives.length} Active`}
          change="92.4% avg efficiency"
          isPositive={true}
          icon={Users}
          accentColor="emerald"
          subtitle="GPS Lock Verified"
        />

        <StatCard
          title="Lead Pipeline Conversion"
          value={`${metrics.leadConversionRate}%`}
          change={`${metrics.totalLeadsCount} active enquiries`}
          isPositive={true}
          icon={Target}
          accentColor="indigo"
          subtitle="Target conversion: 65%"
        />
      </div>

      {/* Recharts Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <DailyCollectionsTrendChart />
        </div>
        <div>
          <PortfolioAgingDonut />
        </div>
      </div>

      {/* Team Target vs Actual Bar Chart */}
      <TeamPerformanceBarChart />

      {/* Dual Tables: Pending Settlements for Approval & Critical Delinquency Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pending Settlements Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Settlements Pending Admin Sign-Off
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
              {pendingSettlements.length} awaiting
            </span>
          </div>

          {pendingSettlements.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
              All field collection settlements are approved and audited.
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingSettlements.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{task.customerName}</span>
                      <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded border border-blue-200">
                        {task.loanId}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">({task.paymentMode})</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Logged by: <span className="text-slate-800 font-semibold">{task.assignedExecutiveName}</span> • Receipt: {task.receiptNo || 'Pending'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-blue-600">
                        ₹{(task.amountCollected || task.emiAmountDue).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">Amount Collected</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => approveSettlement(task.id)}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-200"
                        title="Approve Settlement"
                      >
                        <CheckCircle2 className="w-4 h-4" />
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

        {/* High-Risk Default Accounts Watchlist */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Critical NPA Delinquency Watchlist
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {criticalOverdues.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors flex items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{task.customerName}</span>
                    <Badge variant={task.overdueSeverity} size="xs">
                      {task.overdueDays} DPD
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 truncate max-w-xs">{task.address}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-rose-600">
                      ₹{task.emiAmountDue.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">{task.assignedExecutiveName}</div>
                  </div>
                  <a
                    href={`tel:${task.customerPhone}`}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                    title={`Call ${task.customerName}`}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
