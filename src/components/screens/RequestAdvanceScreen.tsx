import React, { useState } from 'react';
import { IMAGES } from '../../data/mockData';
import { AdvanceTransaction, AppScreen } from '../../types';

interface RequestAdvanceScreenProps {
  onBack: () => void;
  onNavigate: (screen: AppScreen) => void;
  availableCap: number;
  onAdvanceCompleted: (newAdvance: AdvanceTransaction) => void;
}

export const RequestAdvanceScreen: React.FC<RequestAdvanceScreenProps> = ({
  onBack,
  onNavigate,
  availableCap,
  onAdvanceCompleted,
}) => {
  const [amount, setAmount] = useState<number>(40000);
  const [selectedPurpose, setSelectedPurpose] = useState<string>('Classroom supplies');
  const [transferState, setTransferState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [completedTx, setCompletedTx] = useState<AdvanceTransaction | null>(null);

  const FLAT_FEE = 500.0;
  const BASE_MONTHLY_PAY = 420000.0;

  const netReceived = Math.max(0, amount - FLAT_FEE);
  const estRemainingPaycheck = Math.max(0, BASE_MONTHLY_PAY - amount);

  const presets = [
    { label: '+₦10k', value: 10000 },
    { label: '+₦25k', value: 25000 },
    { label: '+₦50k', value: 50000 },
    { label: 'Max', value: availableCap },
  ];

  const purposes = [
    'Classroom supplies',
    'Emergency medical',
    'Car repair',
    'Household bills',
  ];

  const handlePreset = (val: number) => {
    if (val === availableCap) {
      setAmount(availableCap);
    } else {
      setAmount((prev) => Math.min(availableCap, prev + val));
    }
  };

  const handleConfirmTransfer = () => {
    if (transferState !== 'idle') return;
    setTransferState('processing');

    const newTx: AdvanceTransaction = {
      id: `tx-${Date.now()}`,
      amount,
      fee: FLAT_FEE,
      netReceived,
      requestedAt: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        month: 'short',
        day: 'numeric',
      }),
      repaymentDate: 'March 28, 2025',
      status: 'completed',
      bankAccount: 'Zenith Bank Direct Deposit (•••• 8921)',
      purpose: selectedPurpose,
      referenceNumber: `LP-${Math.floor(1000000 + Math.random() * 9000000)}`,
    };

    setTimeout(() => {
      setCompletedTx(newTx);
      setTransferState('success');
      onAdvanceCompleted(newTx);
    }, 1400);
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto pb-8 space-y-4">
      {/* Status Context Ribbon */}
      <div className="flex items-center justify-between py-1 px-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-[#006c49]"></span>
          <span className="text-[11px] font-semibold text-[#006c49] uppercase tracking-wider">
            Payroll Synced • Certified District
          </span>
        </div>
        <div className="flex items-center gap-1 bg-[#e5eeff] px-2.5 py-0.5 rounded-full text-[#45464d] text-[11px] font-semibold">
          <span className="material-symbols-outlined text-[14px]">event_repeat</span>
          <span>Next Pay: Mar 28</span>
        </div>
      </div>

      {/* Available Balance Card */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#eff4ff]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] text-[#45464d] flex items-center gap-1 font-medium">
              <span>Available to Access Now</span>
              <span className="material-symbols-outlined text-[16px] text-[#565e74]">info</span>
            </p>
            <p className="text-[28px] font-bold text-[#0b1c30] mt-0.5 tabular-nums">
              ₦{availableCap.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-[#6cf8bb]/30 text-[#00714d] px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] fill">verified</span>
            <span className="text-[11px] font-semibold">0% APR Guaranteed</span>
          </div>
        </div>

        {/* Interactive Amount Controller */}
        <div className="mt-5 flex flex-col items-center justify-center bg-[#eff4ff] rounded-2xl py-5 px-3">
          <span className="text-[11px] font-semibold text-[#45464d] tracking-wider uppercase">
            Select Advance Amount
          </span>

          <div className="flex items-baseline justify-center mt-1">
            <span className="text-[30px] font-semibold text-[#0b1c30] mr-0.5">₦</span>
            <span
              id="display-amount"
              className="text-[38px] font-bold text-[#0b1c30] tracking-tight tabular-nums"
            >
              {amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Native Range Slider */}
          <div className="w-full px-2 mt-4">
            <input
              id="amount-slider"
              type="range"
              min={5000}
              max={availableCap}
              step={1000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-[#dce9ff] rounded-lg appearance-none cursor-pointer accent-[#006c49]"
            />
            <div className="flex justify-between items-center text-[11px] text-[#45464d] mt-2 px-1 font-medium">
              <span>Min ₦5,000</span>
              <span className="text-[#0b1c30] font-semibold">
                Current Cap: ₦{availableCap.toLocaleString('en-NG')}
              </span>
              <span>Max ₦{availableCap.toLocaleString('en-NG')}</span>
            </div>
          </div>

          {/* Quick Preset Chips */}
          <div className="grid grid-cols-4 gap-2 w-full mt-4">
            {presets.map((p) => {
              const isMax = p.label === 'Max';
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handlePreset(p.value)}
                  className={`py-2 px-1 rounded-xl text-[13px] font-semibold transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                    isMax
                      ? 'bg-[#6ffbbe] text-[#002113] hover:opacity-90 shadow-xs'
                      : 'bg-white hover:bg-[#dce9ff] text-[#0b1c30]'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Destination Account Selector */}
      <section className="bg-white rounded-2xl p-4 shadow-xs border border-[#eff4ff]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[13px] text-[#45464d] font-semibold">Disbursement Destination</span>
          <span className="text-[11px] text-[#006c49] font-bold">Default RTP Account</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-[#eff4ff] rounded-xl">
          <div className="w-10 h-10 rounded-full bg-[#d3e4fe] flex items-center justify-center text-[#0b1c30] shrink-0">
            <span className="material-symbols-outlined text-[20px] fill">account_balance</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-[#0b1c30] truncate">Zenith Bank Direct Deposit</p>
            <p className="text-[12px] text-[#45464d]">•••• 8921 • Personal NUBAN</p>
          </div>
          <div className="flex items-center gap-1 bg-[#6cf8bb]/40 text-[#00714d] px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap">
            <span className="material-symbols-outlined text-[13px]">bolt</span>
            <span>Instant</span>
          </div>
        </div>
      </section>

      {/* Transparent Fee & Repayment Breakdown Card */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#eff4ff] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
          <h2 className="text-[15px] font-bold text-[#0b1c30] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#006c49]">receipt_long</span>
            <span>Clear Breakdown</span>
          </h2>
          <span className="text-[11px] text-[#45464d] bg-[#eff4ff] px-2.5 py-0.5 rounded-full font-medium">
            No Credit Check
          </span>
        </div>

        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-[#45464d]">Requested Advance</span>
            <span className="text-[#0b1c30] font-semibold tabular-nums">
              ₦{amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between text-[14px]">
            <span className="text-[#45464d] flex items-center gap-1">
              <span>Flat Delivery Fee</span>
              <span className="material-symbols-outlined text-[14px] text-[#565e74]">help_outline</span>
            </span>
            <div className="text-right">
              <span className="text-[#0b1c30] font-semibold tabular-nums">
                ₦{FLAT_FEE.toFixed(2)}
              </span>
              <span className="block text-[11px] text-[#006c49] font-semibold">0% Interest Rate</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#eff4ff] rounded-xl">
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-[#0b1c30]">Total to Receive Instantly</span>
              <span className="text-[11px] text-[#45464d]">Credited within 60 seconds</span>
            </div>
            <span className="text-[20px] font-bold text-[#006c49] tabular-nums">
              ₦{netReceived.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="pt-2 space-y-2 text-[13px] border-t border-[#eff4ff]">
            <div className="flex items-center justify-between">
              <span className="text-[#45464d] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#565e74]">calendar_month</span>
                <span>Auto-Repayment Date</span>
              </span>
              <span className="text-[#0b1c30] font-semibold">March 28, 2025</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#45464d]">Est. Remaining Paycheck</span>
              <span className="text-[#0b1c30] font-semibold tabular-nums">
                ₦{estRemainingPaycheck.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Spending Purpose (Optional) */}
      <section className="bg-white rounded-2xl p-4 shadow-xs border border-[#eff4ff]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-semibold text-[#0b1c30]">
            Spending Purpose <span className="text-[#45464d] font-normal">(Optional)</span>
          </span>
          <span className="text-[11px] text-[#565e74]">Helps budget tracking</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {purposes.map((p) => {
            const isSelected = selectedPurpose === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPurpose(p)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#131b2e] text-white shadow-xs'
                    : 'bg-[#eff4ff] text-[#45464d] hover:bg-[#dce9ff]'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </section>

      {/* Teacher Support Affirmation Card */}
      <div className="bg-[#eff4ff] rounded-2xl p-3.5 flex items-center gap-3">
        <img
          alt="Elementary school teacher standing proudly in modern classroom"
          src={IMAGES.affirmationTeacher}
          className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-white"
        />
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-[#0b1c30]">You've earned this salary</p>
          <p className="text-[12px] text-[#45464d] leading-snug">
            Accessing earned pay avoids credit debt, overdraft fees, and high-interest loans.
          </p>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          type="button"
          disabled={transferState === 'processing'}
          onClick={handleConfirmTransfer}
          className="w-full py-4 px-6 bg-[#006c49] hover:bg-[#005236] text-white rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-transform cursor-pointer disabled:opacity-75"
        >
          {transferState === 'processing' ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[20px]">
                progress_activity
              </span>
              <span>Processing Real-Time Transfer...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span>Confirm & Transfer ₦{netReceived.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-center mt-1">
          <span className="material-symbols-outlined text-[14px] text-[#006c49]">verified_user</span>
          <p className="text-[11px] text-[#45464d]">
            Funds arrive in seconds. Auto-deducted seamlessly from your school payroll.
          </p>
        </div>
      </div>

      {/* Success Modal / Instant Transfer Receipt */}
      {transferState === 'success' && completedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4 border border-[#d3e4fe]">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#6cf8bb]/40 text-[#006c49] flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px] fill">check_circle</span>
            </div>

            <div className="text-center">
              <span className="text-[11px] font-semibold text-[#006c49] uppercase tracking-wider bg-[#6cf8bb]/30 px-3 py-1 rounded-full">
                Transfer Dispatched
              </span>
              <h3 className="text-[22px] font-bold text-[#0b1c30] mt-2">
                ₦{completedTx.netReceived.toLocaleString('en-NG', { minimumFractionDigits: 2 })} Sent!
              </h3>
              <p className="text-[12px] text-[#45464d] mt-1">
                Funds have been initiated to Zenith Bank Direct Deposit (•••• 8921) via NIP.
              </p>
            </div>

            <div className="bg-[#eff4ff] rounded-2xl p-3.5 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#45464d]">Reference No:</span>
                <span className="font-mono font-bold text-[#0b1c30]">{completedTx.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45464d]">Repayment Date:</span>
                <span className="font-semibold text-[#0b1c30]">{completedTx.repaymentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45464d]">Category Tag:</span>
                <span className="font-semibold text-[#006c49]">{completedTx.purpose}</span>
              </div>
              <div className="flex justify-between border-t border-[#dce9ff] pt-1.5 font-semibold text-[#0b1c30]">
                <span>Pay stub deduction:</span>
                <span>₦{completedTx.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setTransferState('idle');
                  onNavigate('advances');
                }}
                className="w-full py-3 bg-[#006c49] hover:bg-[#005236] text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                View in Advances Activity
              </button>

              <button
                type="button"
                onClick={() => {
                  setTransferState('idle');
                  onNavigate('dashboard');
                }}
                className="w-full py-2.5 bg-[#eff4ff] text-[#0b1c30] font-semibold text-xs rounded-xl hover:bg-[#dce9ff] transition-colors cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
