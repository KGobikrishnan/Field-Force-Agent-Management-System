import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KycChecklistModal } from './KycChecklistModal';
import { AssignLeadModal } from './AssignLeadModal';
import { NewLeadModal } from './NewLeadModal';
import {
  Plus,
  Search,
  Phone,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export function LeadPipeline() {
  const { filteredLeads, currentRole, ROLES } = useApp();

  const [search, setSearch] = useState('');
  const [selectedLeadForKyc, setSelectedLeadForKyc] = useState(null);
  const [selectedLeadForAssign, setSelectedLeadForAssign] = useState(null);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

  const stages = [
    { id: 'New Enquiry', label: 'New Enquiries', color: 'border-cyan-300 text-cyan-800' },
    { id: 'Customer Visit', label: 'Field Visit Scheduled', color: 'border-blue-300 text-blue-700' },
    { id: 'KYC & Verification', label: 'KYC & Docs Collection', color: 'border-sky-300 text-sky-800' },
    { id: 'Underwriting Review', label: 'Credit Underwriting', color: 'border-indigo-300 text-indigo-800' },
    { id: 'Approved', label: 'Approved / Ready Disbursal', color: 'border-emerald-300 text-emerald-800' },
  ];

  const filteredItems = filteredLeads.filter((lead) => {
    return (
      lead.customerName.toLowerCase().includes(search.toLowerCase()) ||
      lead.id.toLowerCase().includes(search.toLowerCase()) ||
      (lead.assignedExecutiveName &&
        lead.assignedExecutiveName.toLowerCase().includes(search.toLowerCase())) ||
      lead.loanType.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">Loan Enquiries & KYC Pipeline</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {filteredItems.length} Leads Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Track prospective borrowers through physical home visits, document collections, and credit approval
          </p>
        </div>

        <button
          onClick={() => setIsNewLeadModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm shadow-blue-500/20 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Loan Enquiry</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3 text-xs">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by customer, ID, or agent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 text-xs font-medium"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Tip: Click <span className="text-blue-600 font-bold">Verify KYC</span> on any card to update checklist
        </div>
      </div>

      {/* Stage Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
        {stages.map((stage) => {
          const leadsInStage = filteredItems.filter((l) => l.stage === stage.id);
          const totalAmount = leadsInStage.reduce((s, l) => s + l.requestedAmount, 0);

          return (
            <div
              key={stage.id}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col space-y-3 min-h-[450px]"
            >
              {/* Stage Column Header */}
              <div className="border-b border-slate-100 pb-2.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-xs ${stage.color}`}>{stage.label}</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-700 font-mono font-bold">
                    {leadsInStage.length}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono font-semibold">
                  Vol: ₹{(totalAmount / 100000).toFixed(1)}L
                </div>
              </div>

              {/* Lead Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[650px] pr-0.5">
                {leadsInStage.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-400">No leads in stage</div>
                ) : (
                  leadsInStage.map((lead) => {
                    const verifiedDocsCount = Object.values(lead.documentChecklist || {}).filter(
                      Boolean
                    ).length;

                    return (
                      <div
                        key={lead.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all space-y-2.5 shadow-xs"
                      >
                        {/* Top: ID & Loan product */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded border border-blue-200">
                            {lead.id}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold truncate max-w-[120px]">
                            {lead.loanType}
                          </span>
                        </div>

                        {/* Customer & Requested Amount */}
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{lead.customerName}</h4>
                          <div className="text-base font-extrabold font-mono text-blue-600 mt-0.5">
                            ₹{lead.requestedAmount.toLocaleString('en-IN')}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">{lead.address}</p>
                        </div>

                        {/* CIBIL & KYC checklist progress */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                          <span className="text-slate-500 font-medium">
                            CIBIL:{' '}
                            <span
                              className={`font-mono font-bold ${
                                lead.cibilScore >= 700 ? 'text-emerald-600' : 'text-amber-600'
                              }`}
                            >
                              {lead.cibilScore}
                            </span>
                          </span>

                          <span className="text-blue-700 font-bold">
                            KYC: {verifiedDocsCount}/6 docs
                          </span>
                        </div>

                        {/* Assigned Executive pill */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                              {lead.assignedExecutiveName ? lead.assignedExecutiveName[0] : '?'}
                            </div>
                            <span className="text-[11px] text-slate-700 font-medium truncate max-w-[90px]">
                              {lead.assignedExecutiveName || 'Unassigned'}
                            </span>
                          </div>

                          {currentRole !== ROLES.EXECUTIVE && (
                            <button
                              onClick={() => setSelectedLeadForAssign(lead)}
                              className="text-[10px] text-blue-600 hover:text-blue-800 font-bold hover:underline"
                            >
                              {lead.assignedExecutiveId ? 'Reassign' : 'Assign'}
                            </button>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1">
                            <a
                              href={`tel:${lead.customerPhone}`}
                              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                              title={`Call ${lead.customerName}`}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`https://wa.me/${lead.customerPhone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors border border-emerald-200"
                              title={`WhatsApp ${lead.customerName}`}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          </div>

                          <button
                            onClick={() => setSelectedLeadForKyc(lead)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-colors shadow-xs"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verify KYC</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <KycChecklistModal
        lead={selectedLeadForKyc}
        isOpen={!!selectedLeadForKyc}
        onClose={() => setSelectedLeadForKyc(null)}
      />

      <AssignLeadModal
        lead={selectedLeadForAssign}
        isOpen={!!selectedLeadForAssign}
        onClose={() => setSelectedLeadForAssign(null)}
      />

      <NewLeadModal
        isOpen={isNewLeadModalOpen}
        onClose={() => setIsNewLeadModalOpen(false)}
      />
    </div>
  );
}
