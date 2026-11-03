import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  ShieldCheck,
  Square,
  CheckCircle2,
} from 'lucide-react';

export function KycChecklistModal({ lead, isOpen, onClose }) {
  const { toggleKycDoc, updateLeadStage } = useApp();

  if (!lead) return null;

  const docs = [
    { key: 'aadhaar', label: 'Aadhaar Card (UIDAI e-KYC)', desc: 'Identity & Age Verification (12-digit UID)' },
    { key: 'pan', label: 'PAN Card (IT Dept Tax ID)', desc: 'Permanent Account Number for credit bureau pull' },
    { key: 'bankStatement', label: '6 Months Bank Statement', desc: 'Average quarterly balance & EMI bounce check' },
    { key: 'addressProof', label: 'Physical Residence Proof', desc: 'Electricity bill / Rental agreement < 3 months' },
    { key: 'businessProof', label: 'Business / Shop Establishment Proof', desc: 'GSTIN, Udyam Aadhaar or Trade License' },
    { key: 'guarantorConsent', label: 'Guarantor KYC & Signed Co-Obligation', desc: 'Neighbor/family reference verification' },
  ];

  const verifiedCount = Object.values(lead.documentChecklist || {}).filter(Boolean).length;
  const isFullyVerified = verifiedCount === docs.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Field KYC & Document Verification"
      subtitle={`Customer: ${lead.customerName} (${lead.id})`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {/* Customer Snapshot header */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-900 text-sm block">{lead.customerName}</span>
            <span className="text-slate-500">{lead.loanType} • ₹{lead.requestedAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-slate-500 font-medium">CIBIL Score:</span>
              <span className={`font-extrabold font-mono ${lead.cibilScore >= 700 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {lead.cibilScore}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Monthly: ₹{lead.monthlyIncome?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Verification Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Document Checklist Progress
            </span>
            <span className="font-bold text-blue-600">
              {verifiedCount} of {docs.length} Completed
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isFullyVerified ? 'bg-emerald-500' : 'bg-blue-600'
              }`}
              style={{ width: `${(verifiedCount / docs.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Interactive Checklist Items */}
        <div className="space-y-2">
          {docs.map((doc) => {
            const isChecked = !!lead.documentChecklist[doc.key];

            return (
              <div
                key={doc.key}
                onClick={() => toggleKycDoc(lead.id, doc.key)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                  isChecked
                    ? 'bg-emerald-50/60 border-emerald-200 text-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-slate-400 focus:outline-none"
                >
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isChecked ? 'text-emerald-800' : 'text-slate-800'}`}>
                      {doc.label}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        isChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isChecked ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{doc.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Change Stage Selector */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Pipeline Stage Transition</label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {['KYC & Verification', 'Underwriting Review', 'Approved', 'Rejected'].map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => updateLeadStage(lead.id, stage)}
                className={`p-2 rounded-xl border font-bold transition-all ${
                  lead.stage === stage
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            Done / Close Verification
          </button>
        </div>
      </div>
    </Modal>
  );
}
