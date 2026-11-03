import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  QrCode,
  Banknote,
  Camera,
  CheckCircle2,
  Printer,
  Share2,
} from 'lucide-react';

export function CollectPaymentModal({ task, isOpen, onClose }) {
  const { collectPayment } = useApp();

  const [paymentMode, setPaymentMode] = useState('UPI');
  const [collectedAmount, setCollectedAmount] = useState(task ? task.emiAmountDue : '');
  const [notes, setNotes] = useState('');
  const [proofPhotoName, setProofPhotoName] = useState('');
  const [receiptData, setReceiptData] = useState(null);

  if (!task) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProofPhotoName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!collectedAmount || Number(collectedAmount) <= 0) {
      alert('Please enter a valid amount collected');
      return;
    }

    const res = collectPayment(task.id, {
      amount: collectedAmount,
      paymentMode,
      notes,
      proofPhoto: proofPhotoName || 'receipt_sample_proof.jpg',
    });

    setReceiptData({
      receiptNo: res.receiptNo,
      amount: collectedAmount,
      mode: paymentMode,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      customerName: task.customerName,
      loanId: task.loanId,
      agentName: task.assignedExecutiveName,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setReceiptData(null);
        onClose();
      }}
      title={receiptData ? 'Official Collection E-Receipt' : 'Collect EMI Payment'}
      subtitle={
        receiptData
          ? 'Transaction recorded & synchronized with head office'
          : `Record payment for ${task.customerName} (${task.loanId})`
      }
      maxWidth="max-w-lg"
    >
      {receiptData ? (
        /* Digital Receipt View */
        <div className="space-y-5">
          <div className="p-6 rounded-2xl bg-slate-50 border border-emerald-300 text-slate-900 space-y-4 relative overflow-hidden print:p-0 shadow-sm">
            {/* Watermark badge */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-blue-700 font-extrabold block">
                  FinFlow Microfinance
                </span>
                <span className="text-[10px] text-slate-500">RBI Regulated NBFC-MFI</span>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>PAID & VERIFIED</span>
              </div>
            </div>

            {/* Receipt Details */}
            <div className="text-center py-2 space-y-1">
              <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Amount Collected</span>
              <div className="text-3xl font-extrabold text-blue-600 font-mono">
                ₹{Number(receiptData.amount).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Payment Mode: <span className="text-slate-900 font-bold">{receiptData.mode}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-200">
              <div>
                <span className="text-slate-500 block text-[11px] font-medium">Receipt Number</span>
                <span className="font-mono text-slate-900 font-bold">{receiptData.receiptNo}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-medium">Loan Account</span>
                <span className="font-mono text-blue-700 font-bold">{receiptData.loanId}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-medium">Customer</span>
                <span className="text-slate-900 font-bold">{receiptData.customerName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-medium">Recovery Agent</span>
                <span className="text-slate-900 font-bold">{receiptData.agentName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-medium">Date & Time</span>
                <span className="text-slate-700 font-medium">{receiptData.date} at {receiptData.time}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-medium">Auth Status</span>
                <span className="text-emerald-700 font-bold">Digital Signature Valid</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download</span>
            </button>
            <button
              onClick={() => {
                const text = `E-Receipt ${receiptData.receiptNo}: Received ₹${receiptData.amount} for Loan ${receiptData.loanId} by FinFlow Officer.`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp Receipt</span>
            </button>
          </div>
        </div>
      ) : (
        /* Payment Entry Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Summary banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block font-medium">Customer / Loan:</span>
              <span className="font-bold text-slate-900">{task.customerName}</span>
              <span className="font-mono text-blue-700 font-semibold ml-1.5">({task.loanId})</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block font-medium">EMI Due:</span>
              <span className="font-extrabold text-blue-600 text-sm">
                ₹{task.emiAmountDue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Payment Mode Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Select Payment Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMode('UPI')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                  paymentMode === 'UPI'
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-4 h-4 text-blue-600" />
                <span>UPI / QR Code Scan</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('Cash')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                  paymentMode === 'Cash'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>Physical Cash</span>
              </button>
            </div>
          </div>

          {/* QR Code Simulation if UPI */}
          {paymentMode === 'UPI' && (
            <div className="p-4 rounded-xl bg-slate-50 border border-blue-200 flex items-center gap-4">
              <div className="w-20 h-20 bg-white p-1 rounded-lg border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                <div className="w-full h-full bg-blue-900 rounded flex flex-col items-center justify-center p-1 text-[8px] text-white text-center font-mono">
                  <span>FINFLOW</span>
                  <span className="text-blue-200 text-[10px] font-bold">UPI QR</span>
                  <span className="text-[7px] text-blue-300">{task.loanId}</span>
                </div>
              </div>
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-900 block">Customer UPI Scan</span>
                <p className="text-slate-500 text-[11px] leading-snug">
                  Ask customer to scan with PhonePe, Google Pay, or Paytm. Auto-reconciliation active.
                </p>
                <span className="text-[10px] text-blue-700 font-mono font-semibold">VPA: finflow.loan@icici</span>
              </div>
            </div>
          )}

          {/* Amount input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Amount Collected (₹)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                value={collectedAmount}
                onChange={(e) => setCollectedAmount(e.target.value)}
                placeholder="Enter collected amount"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-bold text-base focus:outline-none focus:border-blue-600"
                required
              />
            </div>
          </div>

          {/* Proof / Mock Photo Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Photo / Receipt Proof (Optional)</span>
              {proofPhotoName && (
                <span className="text-[11px] text-emerald-600 font-bold">
                  ✓ {proofPhotoName}
                </span>
              )}
            </label>
            <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs text-slate-600 transition-colors">
              <Camera className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{proofPhotoName ? 'Change uploaded photo' : 'Snap photo or upload cash slip'}</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Field Collection Note</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Received from customer at residence, verified currency notes..."
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Issue E-Receipt</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
