import React, { useState } from 'react';
import { IMAGES } from '../../data/mockData';
import { AppScreen } from '../../types';

interface SettingsScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate }) => {
  const [smsEnabled, setSmsEnabled] = useState<boolean>(true);
  const [emailReceipts, setEmailReceipts] = useState<boolean>(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does Lopay 0% APR Earned Wage Access work?',
      a: 'Lopay connects directly with Oakridge International School payroll. As you teach each day, you accrue earned salary. Rather than waiting for the 28th of the month, you can access up to 50% of what you have already earned for a tiny flat ₦500 fee. It is never a loan and incurs zero interest.',
    },
    {
      q: 'How is the advance repaid?',
      a: 'Repayment is 100% automated. When Oakridge processes the monthly payroll on the 28th, the exact advance amount is deducted directly on your pay stub, and the remainder of your paycheck is deposited into your Zenith Bank account as normal.',
    },
    {
      q: 'Does using Lopay impact my credit score?',
      a: 'No. There are zero credit checks, zero credit bureau reports, and no underwriting debt. You are simply accessing money you have already worked for.',
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto pb-10 space-y-4">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#eff4ff] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            alt="Sarah Jenkins"
            src={IMAGES.profileSarah}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-[#006c49]"
          />
          <div className="min-w-0">
            <h2 className="text-[16px] font-bold text-[#0b1c30] truncate">Sarah Jenkins, M.Ed</h2>
            <p className="text-[12px] text-[#45464d] truncate">Senior Science Teacher</p>
            <p className="text-[11px] text-[#006c49] font-semibold mt-0.5">Oakridge International School</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('onboarding-invite')}
          className="text-xs font-semibold text-[#006c49] bg-[#eff4ff] hover:bg-[#dce9ff] px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          View Badge
        </button>
      </div>

      {/* Payroll Sync Status */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#eff4ff] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#006c49]">sync_saved_locally</span>
            <h3 className="text-[14px] font-bold text-[#0b1c30]">School Payroll Integration</h3>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00714d] bg-[#6cf8bb]/30 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></span>
            Active
          </span>
        </div>

        <div className="p-3 bg-[#eff4ff] rounded-xl text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[#45464d]">Employer Portal:</span>
            <span className="font-semibold text-[#0b1c30]">Oakridge District HR Sync</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#45464d]">Pay Cycle:</span>
            <span className="font-semibold text-[#0b1c30]">28th of every month</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#45464d]">Last Sync:</span>
            <span className="font-semibold text-[#006c49]">Today at 08:00 AM (17 of 31 days)</span>
          </div>
        </div>
      </div>

      {/* Disbursement Account */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#eff4ff] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#0b1c30]">account_balance</span>
            <h3 className="text-[14px] font-bold text-[#0b1c30]">Disbursement Account</h3>
          </div>
          <span className="text-[11px] font-semibold text-[#006c49] bg-[#6cf8bb]/30 px-2 py-0.5 rounded-full">
            Verified Direct Deposit
          </span>
        </div>

        <div className="p-3.5 bg-[#eff4ff] rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[13px] font-bold text-[#0b1c30]">Zenith Bank Direct Deposit</p>
            <p className="text-[11px] text-[#45464d]">Routing: •••• 4412 • Account: •••••••• 8921</p>
          </div>
          <span className="text-xs font-semibold text-[#006c49]">Instant NIP</span>
        </div>
      </div>

      {/* Preferences & Notifications */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#eff4ff] space-y-3">
        <h3 className="text-[14px] font-bold text-[#0b1c30]">Preferences</h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#0b1c30]">SMS Payout Notifications</p>
              <p className="text-[#45464d]">Receive real-time text alert when funds land</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smsEnabled}
                onChange={(e) => setSmsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#d3e4fe] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006c49]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between border-t border-[#eff4ff] pt-2.5">
            <div>
              <p className="font-semibold text-[#0b1c30]">Institutional Email Receipts</p>
              <p className="text-[#45464d]">Copy s.jenkins@oakridge.edu on statements</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailReceipts}
                onChange={(e) => setEmailReceipts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#d3e4fe] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006c49]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between border-t border-[#eff4ff] pt-2.5">
            <div>
              <p className="font-semibold text-[#0b1c30]">Auto-Save Stipend Match</p>
              <p className="text-[#45464d]">Oakridge ₦50,000 STEM classroom fund auto-enroll</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoSaveEnabled}
                onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#d3e4fe] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006c49]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#eff4ff] space-y-2">
        <h3 className="text-[14px] font-bold text-[#0b1c30] mb-2">Teacher FAQ</h3>
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-[#eff4ff] rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full p-3 text-left font-semibold text-xs text-[#0b1c30] flex items-center justify-between bg-[#f8f9ff] hover:bg-[#eff4ff] transition-colors"
            >
              <span>{faq.q}</span>
              <span className="material-symbols-outlined text-[18px] text-[#76777d]">
                {openFaq === idx ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            {openFaq === idx && (
              <div className="p-3 text-xs text-[#45464d] leading-relaxed bg-white border-t border-[#eff4ff]">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
