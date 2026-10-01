import React, { useState } from 'react';
import { IMAGES } from '../../data/mockData';
import { SchoolOwner, Teacher, AdvanceTransaction, OwnerScreen } from '../../types';
import { TeacherDirectoryScreen } from '../screens/TeacherDirectoryScreen';

interface OwnerDashboardProps {
  owner: SchoolOwner;
  teachers: Teacher[];
  transactions: AdvanceTransaction[];
  onAddTeacher: (teacher: Teacher) => void;
  onLogout: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  owner,
  teachers,
  transactions,
  onAddTeacher,
  onLogout,
}) => {
  const [currentTab, setCurrentTab] = useState<OwnerScreen>('overview');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Calculate school-wide metrics
  const activeStaffCount = teachers.filter((t) => t.status === 'active').length + 32; // base 34+
  const totalAdvancesSum = transactions.reduce((acc, t) => acc + t.amount, 0) + 840000; // includes other faculty
  const estimatedPayroll = owner.monthlyPayrollBudget;

  const handleExportCsv = () => {
    setDownloadNotice('Oakridge_Faculty_Deduction_Schedule_March2025.csv exported!');
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  return (
    <div className="flex flex-col w-full min-h-screen pb-20">
      {/* School Owner Top Header */}
      <header className="sticky top-0 z-30 bg-[#f8f9ff]/90 backdrop-blur-md border-b border-[#d3e4fe]/50 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img alt="Lopay Logo" src={IMAGES.logo} className="h-7 w-auto object-contain" />
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-bold text-[#0b1c30] truncate">
                {owner.schoolName}
              </span>
              <span className="text-[11px] text-[#006c49] font-semibold flex items-center gap-1 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></span>
                School Admin Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#45464d] hover:bg-[#eff4ff]"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#006c49]"></span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/40 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              title="Log out of School Admin"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Drawer */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/40 backdrop-blur-xs"
          onClick={() => setShowNotifications(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-xl border border-[#d3e4fe] space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
              <h3 className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#006c49]">notifications</span>
                <span>School Admin Notifications</span>
              </h3>
              <button onClick={() => setShowNotifications(false)} className="text-xs text-[#76777d]">
                Close
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-[#eff4ff] rounded-xl">
                <p className="font-semibold text-[#0b1c30]">March Pay Stub Sync Ready</p>
                <p className="text-[#45464d] text-[11px] mt-0.5">
                  Automated settlement ledger prepared for March 28 payroll run.
                </p>
              </div>
              <div className="p-2.5 bg-[#eff4ff] rounded-xl">
                <p className="font-semibold text-[#0b1c30]">Faculty Advance Disbursed</p>
                <p className="text-[#45464d] text-[11px] mt-0.5">
                  Sarah Jenkins accessed ₦40,000 for classroom supplies.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab Content */}
      <main className="flex-1 w-full max-w-lg mx-auto p-4 space-y-4">
        {downloadNotice && (
          <div className="p-3 bg-[#6cf8bb]/30 border border-[#006c49]/30 rounded-xl text-xs font-semibold text-[#00714d] flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{downloadNotice}</span>
          </div>
        )}

        {/* 1. OVERVIEW SCREEN */}
        {currentTab === 'overview' && (
          <div className="space-y-4 animate-in fade-in">
            {/* School Header Card */}
            <div className="relative overflow-hidden rounded-2xl bg-[#131b2e] text-white p-5 shadow-lg">
              <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-[#006c49]/30 blur-2xl"></div>

              <div className="flex items-center justify-between text-[#7c839b] text-[11px] font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#6ffbbe]"></span>
                  <span>{owner.schoolName}</span>
                </span>
                <span className="bg-[#6cf8bb]/20 text-[#6ffbbe] px-2.5 py-0.5 rounded-full font-bold">
                  {owner.rcNumber}
                </span>
              </div>

              <div className="mt-3">
                <h2 className="text-[22px] font-bold text-white tracking-tight">
                  {owner.name}
                </h2>
                <p className="text-xs text-[#d3e4fe] mt-0.5">{owner.roleTitle}</p>
              </div>

              {/* 3 Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-[#213145]">
                <div className="p-3 bg-[#d3e4fe]/10 rounded-xl">
                  <span className="text-[11px] text-[#7c839b] block">Monthly Payroll Pool</span>
                  <span className="text-[18px] font-bold text-white tabular-nums block mt-0.5">
                    ₦{estimatedPayroll.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-[#6ffbbe] mt-0.5 block">28th Monthly Cycle</span>
                </div>

                <div className="p-3 bg-[#006c49]/30 border border-[#6cf8bb]/20 rounded-xl">
                  <span className="text-[11px] text-[#6ffbbe] block">Faculty Advances This Month</span>
                  <span className="text-[18px] font-bold text-white tabular-nums block mt-0.5">
                    ₦{totalAdvancesSum.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-[#7c839b] mt-0.5 block">Zero employer liability</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setCurrentTab('roster')}
                className="p-3.5 bg-white rounded-2xl shadow-xs border border-[#eff4ff] flex items-center gap-3 hover:bg-[#eff4ff] transition-colors cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-[#6cf8bb]/30 text-[#006c49] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">person_add</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0b1c30] block">Add New Teacher</span>
                  <span className="text-[11px] text-[#45464d] block">SMS &amp; Email invite</span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleExportCsv}
                className="p-3.5 bg-white rounded-2xl shadow-xs border border-[#eff4ff] flex items-center gap-3 hover:bg-[#eff4ff] transition-colors cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-[#dce9ff] text-[#008cc7] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">file_download</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0b1c30] block">Export Deductions</span>
                  <span className="text-[11px] text-[#45464d] block">March 28 pay sheet</span>
                </div>
              </button>
            </div>

            {/* Faculty Earned-Wage Claims Queue Snippet */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#eff4ff] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0b1c30]">Recent Faculty Advances</h3>
                  <p className="text-[11px] text-[#45464d]">Auto-deducted on March 28 pay stub</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentTab('advances')}
                  className="text-xs text-[#006c49] font-bold hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-[#eff4ff] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      alt="Sarah Jenkins"
                      src={IMAGES.profileSarah}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#0b1c30]">Sarah Jenkins, M.Ed</p>
                      <p className="text-[11px] text-[#45464d]">Science Dept • Classroom supplies</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#006c49]">₦40,000.00</span>
                    <span className="block text-[10px] text-[#45464d]">Scheduled for Mar 28</span>
                  </div>
                </div>

                <div className="p-3 bg-[#eff4ff] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      alt="Elena Rostova"
                      src={IMAGES.elenaRostova}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#0b1c30]">Elena Rostova</p>
                      <p className="text-[11px] text-[#45464d]">Physics Faculty • Emergency medical</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#006c49]">₦30,000.00</span>
                    <span className="block text-[10px] text-[#45464d]">Scheduled for Mar 28</span>
                  </div>
                </div>
              </div>
            </div>

            {/* School Faculty Benefit Guarantee */}
            <div className="p-4 bg-[#eff4ff] rounded-2xl border border-[#d3e4fe]/60 flex items-start gap-3">
              <span className="material-symbols-outlined text-[24px] text-[#006c49] shrink-0 mt-0.5">
                verified
              </span>
              <div className="text-xs text-[#45464d] leading-relaxed">
                <p className="font-bold text-[#0b1c30]">Zero Employer Liability</p>
                <p className="mt-0.5">
                  Lopay pre-funds all salary advances. Your school payroll balance is only debited on normal
                  payday (March 28), ensuring healthy school cashflow and faculty retention.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. ROSTER & PROVISIONING SCREEN (Matching Image 3) */}
        {currentTab === 'roster' && (
          <TeacherDirectoryScreen
            teachers={teachers}
            onAddTeacher={onAddTeacher}
            onNavigate={(screen) => {
              if (screen === 'onboarding-invite') {
                setCurrentTab('roster');
              }
            }}
          />
        )}

        {/* 3. ADVANCES QUEUE & AUDIT LEDGER */}
        {currentTab === 'advances' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#eff4ff] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
                <div>
                  <h3 className="text-sm font-bold text-[#0b1c30]">All Faculty Advance Claims</h3>
                  <p className="text-[11px] text-[#45464d]">Oakridge School Payroll Reconciliation</p>
                </div>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="px-2.5 py-1 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006c49] text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">download</span>
                  <span>CSV</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 bg-[#eff4ff] rounded-xl flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0b1c30]">Sarah Jenkins, M.Ed</p>
                      <p className="text-[11px] text-[#45464d]">{tx.purpose} • {tx.requestedAt}</p>
                      <span className="text-[10px] text-[#76777d] font-mono">{tx.referenceNumber}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-[#006c49] block tabular-nums">
                        ₦{tx.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[10px] bg-[#6cf8bb]/40 text-[#00714d] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="p-3 bg-[#eff4ff] rounded-xl flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0b1c30]">Elena Rostova</p>
                    <p className="text-[11px] text-[#45464d]">Emergency medical • Yesterday</p>
                    <span className="text-[10px] text-[#76777d] font-mono">LP-4829104</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#006c49] block tabular-nums">
                      ₦30,000.00
                    </span>
                    <span className="text-[10px] bg-[#6cf8bb]/40 text-[#00714d] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5">
                      completed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. SCHOOL OWNER SETTINGS */}
        {currentTab === 'settings' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#eff4ff] space-y-3">
              <h3 className="text-sm font-bold text-[#0b1c30]">School Institution Details</h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 bg-[#eff4ff] rounded-xl">
                  <span className="text-[#45464d]">School Name:</span>
                  <span className="font-bold text-[#0b1c30]">{owner.schoolName}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-[#eff4ff] rounded-xl">
                  <span className="text-[#45464d]">CAC / RC Number:</span>
                  <span className="font-semibold text-[#0b1c30]">{owner.rcNumber}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-[#eff4ff] rounded-xl">
                  <span className="text-[#45464d]">Payroll Cycle Day:</span>
                  <span className="font-semibold text-[#0b1c30]">{owner.payrollCycleDay}th of every month</span>
                </div>
                <div className="flex justify-between p-2.5 bg-[#eff4ff] rounded-xl">
                  <span className="text-[#45464d]">Admin Contact:</span>
                  <span className="font-semibold text-[#0b1c30]">{owner.email}</span>
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={onLogout}
              className="w-full py-3 bg-[#ffdad6] hover:bg-[#ffdad6]/80 text-[#ba1a1a] font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Sign Out of School Admin Portal</span>
            </button>
          </div>
        )}
      </main>

      {/* Owner Bottom Tab Bar */}
      <nav className="fixed bottom-0 w-full z-40 pb-[env(safe-area-inset-bottom,0px)] bg-[#f8f9ff]/90 backdrop-blur-xl border-t border-[#d3e4fe]/50 shadow-md">
        <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
          <button
            type="button"
            onClick={() => setCurrentTab('overview')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-12 transition-colors cursor-pointer ${
              currentTab === 'overview' ? 'text-[#006c49] font-bold' : 'text-[#45464d]'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${currentTab === 'overview' ? 'fill' : ''}`}>
              dashboard
            </span>
            <span className="text-[11px]">Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('roster')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-12 transition-colors cursor-pointer ${
              currentTab === 'roster' ? 'text-[#006c49] font-bold' : 'text-[#45464d]'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${currentTab === 'roster' ? 'fill' : ''}`}>
              groups
            </span>
            <span className="text-[11px]">Faculty</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('advances')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-12 transition-colors cursor-pointer ${
              currentTab === 'advances' ? 'text-[#006c49] font-bold' : 'text-[#45464d]'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${currentTab === 'advances' ? 'fill' : ''}`}>
              payments
            </span>
            <span className="text-[11px]">Advances</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('settings')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-12 transition-colors cursor-pointer ${
              currentTab === 'settings' ? 'text-[#006c49] font-bold' : 'text-[#45464d]'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${currentTab === 'settings' ? 'fill' : ''}`}>
              settings
            </span>
            <span className="text-[11px]">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
