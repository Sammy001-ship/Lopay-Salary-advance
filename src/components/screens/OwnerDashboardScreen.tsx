import React from 'react';
import { IMAGES, INITIAL_COLLEAGUES } from '../../data/mockData';
import { AdvanceTransaction, AppScreen, Teacher } from '../../types';
import { AdvanceRequestsMonitor } from '../owner/AdvanceRequestsMonitor';

interface OwnerDashboardScreenProps {
  teachers: Teacher[];
  transactions: AdvanceTransaction[];
  onNavigate: (screen: AppScreen) => void;
  onApproveTeacher: (teacherId: string) => void;
}

export const OwnerDashboardScreen: React.FC<OwnerDashboardScreenProps> = ({
  teachers,
  transactions,
  onNavigate,
  onApproveTeacher,
}) => {
  const activeTeachers = teachers.filter((teacher) => teacher.status === 'active');
  const pendingTeachers = teachers.filter((teacher) => teacher.status === 'pending');

  const totalPayroll = activeTeachers.reduce((sum, teacher) => sum + teacher.salary, 0);
  const totalApprovedAdvances = transactions
    .filter((transaction) => transaction.status !== 'repaid')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalPayoutsThisCycle = transactions.reduce((sum, transaction) => sum + transaction.netReceived, 0);
  const pendingApprovals = pendingTeachers.length;

  const requestedTeacher = pendingTeachers[0] ?? INITIAL_COLLEAGUES[0];

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto pb-8 space-y-4">
      <section className="rounded-2xl bg-[#131b2e] text-white p-4 shadow-xl overflow-hidden">
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#7c839b] font-semibold">
              School owner overview
            </p>
            <h2 className="mt-2 text-[24px] font-bold tracking-tight">Oakridge Group</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('teachers')}
            className="bg-[#006c49] hover:bg-[#005236] px-3 py-2 rounded-xl text-[12px] font-semibold text-white"
          >
            Manage roster
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 relative z-10">
          <div className="rounded-xl bg-[#d3e4fe]/10 p-3">
            <p className="text-[11px] text-[#7c839b]">Active payroll</p>
            <p className="mt-1 text-[22px] font-bold tabular-nums">
              ₦{totalPayroll.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="rounded-xl bg-[#006c49]/25 border border-[#6cf8bb]/30 p-3">
            <p className="text-[11px] text-[#6ffbbe]">Advances issued</p>
            <p className="mt-1 text-[22px] font-bold tabular-nums text-[#6ffbbe]">
              ₦{totalApprovedAdvances.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white border border-[#eff4ff] p-3">
          <p className="text-[11px] text-[#45464d]">Active teachers</p>
          <p className="mt-1 text-[24px] font-bold text-[#0b1c30]">{activeTeachers.length}</p>
        </div>

        <div className="rounded-2xl bg-white border border-[#eff4ff] p-3">
          <p className="text-[11px] text-[#45464d]">Pending approvals</p>
          <p className="mt-1 text-[24px] font-bold text-[#0b1c30]">{pendingApprovals}</p>
        </div>
      </section>

      <section className="rounded-2xl bg-white border border-[#eff4ff] p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-[#0b1c30]">School funding health</h3>
          <span className="rounded-full bg-[#6cf8bb]/30 px-2 py-1 text-[10px] font-semibold text-[#00714d]">
            Stable
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {[
            { label: 'Science', value: 86 },
            { label: 'Math', value: 72 },
            { label: 'Arts', value: 63 },
            { label: 'Admin', value: 58 },
          ].map((group) => (
            <div key={group.label}>
              <div className="flex items-center justify-between text-[12px] text-[#45464d] mb-1">
                <span>{group.label}</span>
                <span>{group.value}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-[#eff4ff] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#006c49] to-[#6ffbbe]"
                  style={{ width: `${group.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white border border-[#eff4ff] p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-[#0b1c30]">Pending teacher approvals</h3>
          <button
            type="button"
            onClick={() => onNavigate('teachers')}
            className="text-[11px] font-semibold text-[#006c49]"
          >
            View roster
          </button>
        </div>

        {pendingTeachers.length > 0 ? (
          <div className="mt-3 space-y-3">
            {pendingTeachers.map((teacher) => (
              <div key={teacher.id} className="flex items-center gap-3 rounded-xl bg-[#eff4ff] p-3">
                <img src={teacher.avatarUrl} alt={teacher.name} className="h-11 w-11 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[14px] font-bold text-[#0b1c30]">{teacher.name}</p>
                  <p className="text-[11px] text-[#45464d]">{teacher.title}</p>
                  <p className="text-[11px] text-[#45464d]">{teacher.department}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onApproveTeacher(teacher.id)}
                  className="rounded-xl bg-[#006c49] px-3 py-2 text-[11px] font-semibold text-white"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-xl bg-[#eff4ff] p-3 text-[13px] text-[#45464d]">
            All pending staff have been approved.
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-white border border-[#eff4ff] p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-[#0b1c30]">Recent payout activity</h3>
          <button
            type="button"
            onClick={() => onNavigate('advances')}
            className="text-[11px] font-semibold text-[#006c49]"
          >
            View ledger
          </button>
        </div>

        <div className="mt-3 space-y-2">
          {transactions.slice(0, 3).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between rounded-xl bg-[#f8f9ff] p-3">
              <div>
                <p className="text-[13px] font-semibold text-[#0b1c30]">{transaction.purpose ?? 'Salary advance'}</p>
                <p className="text-[11px] text-[#45464d]">{transaction.requestedAt}</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-bold text-[#0b1c30] tabular-nums">
                  ₦{transaction.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-[#006c49]">{transaction.status}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dedicated Advance User Monitor & Delivery Fees Section */}
      <section className="space-y-2 pt-2">
        <AdvanceRequestsMonitor
          teachers={teachers}
          transactions={transactions}
        />
      </section>

      <section className="rounded-2xl bg-[#eff4ff] p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#45464d]">Needs attention</p>
            <h3 className="mt-1 text-[18px] font-bold text-[#0b1c30]">
              {requestedTeacher.name}
            </h3>
            <p className="mt-1 text-[12px] text-[#45464d]">
              Ready for onboarding review and payroll setup.
            </p>
          </div>
          <img src={IMAGES.profileSarah} alt="Teacher need review" className="h-12 w-12 rounded-full object-cover" />
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-white p-3">
          <div>
            <p className="text-[11px] text-[#45464d]">Payout run</p>
            <p className="text-[18px] font-bold text-[#0b1c30] tabular-nums">
              ₦{totalPayoutsThisCycle.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('request-advance')}
            className="rounded-xl bg-[#006c49] px-3 py-2 text-[12px] font-semibold text-white"
          >
            Review payouts
          </button>
        </div>
      </section>
    </div>
  );
};
