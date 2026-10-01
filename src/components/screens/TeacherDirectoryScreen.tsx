import React, { useState } from 'react';
import { IMAGES } from '../../data/mockData';
import { Teacher, AppScreen } from '../../types';

interface TeacherDirectoryScreenProps {
  teachers: Teacher[];
  onAddTeacher: (teacher: Teacher) => void;
  onNavigate: (screen: AppScreen) => void;
}

export const TeacherDirectoryScreen: React.FC<TeacherDirectoryScreenProps> = ({
  teachers,
  onAddTeacher,
  onNavigate,
}) => {
  // Form State
  const [fullName, setFullName] = useState<string>('Sarah Jenkins, M.Ed');
  const [phone, setPhone] = useState<string>('+234 803 349 8812');
  const [email, setEmail] = useState<string>('s.jenkins@oakridge.edu');
  const [salary, setSalary] = useState<string>('420,000.00');
  const [startDate, setStartDate] = useState<string>('Sep 01, 2021');
  const [bankName, setBankName] = useState<string>('Zenith Bank');
  const [routingNumber, setRoutingNumber] = useState<string>('•••• 4412');
  const [accountNumber, setAccountNumber] = useState<string>('•••••••• 8921');
  const [allowAdvances, setAllowAdvances] = useState<boolean>(true);

  // Invite Button state
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);
  const [resendingId, setResendingId] = useState<string | null>(null);

  const numericSalary = parseFloat(salary.replace(/,/g, '')) || 420000;
  const advanceCap = Math.round(numericSalary * 0.5);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending || sendSuccess) return;

    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);

      const newTeacher: Teacher = {
        id: `teacher-${Date.now()}`,
        name: fullName || 'New Faculty Member',
        title: 'Faculty Instructor',
        email,
        phone,
        salary: numericSalary,
        maxAdvancePct: 50,
        eligibleAdvance: advanceCap,
        department: 'Science & Academics',
        startDate,
        bankName,
        routingNumber,
        accountNumber,
        allowAdvances,
        status: 'pending',
        avatarUrl: IMAGES.profileSarah,
        invitedAt: 'Just now',
      };

      onAddTeacher(newTeacher);

      setTimeout(() => {
        setSendSuccess(false);
      }, 3500);
    }, 1000);
  };

  const handleResend = (id: string) => {
    setResendingId(id);
    setTimeout(() => {
      setResendingId(null);
      alert('Invitation re-sent via SMS and institutional email.');
    }, 800);
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto pb-10 space-y-4">
      {/* School Admin Context Header Card */}
      <div className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#eff4ff] relative overflow-hidden">
        <div className="absolute -right-4 -top-6 w-28 h-28 bg-[#eff4ff] rounded-full opacity-60 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#dce9ff] text-[#45464d] font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></span>
              School Admin Portal
            </span>
            <span className="inline-flex items-center text-[#45464d] font-semibold text-[11px] gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#006c49] fill">
                verified
              </span>
              Verified Org
            </span>
          </div>

          <div className="mt-1">
            <h2 className="text-[20px] font-bold text-[#0b1c30] tracking-tight">
              Oakridge International School
            </h2>
            <p className="text-[13px] text-[#45464d]">
              Admin roster &amp; salary advance provisioning
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 bg-[#eff4ff] rounded-xl p-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#d3e4fe] flex items-center justify-center text-[#0b1c30]">
                <span className="material-symbols-outlined text-[18px]">groups</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-[#45464d] leading-none">Roster</span>
                <span className="text-[13px] font-bold text-[#0b1c30] truncate mt-0.5">
                  34 Active Staff
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#d3e4fe] flex items-center justify-center text-[#0b1c30]">
                <span className="material-symbols-outlined text-[18px]">event_repeat</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-[#45464d] leading-none">Payroll Cycle</span>
                <span className="text-[13px] font-bold text-[#0b1c30] truncate mt-0.5">
                  28th Monthly
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Card Form: Add Teacher for Salary Advance */}
      <div className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#eff4ff] space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[20px] font-bold text-[#0b1c30]">Add Teacher</h3>
            <p className="text-[13px] text-[#45464d]">
              Enable instant earned-wage security for faculty
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#6cf8bb] text-[#00714d] flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[20px]">person_add</span>
          </div>
        </div>

        <form onSubmit={handleSendInvite} className="space-y-4">
          {/* 1. Teacher's Full Name */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[13px] font-semibold text-[#0b1c30] flex items-center justify-between"
              htmlFor="teacher-name"
            >
              <span>Teacher's Full Name</span>
              <span className="text-[11px] font-semibold text-[#006c49] flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">badge</span>
                Required
              </span>
            </label>
            <div className="relative">
              <input
                id="teacher-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sarah Jenkins, M.Ed"
                className="w-full h-14 bg-[#eff4ff] text-[#0b1c30] rounded-xl px-4 pl-11 text-[15px] placeholder:text-[#76777d] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#006c49] transition-all"
                required
              />
              <span className="material-symbols-outlined absolute left-3.5 top-4 text-[#45464d] text-[20px]">
                person
              </span>
            </div>
          </div>

          {/* 2. Phone Number */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[13px] font-semibold text-[#0b1c30] flex items-center justify-between"
              htmlFor="teacher-phone"
            >
              <span>Mobile Phone (SMS Invite)</span>
              <span className="text-[11px] text-[#45464d]">SMS notifications</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 flex items-center gap-1 text-[#45464d] text-[13px]">
                <span className="material-symbols-outlined text-[18px]">smartphone</span>
                <span className="font-semibold text-[#0b1c30]">NG</span>
              </span>
              <input
                id="teacher-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-14 bg-[#eff4ff] text-[#0b1c30] rounded-xl pl-20 pr-4 text-[15px] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#006c49] transition-all"
                required
              />
            </div>
          </div>

          {/* 3. Work Email */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[13px] font-semibold text-[#0b1c30] flex items-center justify-between"
              htmlFor="teacher-email"
            >
              <span>Institutional Work Email</span>
              <span className="text-[11px] font-semibold text-[#00714d] bg-[#6cf8bb]/40 px-2.5 py-0.5 rounded-full">
                School Domain Match
              </span>
            </label>
            <div className="relative">
              <input
                id="teacher-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 bg-[#eff4ff] text-[#0b1c30] rounded-xl px-4 pl-11 text-[15px] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#006c49] transition-all"
                required
              />
              <span className="material-symbols-outlined absolute left-3.5 top-4 text-[#45464d] text-[20px]">
                mail
              </span>
            </div>
          </div>

          {/* 4. Monthly Net Salary */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[13px] font-semibold text-[#0b1c30] flex items-center justify-between"
              htmlFor="monthly-salary"
            >
              <span>Monthly Net Salary</span>
              <span className="text-[11px] text-[#45464d]">Post-tax baseline</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-[20px] font-bold text-[#0b1c30]">₦</span>
              <input
                id="monthly-salary"
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full h-14 bg-[#eff4ff] text-[#0b1c30] rounded-xl pl-9 pr-14 text-[20px] font-bold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#006c49] transition-all tabular-nums"
                required
              />
              <span className="absolute right-3.5 top-4.5 text-[11px] font-bold text-[#76777d] uppercase tracking-wider">
                NGN
              </span>
            </div>
            <div className="flex items-center justify-between px-1 mt-0.5">
              <div className="flex items-center gap-1.5 text-[#45464d] text-[11px]">
                <span className="material-symbols-outlined text-[15px] text-[#006c49]">info</span>
                <span>Max 50% eligible for advance</span>
              </div>
              <span className="text-[11px] text-[#006c49] font-bold bg-[#e5eeff] px-2 py-0.5 rounded-md">
                Up to ₦{advanceCap.toLocaleString('en-NG')}/mo
              </span>
            </div>
          </div>

          {/* 5. Employment Start Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#0b1c30]" htmlFor="start-date">
              Employment Start Date
            </label>
            <div className="relative">
              <input
                id="start-date"
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-14 bg-[#eff4ff] text-[#0b1c30] rounded-xl px-4 pl-11 text-[15px] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#006c49] transition-all"
              />
              <span className="material-symbols-outlined absolute left-3.5 top-4 text-[#45464d] text-[20px]">
                calendar_today
              </span>
              <span className="material-symbols-outlined absolute right-3.5 top-4 text-[#76777d] text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* 6. Bank Account Details */}
          <div className="pt-1">
            <div className="bg-[#eff4ff] p-3 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#0b1c30]">
                    account_balance
                  </span>
                  <span className="text-[13px] font-semibold text-[#0b1c30]">
                    Disbursement Account
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#006c49] bg-white px-2 py-0.5 rounded-md shadow-xs">
                  Direct Deposit
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div className="bg-white p-2.5 rounded-xl flex items-center justify-between">
                  <span className="text-[11px] text-[#45464d]">Bank Name</span>
                  <span className="text-[13px] text-[#0b1c30] font-semibold">{bankName}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white p-2.5 rounded-xl flex flex-col">
                    <span className="text-[11px] text-[#45464d]">Routing Number</span>
                    <span className="text-[14px] text-[#0b1c30] tracking-wider font-semibold">
                      {routingNumber}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl flex flex-col">
                    <span className="text-[11px] text-[#45464d]">Account Number</span>
                    <span className="text-[14px] text-[#0b1c30] tracking-wider font-semibold">
                      {accountNumber}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 7. Advance Policy Toggle Card */}
          <div className="bg-[#eff4ff] rounded-2xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#d3e4fe] text-[#006c49] flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[20px]">toggle_on</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-semibold text-[#0b1c30]">
                  Allow On-Demand Advances
                </span>
                <span className="text-[12px] text-[#45464d] truncate">
                  Up to 50% accrued salary before payday
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={allowAdvances}
                onChange={(e) => setAllowAdvances(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-[#d3e4fe] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[3px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#006c49]"></div>
            </label>
          </div>

          {/* 8. Primary CTA Button */}
          <div className="pt-1">
            <button
              id="send-invite-btn"
              type="submit"
              disabled={isSending}
              className="w-full bg-[#006c49] hover:bg-[#005236] text-white p-4 rounded-2xl flex flex-col items-center justify-center gap-0.5 shadow-md active:scale-[0.99] transition-all cursor-pointer disabled:opacity-85"
            >
              {isSending ? (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-[20px]">
                    progress_activity
                  </span>
                  <span className="text-[15px] font-bold">Sending Secure Invitation...</span>
                </div>
              ) : sendSuccess ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    <span className="text-[15px] font-bold">
                      Invitation Sent to {fullName.split(' ')[0]}!
                    </span>
                  </div>
                  <span className="text-[11px] opacity-90 font-normal">
                    SMS and email delivered
                  </span>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold tracking-wide">
                      Send Lopay Invitation
                    </span>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </div>
                  <span className="text-[11px] opacity-90 font-normal">
                    Teacher will receive an SMS and email invite
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 5. Recent Invitations List Snippet */}
      <div className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#eff4ff] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-[18px] font-bold text-[#0b1c30]">Recent Invitations</h4>
            <span className="bg-[#dce9ff] text-[#45464d] text-[11px] font-semibold px-2 py-0.5 rounded-full">
              {teachers.filter((t) => t.status === 'pending').length} Pending / {teachers.filter((t) => t.status === 'active').length} Active
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('onboarding-invite')}
            className="text-[12px] font-semibold text-[#006c49] hover:underline cursor-pointer"
          >
            Preview Onboarding
          </button>
        </div>

        <div className="space-y-2">
          {teachers.map((teacher) => {
            const isPending = teacher.status === 'pending';
            return (
              <div
                key={teacher.id}
                className="p-3 rounded-xl bg-[#eff4ff] flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      alt={teacher.name}
                      src={teacher.avatarUrl}
                      className="w-10 h-10 rounded-full object-cover bg-[#e5eeff] ring-2 ring-white"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                        isPending ? 'bg-[#008cc7]' : 'bg-[#006c49]'
                      }`}
                    ></span>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-bold text-[#0b1c30] truncate">
                      {teacher.name}
                    </span>
                    <span className="text-[11px] text-[#45464d] truncate">
                      {teacher.invitedAt || teacher.onboardedAt || 'Registered'} • {teacher.department}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isPending ? (
                    <>
                      <span className="px-2.5 py-1 rounded-full bg-[#e5eeff] text-[#008cc7] text-[11px] font-semibold">
                        Pending Invite
                      </span>
                      <button
                        type="button"
                        aria-label="Resend Invite"
                        onClick={() => handleResend(teacher.id)}
                        disabled={resendingId === teacher.id}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-[#45464d] hover:text-[#0b1c30] shadow-xs active:scale-95 cursor-pointer"
                      >
                        <span
                          className={`material-symbols-outlined text-[16px] ${
                            resendingId === teacher.id ? 'animate-spin text-[#006c49]' : ''
                          }`}
                        >
                          sync
                        </span>
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="px-2.5 py-1 rounded-full bg-[#6cf8bb]/40 text-[#00714d] text-[11px] font-semibold">
                        Active
                      </span>
                      <span className="material-symbols-outlined text-[18px] text-[#006c49] fill">
                        check_circle
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
