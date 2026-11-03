import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { PlusCircle } from 'lucide-react';

export function NewLeadModal({ isOpen, onClose }) {
  const { addNewLead, fieldExecutives, ZONES } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [email, setEmail] = useState('');
  const [requestedAmount, setRequestedAmount] = useState('150000');
  const [loanType, setLoanType] = useState('SME Micro Loan');
  const [purpose, setPurpose] = useState('');
  const [address, setAddress] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('35000');
  const [zoneId, setZoneId] = useState(ZONES[1]?.id || 'north-metro');
  const [assignedExecutiveId, setAssignedExecutiveId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !address) {
      alert('Please fill in Customer Name and Address');
      return;
    }

    const exec = fieldExecutives.find((e) => e.id === assignedExecutiveId);
    const zoneObj = ZONES.find((z) => z.id === zoneId) || ZONES[1];

    addNewLead({
      customerName,
      customerPhone: customerPhone || '+91 98XXX XXXXX',
      email: email || `${customerName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      requestedAmount: Number(requestedAmount),
      loanType,
      purpose: purpose || 'Working capital and operational expansion',
      address,
      monthlyIncome: Number(monthlyIncome),
      zoneId,
      zoneName: zoneObj.name,
      assignedExecutiveId: assignedExecutiveId || null,
      assignedExecutiveName: exec ? exec.name : 'Unassigned',
      cibilScore: 710,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Loan Enquiry Lead"
      subtitle="Enter applicant details for field KYC and underwriting"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Applicant Full Name *</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Anand K. Verma"
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Contact Number *</label>
            <input
              type="text"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+91 98XXX XXXXX"
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="applicant@domain.com"
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Loan Product</label>
            <select
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none"
            >
              <option>SME Micro Loan</option>
              <option>Micro-Enterprise Loan</option>
              <option>Two-Wheeler Loan</option>
              <option>Women Empowerment Loan</option>
              <option>Commercial Vehicle Loan</option>
              <option>Personal Medical Emergency</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Requested Amount (₹) *</label>
            <input
              type="number"
              required
              value={requestedAmount}
              onChange={(e) => setRequestedAmount(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-blue-600 font-mono font-bold focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Monthly Income (₹)</label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-mono focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Residence / Shop Address *</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Plot/Flat no, Area, Landmark, City..."
            className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Target Branch / Zone</label>
            <select
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none"
            >
              {ZONES.filter((z) => z.id !== 'all').map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Pre-Assign Field Executive (Optional)</label>
            <select
              value={assignedExecutiveId}
              onChange={(e) => setAssignedExecutiveId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none"
            >
              <option value="">Leave Unassigned (TL will dispatch)</option>
              {fieldExecutives.map((exec) => (
                <option key={exec.id} value={exec.id}>
                  {exec.name} ({exec.zoneName.split('-')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Loan Purpose</label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. Purchase grocery inventory for festival sales"
            className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Lead to Pipeline</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
