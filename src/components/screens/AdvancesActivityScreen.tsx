import React, { useState } from 'react';
import { AdvanceTransaction, ActivityRecord, TeacherScreen } from '../../types';

interface AdvancesActivityScreenProps {
  transactions: AdvanceTransaction[];
  activities: ActivityRecord[];
  onNavigate: (screen: TeacherScreen) => void;
}

export const AdvancesActivityScreen: React.FC<AdvancesActivityScreenProps> = ({
  transactions,
  activities,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'advances' | 'deposits'>('all');
  const [selectedTx, setSelectedTx] = useState<AdvanceTransaction | null>(null);

  const totalAdvancedThisCycle = transactions
    .filter((t) => t.status !== 'repaid')
    .reduce((sum, t) => sum + t.amount, 0);

  const estRemainingPaycheck = 420000.0 - totalAdvancedThisCycle;

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto pb-10 space-y-4">
      {/* Top Banner Summary */}
      <div className="bg-[#131b2e] text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#006c49]/30 blur-2xl"></div>

        <div className="flex items-center justify-between text-[#7c839b] text-[11px] font-semibold uppercase tracking-wider">
          <span>March 2025 Pay Period</span>
          <span className="text-[#6ffbbe] bg-[#6cf8bb]/20 px-2 py-0.5 rounded-full">
            Settlement: Mar 28
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="p-3 bg-[#d3e4fe]/10 rounded-xl">
            <span className="text-[11px] text-[#7c839b] block">Total Advances</span>
            <span className="text-[22px] font-bold text-white tabular-nums block mt-0.5">
              ₦{totalAdvancedThisCycle.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-[#6ffbbe] mt-0.5 block">0% interest applied</span>
          </div>

          <div className="p-3 bg-[#006c49]/30 rounded-xl border border-[#6cf8bb]/20">
            <span className="text-[11px] text-[#6ffbbe] block">Est. Mar 28 Deposit</span>
            <span className="text-[22px] font-bold text-white tabular-nums block mt-0.5">
              ₦{estRemainingPaycheck.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-[#7c839b] mt-0.5 block">After auto-deduction</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('request-advance')}
          className="mt-4 w-full py-3 bg-[#006c49] hover:bg-[#005236] text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Request New Salary Advance</span>
        </button>
      </div>

      {/* Paycheck Settlement Flow Preview */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eff4ff] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-[#0b1c30] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#006c49]">account_tree</span>
            <span>Automated Payroll Settlement</span>
          </h3>
          <span className="text-[11px] text-[#45464d] bg-[#eff4ff] px-2 py-0.5 rounded-full font-medium">
            Zero Manual Repayment
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between p-2.5 rounded-xl bg-[#eff4ff]">
            <span className="text-[#45464d]">Baseline Net Monthly Salary:</span>
            <span className="font-semibold text-[#0b1c30]">₦420,000.00</span>
          </div>

          <div className="flex justify-between p-2.5 rounded-xl bg-[#eff4ff]">
            <span className="text-[#45464d]">Lopay Earned Salary Accessed:</span>
            <span className="font-semibold text-[#ba1a1a]">
              -₦{totalAdvancedThisCycle.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between p-2.5 rounded-xl bg-[#6cf8bb]/20 border border-[#6cf8bb]/40 font-bold text-[#0b1c30]">
            <span>Net Disbursed to Zenith Bank on Mar 28:</span>
            <span className="text-[#006c49]">
              ₦{estRemainingPaycheck.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#e5eeff] rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'all' ? 'bg-white text-[#0b1c30] shadow-xs' : 'text-[#45464d]'
          }`}
        >
          All Activity
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('advances')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'advances' ? 'bg-white text-[#0b1c30] shadow-xs' : 'text-[#45464d]'
          }`}
        >
          Advances
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('deposits')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'deposits' ? 'bg-white text-[#0b1c30] shadow-xs' : 'text-[#45464d]'
          }`}
        >
          Payroll Deposits
        </button>
      </div>

      {/* List of Transactions */}
      <div className="space-y-2">
        {activities
          .filter((a) => {
            if (activeTab === 'advances') return a.type === 'advance';
            if (activeTab === 'deposits') return a.type === 'deposit';
            return true;
          })
          .map((item) => (
            <div
              key={item.id}
              onClick={() => {
                const match = transactions.find((t) => t.amount === item.amount);
                if (match) setSelectedTx(match);
              }}
              className="p-3.5 rounded-2xl bg-white shadow-xs border border-[#eff4ff] flex items-center justify-between gap-3 hover:bg-[#f8f9ff] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    item.isPositive
                      ? 'bg-[#6cf8bb]/30 text-[#00714d]'
                      : 'bg-[#eff4ff] text-[#45464d]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      item.isPositive ? 'fill' : ''
                    }`}
                  >
                    {item.isPositive ? 'account_balance' : 'receipt_long'}
                  </span>
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-bold text-[#0b1c30] truncate">{item.title}</span>
                  <span className="text-[12px] text-[#45464d] truncate">{item.date}</span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span
                  className={`text-[15px] font-bold tabular-nums ${
                    item.isPositive ? 'text-[#006c49]' : 'text-[#0b1c30]'
                  }`}
                >
                  {item.isPositive ? '+' : ''}₦{item.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold mt-0.5 ${
                    item.status === 'Completed'
                      ? 'bg-[#6cf8bb]/30 text-[#00714d]'
                      : item.status === 'Repaid'
                      ? 'bg-[#e5eeff] text-[#45464d]'
                      : 'bg-[#dce9ff] text-[#008cc7]'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setSelectedTx(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#006c49]">receipt</span>
                <h3 className="text-sm font-bold text-[#0b1c30]">Disbursement Receipt</h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-xs text-[#76777d] hover:text-[#0b1c30]"
              >
                Close
              </button>
            </div>

            <div className="text-center py-2">
              <span className="text-xs text-[#45464d]">Advance Transferred</span>
              <h2 className="text-[28px] font-bold text-[#0b1c30] mt-0.5">
                ₦{selectedTx.netReceived.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00714d] bg-[#6cf8bb]/30 px-2.5 py-0.5 rounded-full mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></span>
                NIP Direct Deposit Completed
              </span>
            </div>

            <div className="bg-[#eff4ff] rounded-2xl p-3.5 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#45464d]">Recipient:</span>
                <span className="font-semibold text-[#0b1c30]">Sarah Jenkins, M.Ed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45464d]">Destination:</span>
                <span className="font-semibold text-[#0b1c30]">{selectedTx.bankAccount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45464d]">Transaction Ref:</span>
                <span className="font-mono text-[#0b1c30]">{selectedTx.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45464d]">Delivery Fee:</span>
                <span className="font-semibold text-[#0b1c30]">₦{selectedTx.fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45464d]">Interest (APR):</span>
                <span className="font-semibold text-[#006c49]">0.00% Guaranteed</span>
              </div>
              <div className="flex justify-between border-t border-[#dce9ff] pt-2 font-bold text-[#0b1c30]">
                <span>Pay stub settlement:</span>
                <span>₦{selectedTx.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                alert(`Official statement ${selectedTx.referenceNumber}.pdf downloaded!`);
                setSelectedTx(null);
              }}
              className="w-full py-2.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006c49] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Download Official Receipt (PDF)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
