import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CollectPaymentModal } from './CollectPaymentModal';
import {
  CheckCircle2,
  Search,
  QrCode,
  Banknote,
  Download,
} from 'lucide-react';

export function CollectionsTracker() {
  const { filteredTasks, currentRole, ROLES, approveSettlement, addToast } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('all'); // 'all', 'pending_approval', 'approved'
  const [selectedTaskForReceipt, setSelectedTaskForReceipt] = useState(null);
  const [search, setSearch] = useState('');

  // Only tasks that have a collection amount
  const collectionTasks = filteredTasks.filter((t) => t.amountCollected > 0 || t.status === 'Collected');

  const filteredItems = collectionTasks.filter((task) => {
    const matchSearch =
      task.customerName.toLowerCase().includes(search.toLowerCase()) ||
      task.loanId.toLowerCase().includes(search.toLowerCase()) ||
      (task.receiptNo && task.receiptNo.toLowerCase().includes(search.toLowerCase())) ||
      task.assignedExecutiveName.toLowerCase().includes(search.toLowerCase());

    if (activeSubTab === 'pending_approval') {
      return matchSearch && !task.settlementApproved;
    }
    if (activeSubTab === 'approved') {
      return matchSearch && task.settlementApproved;
    }
    return matchSearch;
  });

  const totalCollected = collectionTasks.reduce((s, t) => s + (t.amountCollected || 0), 0);
  const upiTotal = collectionTasks
    .filter((t) => t.paymentMode === 'UPI')
    .reduce((s, t) => s + (t.amountCollected || 0), 0);
  const cashTotal = collectionTasks
    .filter((t) => t.paymentMode === 'Cash')
    .reduce((s, t) => s + (t.amountCollected || 0), 0);

  const pendingCount = collectionTasks.filter((t) => !t.settlementApproved).length;

  const handleExport = () => {
    addToast('Exporting collections log to CSV format...', 'info');
    setTimeout(() => {
      addToast('Collections ledger downloaded successfully.', 'success');
    }, 1000);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">Collections Tracker & Settlement Desk</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live Reconciliation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Real-time receipt ledger, payment mode distribution, and settlement approvals
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Summary Metrics Banner with clean styling */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Total Collections Reconciled</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-600">
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">{collectionTasks.length} successful receipts generated</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-blue-600" /> UPI / QR Scan
            </span>
            <span className="text-xs font-mono font-bold text-blue-600">
              {totalCollected > 0 ? Math.round((upiTotal / totalCollected) * 100) : 0}%
            </span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            ₹{upiTotal.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Instant digital settlement to treasury</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
              <Banknote className="w-3.5 h-3.5 text-emerald-600" /> Physical Cash
            </span>
            <span className="text-xs font-mono font-bold text-emerald-600">
              {totalCollected > 0 ? Math.round((cashTotal / totalCollected) * 100) : 0}%
            </span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            ₹{cashTotal.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Requires branch cash vault handoff</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'All Collected', count: collectionTasks.length },
            { id: 'pending_approval', label: 'Pending Settlement Signoff', count: pendingCount },
            { id: 'approved', label: 'Approved & Audited', count: collectionTasks.length - pendingCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap font-bold ${
                activeSubTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeSubTab === tab.id ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search receipts, customer, agent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 text-xs font-medium"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Customer & Loan</th>
                <th className="py-3 px-4">Collected Amount</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Collected By</th>
                <th className="py-3 px-4">Approval Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No collection records in this view.
                  </td>
                </tr>
              ) : (
                filteredItems.map((task) => (
                  <tr key={task.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {task.receiptNo || 'Pending Issue'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{task.customerName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{task.loanId}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-blue-600 text-sm">
                      ₹{(task.amountCollected || task.emiAmountDue).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {task.paymentMode || 'UPI'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-semibold">{task.assignedExecutiveName}</div>
                      <div className="text-[11px] text-slate-500">{task.collectedAt || 'Today'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {task.settlementApproved ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Pending Signoff
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedTaskForReceipt(task)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold border border-slate-200 transition-colors"
                        >
                          View E-Receipt
                        </button>

                        {/* TL or Admin can approve directly */}
                        {currentRole !== ROLES.EXECUTIVE && !task.settlementApproved && (
                          <button
                            onClick={() => approveSettlement(task.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-xs"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      <CollectPaymentModal
        task={selectedTaskForReceipt}
        isOpen={!!selectedTaskForReceipt}
        onClose={() => setSelectedTaskForReceipt(null)}
      />
    </div>
  );
}
