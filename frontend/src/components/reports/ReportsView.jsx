import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Building,
} from 'lucide-react';

export function ReportsView() {
  const { auditLogs, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.loanId.toLowerCase().includes(search.toLowerCase());

    const matchSeverity = filterSeverity === 'all' || log.severity === filterSeverity;

    return matchSearch && matchSeverity;
  });

  const handleDownload = (format) => {
    addToast(`Generating compliance audit report in ${format.toUpperCase()}...`, 'info');
    setTimeout(() => {
      addToast(`Official audit ledger (${format.toUpperCase()}) saved.`, 'success');
    }, 1200);
  };

  const branchLeaderboard = [
    { branch: 'North Zone - Metro Branch', target: 140000, collected: 126700, efficiency: 90.5, defaultRate: '1.8%' },
    { branch: 'West Zone - Industrial Hub', target: 65000, collected: 58000, efficiency: 89.2, defaultRate: '2.1%' },
    { branch: 'South Zone - Downtown Branch', target: 120000, collected: 96000, efficiency: 80.0, defaultRate: '3.4%' },
    { branch: 'East Zone - Rural Outreach', target: 55000, collected: 35000, efficiency: 63.6, defaultRate: '5.2%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">Global Reports & Regulatory Audit Logs</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Audit Compliance Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Immutable log trail of field activities, collection disbursements, and branch performance analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload('csv')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleDownload('pdf')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm shadow-blue-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Official PDF</span>
          </button>
        </div>
      </div>

      {/* Branch Performance Leaderboard */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Branch Recovery Leaderboard & Delinquency Index
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">All 4 Operational Branches</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Branch Location</th>
                <th className="py-2.5 px-3">Daily Target</th>
                <th className="py-2.5 px-3">Collected Today</th>
                <th className="py-2.5 px-3">Recovery Rate</th>
                <th className="py-2.5 px-3">Default / NPA Rate</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {branchLeaderboard.map((item, idx) => (
                <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    {item.branch}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 font-medium">
                    ₹{item.target.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 font-mono font-extrabold text-blue-600">
                    ₹{item.collected.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    {item.efficiency}%
                  </td>
                  <td className="py-3 px-3 font-mono text-amber-700 font-bold">
                    {item.defaultRate}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.efficiency >= 85
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {item.efficiency >= 85 ? 'Target Met' : 'Follow-up Needed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Audit Log Section */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Live Immutable Activity Log</h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter audit trail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-blue-600"
              />
            </div>

            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none"
            >
              <option value="all">All Events</option>
              <option value="success">Payment & Approvals</option>
              <option value="warning">Rescheduled & Unassigned</option>
              <option value="danger">Escalations</option>
              <option value="info">System & Shifts</option>
            </select>
          </div>
        </div>

        {/* Audit Log Entries List */}
        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
          {filteredLogs.map((log) => {
            let Icon = Info;
            let iconColor = 'text-blue-600 bg-blue-50 border-blue-200';

            if (log.severity === 'success') {
              Icon = CheckCircle2;
              iconColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
            } else if (log.severity === 'warning') {
              Icon = AlertTriangle;
              iconColor = 'text-amber-700 bg-amber-50 border-amber-200';
            } else if (log.severity === 'danger') {
              Icon = AlertTriangle;
              iconColor = 'text-rose-600 bg-rose-50 border-rose-200';
            }

            return (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 transition-colors flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl border ${iconColor} shrink-0 mt-0.5 shadow-2xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      {log.loanId !== 'N/A' && (
                        <span className="font-mono text-[10px] text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded border border-blue-200 font-bold">
                          {log.loanId}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500 font-medium">• {log.user}</span>
                    </div>
                    <p className="text-slate-600 mt-1 leading-snug font-medium">{log.details}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 font-mono block font-medium">{log.timestamp}</span>
                  <span className="text-[9px] text-slate-400 font-mono uppercase font-semibold">{log.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
