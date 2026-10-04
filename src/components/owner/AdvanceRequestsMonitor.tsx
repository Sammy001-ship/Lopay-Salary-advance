import React, { useState, useMemo } from 'react';
import { Teacher, AdvanceTransaction } from '../../types';

interface AdvanceRequestsMonitorProps {
  teachers: Teacher[];
  transactions: AdvanceTransaction[];
  onApproveTransaction?: (transactionId: string) => void;
  onExportSchedule?: () => void;
}

type FrequencyFilter = 'all' | '1x' | '2x-3x' | '4x-plus' | 'pending';

interface UserAdvanceSummary {
  teacher: Teacher;
  transactions: AdvanceTransaction[];
  requestCount: number;
  totalDeliveryFees: number;
  totalAmountRequested: number;
  totalNetReceived: number;
  lastRequestedAt: string;
  hasPending: boolean;
  salary: number;
  deductionPct: number;
}

export const AdvanceRequestsMonitor: React.FC<AdvanceRequestsMonitorProps> = ({
  teachers,
  transactions,
  onApproveTransaction,
  onExportSchedule,
}) => {
  const [activeFrequencyFilter, setActiveFrequencyFilter] = useState<FrequencyFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [expandedTeacherId, setExpandedTeacherId] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [localTransactions, setLocalTransactions] = useState<AdvanceTransaction[]>(transactions);

  // Synchronize when external transactions update
  React.useEffect(() => {
    setLocalTransactions(transactions);
  }, [transactions]);

  // Group transactions by teacher
  const userSummaries: UserAdvanceSummary[] = useMemo(() => {
    // Collect all teachers who have transactions or exist in teachers list
    const teacherMap = new Map<string, Teacher>();
    teachers.forEach((t) => teacherMap.set(t.id, t));

    // Group transactions by teacherId
    const txByTeacher = new Map<string, AdvanceTransaction[]>();

    localTransactions.forEach((tx) => {
      const key = tx.teacherId || 'unknown';
      if (!txByTeacher.has(key)) {
        txByTeacher.set(key, []);
      }
      txByTeacher.get(key)!.push(tx);
    });

    const summaries: UserAdvanceSummary[] = [];

    txByTeacher.forEach((txList, teacherId) => {
      let teacher = teacherMap.get(teacherId);

      // Fallback if teacher record not in teachers list but in transactions
      if (!teacher) {
        const firstTx = txList[0];
        teacher = {
          id: teacherId,
          name: firstTx.teacherName || 'Faculty Member',
          title: 'Educator',
          email: `${teacherId}@oakridge.edu`,
          phone: '+234 800 000 0000',
          salary: 400000.0,
          maxAdvancePct: 50,
          eligibleAdvance: 200000.0,
          department: firstTx.department || 'Academics',
          startDate: '2023-01-01',
          bankName: 'Commercial Bank',
          routingNumber: '•••• 1234',
          accountNumber: '•••••••• 5678',
          allowAdvances: true,
          status: 'active',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAwYQ4iAZS7vvey8uq7LB4XaBg7DMoqAccRVriOk0DdIatFb6S70iH4QqP_SxYHZruves5njBBd0xYs3pHzVXhLaMcZ9qTCgX10rdpH4I1zGkyUOId9UhYpO3luaJnTVomW86NU5VCZmjb4s3YGlmzCbMAsGFlbisI8CyvS_NBLBg4rxGyzcMnwIfbDatL6h88phUOnur7R338koM40IymAJPR_qHABuYDF3Bb-5bOzUw67MvIq_8yu',
        };
      }

      // Sort transactions by requestedAt descending
      const sortedTxs = [...txList].sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
      const requestCount = sortedTxs.length;
      // Flat delivery fee: ₦500 per request
      const totalDeliveryFees = sortedTxs.reduce((sum, tx) => sum + (tx.fee || 500.0), 0);
      const totalAmountRequested = sortedTxs.reduce((sum, tx) => sum + tx.amount, 0);
      const totalNetReceived = sortedTxs.reduce((sum, tx) => sum + tx.netReceived, 0);
      const hasPending = sortedTxs.some((tx) => tx.status === 'processing');
      const salary = teacher.salary || 400000.0;
      const deductionPct = Math.min(100, Math.round((totalAmountRequested / salary) * 100));

      summaries.push({
        teacher,
        transactions: sortedTxs,
        requestCount,
        totalDeliveryFees,
        totalAmountRequested,
        totalNetReceived,
        lastRequestedAt: sortedTxs[0]?.requestedAt || 'Recently',
        hasPending,
        salary,
        deductionPct,
      });
    });

    // Sort by request frequency descending
    return summaries.sort((a, b) => b.requestCount - a.requestCount);
  }, [teachers, localTransactions]);

  // Calculate school-wide metrics
  const totalRequesters = userSummaries.length;
  const totalRequestsCount = localTransactions.length;
  const totalDeliveryFeesCollected = localTransactions.reduce(
    (sum, tx) => sum + (tx.fee || 500.0),
    0
  );
  const totalDisbursedAmount = localTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  // Available departments for filtering
  const departments = useMemo(() => {
    const set = new Set<string>();
    userSummaries.forEach((u) => {
      if (u.teacher.department) set.add(u.teacher.department);
    });
    return Array.from(set);
  }, [userSummaries]);

  // Filtered summaries
  const filteredSummaries = useMemo(() => {
    return userSummaries.filter((item) => {
      // Frequency section filter
      if (activeFrequencyFilter === '1x' && item.requestCount !== 1) return false;
      if (activeFrequencyFilter === '2x-3x' && (item.requestCount < 2 || item.requestCount > 3))
        return false;
      if (activeFrequencyFilter === '4x-plus' && item.requestCount < 4) return false;
      if (activeFrequencyFilter === 'pending' && !item.hasPending) return false;

      // Department filter
      if (departmentFilter !== 'all' && item.teacher.department !== departmentFilter) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.teacher.name.toLowerCase().includes(query);
        const matchesDept = item.teacher.department.toLowerCase().includes(query);
        const matchesEmail = item.teacher.email.toLowerCase().includes(query);
        if (!matchesName && !matchesDept && !matchesEmail) return false;
      }

      return true;
    });
  }, [userSummaries, activeFrequencyFilter, departmentFilter, searchQuery]);

  // Counts for each filter badge
  const count1x = userSummaries.filter((u) => u.requestCount === 1).length;
  const count2to3x = userSummaries.filter((u) => u.requestCount >= 2 && u.requestCount <= 3).length;
  const count4xPlus = userSummaries.filter((u) => u.requestCount >= 4).length;
  const countPending = userSummaries.filter((u) => u.hasPending).length;

  const handleApprove = (txId: string) => {
    setLocalTransactions((prev) =>
      prev.map((tx) =>
        tx.id === txId
          ? {
              ...tx,
              status: 'completed',
            }
          : tx
      )
    );
    if (onApproveTransaction) {
      onApproveTransaction(txId);
    }
    setDownloadNotice('Advance payout approved & dispatches to teacher account.');
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  const handleExport = () => {
    if (onExportSchedule) {
      onExportSchedule();
    } else {
      setDownloadNotice('Lopay_Advance_Delivery_Fees_Audit_Schedule.csv generated successfully.');
      setTimeout(() => setDownloadNotice(null), 3500);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Download / Status Notice */}
      {downloadNotice && (
        <div className="p-3 bg-[#6cf8bb]/30 border border-[#006c49]/30 rounded-xl text-xs font-semibold text-[#00714d] flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Top Admin Summary Card */}
      <section className="relative overflow-hidden rounded-2xl bg-[#131b2e] text-white p-5 shadow-lg">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#006c49]/30 blur-2xl"></div>
        <div className="relative z-10 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#006c49] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px]">insights</span>
              </div>
              <div>
                <h2 className="text-[16px] font-bold tracking-tight">Advance Requests &amp; Delivery Fee Monitor</h2>
                <p className="text-[11px] text-[#7c839b]">Real-time tracking of faculty request volume &amp; flat fees</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="px-3 py-1.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-[#006c49]">download</span>
              <span>Export Audit CSV</span>
            </button>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="bg-[#213145]/70 border border-[#3f465c]/40 rounded-xl p-3">
              <span className="text-[10px] text-[#7c839b] uppercase font-semibold tracking-wider block">
                Total Requesters
              </span>
              <span className="text-[20px] font-bold text-white mt-0.5 block">
                {totalRequesters} <span className="text-xs font-normal text-[#d3e4fe]">teachers</span>
              </span>
            </div>

            <div className="bg-[#213145]/70 border border-[#3f465c]/40 rounded-xl p-3">
              <span className="text-[10px] text-[#7c839b] uppercase font-semibold tracking-wider block">
                Total Requests Made
              </span>
              <span className="text-[20px] font-bold text-white mt-0.5 block">
                {totalRequestsCount} <span className="text-xs font-normal text-[#d3e4fe]">advances</span>
              </span>
            </div>

            <div className="bg-[#006c49]/30 border border-[#6cf8bb]/40 rounded-xl p-3">
              <span className="text-[10px] text-[#6ffbbe] uppercase font-semibold tracking-wider block">
                Total Flat Delivery Fees
              </span>
              <span className="text-[20px] font-bold text-[#6ffbbe] mt-0.5 block tabular-nums">
                ₦{totalDeliveryFeesCollected.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[9px] text-[#d3e4fe]/80 block mt-0.5">
                ₦500 flat fee per request
              </span>
            </div>

            <div className="bg-[#213145]/70 border border-[#3f465c]/40 rounded-xl p-3">
              <span className="text-[10px] text-[#7c839b] uppercase font-semibold tracking-wider block">
                Total Capital Disbursed
              </span>
              <span className="text-[20px] font-bold text-white mt-0.5 block tabular-nums">
                ₦{totalDisbursedAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* User Sectioning Filter Navigation */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eff4ff] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#006c49]">filter_list</span>
            <span className="text-xs font-bold text-[#0b1c30]">Section Requesters By Frequency:</span>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 sm:max-w-xs">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[#76777d] text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search faculty name, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 bg-[#eff4ff] text-xs text-[#0b1c30] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#006c49] outline-hidden placeholder:text-[#76777d]"
            />
          </div>
        </div>

        {/* Section Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveFrequencyFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFrequencyFilter === 'all'
                ? 'bg-[#006c49] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#45464d] hover:bg-[#dce9ff]'
            }`}
          >
            <span>All Requesters</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeFrequencyFilter === 'all' ? 'bg-white/20 text-white' : 'bg-white text-[#0b1c30]'
              }`}
            >
              {userSummaries.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFrequencyFilter('1x')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFrequencyFilter === '1x'
                ? 'bg-[#006c49] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#45464d] hover:bg-[#dce9ff]'
            }`}
          >
            <span>1x Single Request (₦500 Fee)</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeFrequencyFilter === '1x' ? 'bg-white/20 text-white' : 'bg-white text-[#0b1c30]'
              }`}
            >
              {count1x}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFrequencyFilter('2x-3x')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFrequencyFilter === '2x-3x'
                ? 'bg-[#006c49] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#45464d] hover:bg-[#dce9ff]'
            }`}
          >
            <span>2x–3x Frequent (₦1,000–₦1,500 Fee)</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeFrequencyFilter === '2x-3x' ? 'bg-white/20 text-white' : 'bg-white text-[#0b1c30]'
              }`}
            >
              {count2to3x}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFrequencyFilter('4x-plus')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFrequencyFilter === '4x-plus'
                ? 'bg-[#006c49] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#45464d] hover:bg-[#dce9ff]'
            }`}
          >
            <span>4x+ High Frequency (₦2,000+ Fee)</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeFrequencyFilter === '4x-plus' ? 'bg-white/20 text-white' : 'bg-white text-[#0b1c30]'
              }`}
            >
              {count4xPlus}
            </span>
          </button>

          {countPending > 0 && (
            <button
              type="button"
              onClick={() => setActiveFrequencyFilter('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFrequencyFilter === 'pending'
                  ? 'bg-[#ba1a1a] text-white shadow-xs'
                  : 'bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffdad6]/80'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-ping"></span>
              <span>Pending Review</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeFrequencyFilter === 'pending' ? 'bg-white/20 text-white' : 'bg-white text-[#ba1a1a]'
                }`}
              >
                {countPending}
              </span>
            </button>
          )}
        </div>

        {/* Department filter row */}
        {departments.length > 1 && (
          <div className="flex items-center gap-2 pt-1 border-t border-[#eff4ff] text-xs">
            <span className="text-[#76777d] font-medium">Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-[#eff4ff] text-[#0b1c30] font-semibold text-xs py-1 px-2 rounded-lg border-none focus:ring-1 focus:ring-[#006c49]"
            >
              <option value="all">All Departments ({departments.length})</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Sectioned User Cards List */}
      <div className="space-y-3">
        {filteredSummaries.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#eff4ff] space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#eff4ff] text-[#76777d] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">search_off</span>
            </div>
            <p className="text-sm font-bold text-[#0b1c30]">No matching advance requests found</p>
            <p className="text-xs text-[#45464d]">Try adjusting your frequency filter or search terms.</p>
          </div>
        ) : (
          filteredSummaries.map((summary) => {
            const isExpanded = expandedTeacherId === summary.teacher.id;

            // Frequency styling
            const getFrequencyBadge = (count: number) => {
              if (count >= 4) {
                return {
                  label: `${count} Requests This Month`,
                  bgColor: 'bg-amber-100 text-amber-800 border-amber-300',
                  icon: 'warning',
                  tier: 'High Frequency',
                };
              }
              if (count >= 2) {
                return {
                  label: `${count} Requests This Month`,
                  bgColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                  icon: 'sync',
                  tier: 'Frequent',
                };
              }
              return {
                label: `1 Request This Month`,
                bgColor: 'bg-blue-100 text-blue-800 border-blue-200',
                icon: 'check',
                tier: 'Single Request',
              };
            };

            const freq = getFrequencyBadge(summary.requestCount);

            return (
              <div
                key={summary.teacher.id}
                className="bg-white rounded-2xl border border-[#eff4ff] shadow-xs overflow-hidden transition-all hover:border-[#006c49]/30"
              >
                {/* Main Card Header */}
                <div className="p-4 sm:p-5 flex flex-col space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    {/* Teacher profile info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={summary.teacher.avatarUrl}
                        alt={summary.teacher.name}
                        className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-[#eff4ff]"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#0b1c30] truncate">
                            {summary.teacher.name}
                          </h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${freq.bgColor} inline-flex items-center gap-1 shrink-0`}
                          >
                            <span className="material-symbols-outlined text-[12px]">{freq.icon}</span>
                            <span>{freq.label}</span>
                          </span>
                        </div>
                        <p className="text-xs text-[#45464d] truncate mt-0.5">
                          {summary.teacher.title} • {summary.teacher.department}
                        </p>
                        <p className="text-[11px] text-[#76777d] mt-0.5">
                          Last request: <span className="font-semibold text-[#0b1c30]">{summary.lastRequestedAt}</span>
                        </p>
                      </div>
                    </div>

                    {/* Pending approval badge if applicable */}
                    {summary.hasPending && (
                      <span className="px-2.5 py-1 bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-ping"></span>
                        Action Needed
                      </span>
                    )}
                  </div>

                  {/* Financial Breakdown Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 bg-[#eff4ff] rounded-xl text-xs">
                    {/* 1. Flat Delivery Fee Callout */}
                    <div className="bg-white p-2.5 rounded-lg border border-[#d3e4fe]/60">
                      <span className="text-[10px] text-[#76777d] font-semibold uppercase block">
                        Accrued Delivery Fee
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-sm font-extrabold text-[#006c49] tabular-nums">
                          ₦{summary.totalDeliveryFees.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#00714d] font-semibold block mt-0.5">
                        ₦500 flat fee × {summary.requestCount} {summary.requestCount === 1 ? 'request' : 'requests'}
                      </span>
                    </div>

                    {/* 2. Total Capital Advanced */}
                    <div className="bg-white p-2.5 rounded-lg border border-[#d3e4fe]/60">
                      <span className="text-[10px] text-[#76777d] font-semibold uppercase block">
                        Total Capital Advanced
                      </span>
                      <span className="text-sm font-extrabold text-[#0b1c30] tabular-nums mt-0.5 block">
                        ₦{summary.totalAmountRequested.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[10px] text-[#45464d] block mt-0.5">
                        Net: ₦{summary.totalNetReceived.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* 3. Payroll Deduction Impact */}
                    <div className="col-span-2 sm:col-span-1 bg-white p-2.5 rounded-lg border border-[#d3e4fe]/60 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-semibold">
                          <span className="text-[#76777d] uppercase">Payroll Impact</span>
                          <span className="text-[#0b1c30]">{summary.deductionPct}% of salary</span>
                        </div>
                        {/* Progress meter */}
                        <div className="h-1.5 w-full bg-[#eff4ff] rounded-full overflow-hidden mt-1.5">
                          <div
                            className={`h-full rounded-full ${
                              summary.deductionPct > 40 ? 'bg-amber-500' : 'bg-[#006c49]'
                            }`}
                            style={{ width: `${Math.min(100, summary.deductionPct)}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#76777d] mt-1 block">
                        Monthly: ₦{summary.salary.toLocaleString('en-NG')}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Detailed Breakdown Button */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#eff4ff]">
                    <span className="text-[11px] text-[#76777d]">
                      Showing {summary.transactions.length} recorded {summary.transactions.length === 1 ? 'advance' : 'advances'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpandedTeacherId(isExpanded ? null : summary.teacher.id)}
                      className="text-xs font-bold text-[#006c49] hover:text-[#005236] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Request Log' : 'View All Requests & Fee Log'}</span>
                      <span className={`material-symbols-outlined text-[16px] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>
                  </div>
                </div>

                {/* Expanded Detailed Requests & Fee Log */}
                {isExpanded && (
                  <div className="bg-[#f8f9ff] border-t border-[#eff4ff] p-4 space-y-3 animate-in fade-in duration-150">
                    <h4 className="text-xs font-bold text-[#0b1c30] flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#006c49]">receipt_long</span>
                        <span>Individual Request History &amp; Flat Delivery Fees</span>
                      </span>
                      <span className="text-[11px] text-[#45464d] font-normal">
                        Flat Fee: <strong>₦500.00 / request</strong>
                      </span>
                    </h4>

                    <div className="space-y-2">
                      {summary.transactions.map((tx, index) => {
                        const reverseIndex = summary.transactions.length - index;
                        const isProcessing = tx.status === 'processing';

                        return (
                          <div
                            key={tx.id}
                            className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                              isProcessing
                                ? 'bg-[#ffdad6]/30 border-[#ffdad6]'
                                : 'bg-white border-[#eff4ff]'
                            }`}
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-[#006c49] bg-[#eff4ff] px-2 py-0.5 rounded-md text-[10px]">
                                  Request #{reverseIndex}
                                </span>
                                <span className="font-bold text-[#0b1c30] truncate">
                                  {tx.purpose || 'Salary Advance'}
                                </span>
                                <span className="text-[10px] text-[#76777d] font-mono">
                                  {tx.referenceNumber}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#45464d] flex items-center gap-2">
                                <span className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[13px] text-[#76777d]">schedule</span>
                                  <span>{tx.requestedAt}</span>
                                </span>
                                <span>•</span>
                                <span>Bank: {tx.bankAccount}</span>
                              </p>
                            </div>

                            {/* Financial itemization for this request */}
                            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#eff4ff]">
                              <div className="text-right">
                                <span className="text-[10px] text-[#76777d] block">
                                  Advance Capital
                                </span>
                                <span className="text-xs font-bold text-[#0b1c30] tabular-nums">
                                  ₦{tx.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                                </span>
                              </div>

                              <div className="text-right bg-[#eff4ff] px-2.5 py-1 rounded-lg">
                                <span className="text-[9px] text-[#00714d] uppercase font-bold block">
                                  Flat Fee
                                </span>
                                <span className="text-xs font-bold text-[#006c49] tabular-nums">
                                  ₦{(tx.fee || 500).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                                </span>
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] text-[#76777d] block">
                                  Status
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                                    isProcessing
                                      ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                      : 'bg-[#6cf8bb]/40 text-[#00714d]'
                                  }`}
                                >
                                  {tx.status}
                                </span>
                              </div>

                              {isProcessing && (
                                <button
                                  type="button"
                                  onClick={() => handleApprove(tx.id)}
                                  className="px-3 py-1.5 bg-[#006c49] hover:bg-[#005236] text-white text-[11px] font-bold rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                                >
                                  Approve
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
