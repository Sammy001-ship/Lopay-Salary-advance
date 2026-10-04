import React, { useState } from 'react';
import { IMAGES, REGISTERED_SCHOOLS } from '../../data/mockData';
import { SchoolOwner, Teacher, AdvanceTransaction, OwnerScreen, RegisteredSchool } from '../../types';
import { TeacherDirectoryScreen } from '../screens/TeacherDirectoryScreen';
import { LopayLogoMark } from '../common/LopayLogo';
import { AdvanceRequestsMonitor } from './AdvanceRequestsMonitor';
import { RegisteredSchoolsDirectory } from './RegisteredSchoolsDirectory';

interface OwnerDashboardProps {
  owner: SchoolOwner;
  teachers: Teacher[];
  transactions: AdvanceTransaction[];
  onAddTeacher: (teacher: Teacher) => void;
  onLogout: () => void;
  onSwitchToTeacher?: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  owner,
  teachers,
  transactions,
  onAddTeacher,
  onLogout,
  onSwitchToTeacher,
}) => {
  const [currentTab, setCurrentTab] = useState<OwnerScreen>('overview');
  const [advancesViewMode, setAdvancesViewMode] = useState<'monitor' | 'ledger'>('monitor');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [payrollCycleDay, setPayrollCycleDay] = useState<number>(owner.payrollCycleDay || 28);
  const [payrollUpdateSaved, setPayrollUpdateSaved] = useState<boolean>(false);

  // Registered Schools state with localStorage persistence
  const [schoolsList, setSchoolsList] = useState<RegisteredSchool[]>(() => {
    try {
      const saved = localStorage.getItem('lopay_registered_schools');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return REGISTERED_SCHOOLS;
  });

  // Active selected school (defaults to owner's school or first school in list)
  const [activeSchool, setActiveSchool] = useState<RegisteredSchool>(() => {
    const defaultSchool = schoolsList.find((s) => s.name === owner.schoolName) || schoolsList[0];
    return defaultSchool;
  });

  const handleSelectSchool = (school: RegisteredSchool, targetTab?: OwnerScreen) => {
    setActiveSchool(school);
    setPayrollCycleDay(school.payrollCycleDay || 28);
    if (targetTab) {
      setCurrentTab(targetTab);
    }
  };

  const handleAddSchool = (newSchool: RegisteredSchool) => {
    setSchoolsList((prev) => {
      const updated = [newSchool, ...prev];
      try {
        localStorage.setItem('lopay_registered_schools', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    // Set newly created school as active
    setActiveSchool(newSchool);
  };

  const handleUpdatePayrollDay = (newDay: number) => {
    setPayrollCycleDay(newDay);
    setPayrollUpdateSaved(true);
    setTimeout(() => setPayrollUpdateSaved(false), 2500);
  };

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
            <LopayLogoMark size={28} color="#0b1c30" accentColor="#ffffff" />
            <div
              className="flex flex-col min-w-0 cursor-pointer group"
              onClick={() => setCurrentTab('schools')}
              title="Click to view or switch schools"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[13px] font-bold text-[#0b1c30] truncate group-hover:text-[#006c49] transition-colors">
                  {activeSchool.name}
                </span>
                <span className="material-symbols-outlined text-[14px] text-[#76777d] group-hover:text-[#006c49] transition-colors">
                  unfold_more
                </span>
              </div>
              <span className="text-[10px] text-[#006c49] font-bold flex items-center gap-1 leading-none mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></span>
                {activeSchool.rcNumber} • LOPAY Admin
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
                <span className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#6ffbbe] shrink-0"></span>
                  <span className="truncate font-bold text-white">{activeSchool.name}</span>
                </span>
                <span className="bg-[#6cf8bb]/20 text-[#6ffbbe] px-2.5 py-0.5 rounded-full font-bold shrink-0">
                  {activeSchool.rcNumber}
                </span>
              </div>

              <div className="mt-3">
                <h2 className="text-[22px] font-bold text-white tracking-tight">
                  {activeSchool.proprietorName}
                </h2>
                <p className="text-xs text-[#d3e4fe] mt-0.5">
                  Proprietor &amp; Governing Director • {activeSchool.location}
                </p>
              </div>

              {/* 3 Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-[#213145]">
                <div className="p-3 bg-[#d3e4fe]/10 rounded-xl">
                  <span className="text-[11px] text-[#7c839b] block">Monthly Payroll Pool</span>
                  <span className="text-[18px] font-bold text-white tabular-nums block mt-0.5">
                    ₦{(activeSchool.monthlyPayrollBudget || estimatedPayroll).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-[#6ffbbe] mt-0.5 block">{activeSchool.payrollCycleDay}th Monthly Cycle</span>
                </div>

                <div className="p-3 bg-[#006c49]/30 border border-[#6cf8bb]/20 rounded-xl">
                  <span className="text-[11px] text-[#6ffbbe] block">Faculty Advances This Month</span>
                  <span className="text-[18px] font-bold text-white tabular-nums block mt-0.5">
                    ₦{(activeSchool.advancesThisMonth || totalAdvancesSum).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-[#7c839b] mt-0.5 block">{activeSchool.facultyCount} active faculty</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCurrentTab('schools')}
                className="p-3 bg-white rounded-2xl shadow-xs border border-[#eff4ff] flex flex-col items-start gap-2 hover:bg-[#eff4ff] transition-colors cursor-pointer text-left group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#6cf8bb]/30 text-[#006c49] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">domain</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0b1c30] block group-hover:text-[#006c49] transition-colors">
                    Schools ({schoolsList.length})
                  </span>
                  <span className="text-[10px] text-[#45464d] block">All Institutions</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCurrentTab('roster')}
                className="p-3 bg-white rounded-2xl shadow-xs border border-[#eff4ff] flex flex-col items-start gap-2 hover:bg-[#eff4ff] transition-colors cursor-pointer text-left group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#dce9ff] text-[#008cc7] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0b1c30] block group-hover:text-[#008cc7] transition-colors">
                    Add Teacher
                  </span>
                  <span className="text-[10px] text-[#45464d] block">SMS &amp; Email</span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleExportCsv}
                className="p-3 bg-white rounded-2xl shadow-xs border border-[#eff4ff] flex flex-col items-start gap-2 hover:bg-[#eff4ff] transition-colors cursor-pointer text-left group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#eff4ff] text-[#45464d] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">file_download</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0b1c30] block">
                    Export Pay
                  </span>
                  <span className="text-[10px] text-[#45464d] block">CSV Ledger</span>
                </div>
              </button>
            </div>

            {/* Registered Schools Live Network Snippet */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#eff4ff] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#eff4ff] text-[#006c49] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">domain</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0b1c30]">Registered Schools Network</h3>
                    <p className="text-[11px] text-[#45464d]">{schoolsList.length} accredited institutions registered on Lopay</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentTab('schools')}
                  className="text-xs text-[#006c49] font-bold hover:underline flex items-center gap-0.5"
                >
                  <span>View All ({schoolsList.length})</span>
                  <span className="material-symbols-outlined text-[15px]">chevron_right</span>
                </button>
              </div>

              {/* Quick Schools Pills/Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {schoolsList.slice(0, 4).map((school) => {
                  const isCurrent = activeSchool.id === school.id;
                  return (
                    <div
                      key={school.id}
                      onClick={() => handleSelectSchool(school, 'overview')}
                      className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-[#006c49]/15 border-2 border-[#006c49] shadow-xs'
                          : 'bg-[#eff4ff] hover:bg-[#dce9ff] border border-transparent'
                      }`}
                      title={`Click to view ${school.name}`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-bold text-[#0b1c30] truncate">{school.name}</p>
                          {isCurrent && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] shrink-0"></span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#45464d] truncate mt-0.5">
                          {school.location.split(',')[0]} • Cycle: {school.payrollCycleDay}th
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-bold text-[#006c49] block">
                          {school.facultyCount} Faculty
                        </span>
                        <span className="text-[9px] bg-[#6cf8bb]/40 text-[#00714d] font-semibold px-1.5 py-0.2 rounded-full inline-block mt-0.5">
                          {isCurrent ? 'Viewing' : 'Select'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {schoolsList.length > 4 && (
                <button
                  type="button"
                  onClick={() => setCurrentTab('schools')}
                  className="w-full py-2 bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#006c49] text-xs font-semibold rounded-xl text-center transition-colors cursor-pointer border border-[#d3e4fe]/50"
                >
                  + {schoolsList.length - 4} more schools registered • Open Schools Directory
                </button>
              )}
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

        {/* 1b. SCHOOLS DIRECTORY SCREEN */}
        {currentTab === 'schools' && (
          <RegisteredSchoolsDirectory
            schools={schoolsList}
            activeSchoolId={activeSchool.id}
            onAddSchool={handleAddSchool}
            onSelectSchool={(school, targetTab) => handleSelectSchool(school, targetTab)}
          />
        )}

        {/* 2. ROSTER & PROVISIONING SCREEN (Matching Image 3) */}
        {currentTab === 'roster' && (
          <TeacherDirectoryScreen
            teachers={teachers}
            onAddTeacher={onAddTeacher}
            schoolName={activeSchool.name}
            rcNumber={activeSchool.rcNumber}
            facultyCount={activeSchool.facultyCount}
            payrollCycleDay={activeSchool.payrollCycleDay}
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
            {/* View Sub-Switcher */}
            <div className="flex items-center justify-between bg-white p-1.5 rounded-2xl border border-[#eff4ff] shadow-xs">
              <button
                type="button"
                onClick={() => setAdvancesViewMode('monitor')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  advancesViewMode === 'monitor'
                    ? 'bg-[#006c49] text-white shadow-xs'
                    : 'text-[#45464d] hover:bg-[#eff4ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">pie_chart</span>
                <span>User Sections &amp; Delivery Fee Monitor</span>
              </button>

              <button
                type="button"
                onClick={() => setAdvancesViewMode('ledger')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  advancesViewMode === 'ledger'
                    ? 'bg-[#006c49] text-white shadow-xs'
                    : 'text-[#45464d] hover:bg-[#eff4ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">table_rows</span>
                <span>Raw Ledger</span>
              </button>
            </div>

            {/* View 1: User Section & Delivery Fee Monitor */}
            {advancesViewMode === 'monitor' && (
              <AdvanceRequestsMonitor
                teachers={teachers}
                transactions={transactions}
                onExportSchedule={handleExportCsv}
              />
            )}

            {/* View 2: Raw Settlement Ledger */}
            {advancesViewMode === 'ledger' && (
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
                        <p className="text-xs font-bold text-[#0b1c30]">{tx.teacherName || 'Faculty Member'}</p>
                        <p className="text-[11px] text-[#45464d]">{tx.purpose} • {tx.requestedAt}</p>
                        <span className="text-[10px] text-[#76777d] font-mono">{tx.referenceNumber}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-[#006c49] block tabular-nums">
                          ₦{tx.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] text-[#76777d] block">
                          Fee: ₦{(tx.fee || 500).toLocaleString('en-NG')}
                        </span>
                        <span className="text-[10px] bg-[#6cf8bb]/40 text-[#00714d] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                <div className="flex items-center justify-between p-2.5 bg-[#eff4ff] rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-[#45464d]">Payroll Date:</span>
                    {payrollUpdateSaved && (
                      <span className="text-[10px] text-[#006c49] font-bold">Saved successfully!</span>
                    )}
                  </div>
                  <select
                    value={payrollCycleDay}
                    onChange={(e) => handleUpdatePayrollDay(Number(e.target.value))}
                    className="bg-white text-[#0b1c30] font-semibold text-xs py-1 px-2.5 rounded-lg border border-[#d3e4fe] focus:outline-hidden focus:ring-2 focus:ring-[#006c49] cursor-pointer"
                  >
                    <option value={25}>25th Monthly</option>
                    <option value={26}>26th Monthly</option>
                    <option value={27}>27th Monthly</option>
                    <option value={28}>28th Monthly</option>
                    <option value={29}>29th Monthly</option>
                    <option value={30}>30th Monthly</option>
                    <option value={31}>31st Monthly (Month-End)</option>
                  </select>
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
        <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-1">
          <button
            type="button"
            onClick={() => setCurrentTab('overview')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-12 transition-colors cursor-pointer ${
              currentTab === 'overview' ? 'text-[#006c49] font-bold' : 'text-[#45464d]'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${currentTab === 'overview' ? 'fill' : ''}`}>
              dashboard
            </span>
            <span className="text-[10px]">Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('schools')}
            className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-12 transition-colors cursor-pointer ${
              currentTab === 'schools' ? 'text-[#006c49] font-bold' : 'text-[#45464d]'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${currentTab === 'schools' ? 'fill' : ''}`}>
              domain
            </span>
            <span className="text-[10px]">Schools</span>
            <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-[#006c49]"></span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('roster')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-12 transition-colors cursor-pointer ${
              currentTab === 'roster' ? 'text-[#006c49] font-bold' : 'text-[#45464d]'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${currentTab === 'roster' ? 'fill' : ''}`}>
              groups
            </span>
            <span className="text-[10px]">Faculty</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('advances')}
            className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-12 transition-colors cursor-pointer ${
              currentTab === 'advances' ? 'text-[#006c49] font-bold' : 'text-[#45464d]'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${currentTab === 'advances' ? 'fill' : ''}`}>
              monitoring
            </span>
            <span className="text-[10px] leading-tight">Advances</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('settings')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-12 transition-colors cursor-pointer ${
              currentTab === 'settings' ? 'text-[#006c49] font-bold' : 'text-[#45464d]'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${currentTab === 'settings' ? 'fill' : ''}`}>
              settings
            </span>
            <span className="text-[10px]">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
