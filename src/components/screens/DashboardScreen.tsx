import React, { useState } from 'react';
import { IMAGES } from '../../data/mockData';
import { ActivityRecord, AdvanceTransaction, TeacherScreen } from '../../types';

interface DashboardScreenProps {
  onNavigate: (screen: TeacherScreen) => void;
  activities: ActivityRecord[];
  activeAdvances: AdvanceTransaction[];
  availableAmount: number;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  activities,
  activeAdvances,
  availableAmount,
}) => {
  const [sliderAmount, setSliderAmount] = useState<number>(35000);
  const [isPressingCta, setIsPressingCta] = useState<boolean>(false);
  const [showStipendModal, setShowStipendModal] = useState<boolean>(false);

  const totalAdvancesTaken = activeAdvances
    .filter((a) => a.status !== 'repaid')
    .reduce((sum, a) => sum + a.amount, 0);

  const currentAvailable = Math.max(0, availableAmount - totalAdvancesTaken);

  const handleCtaClick = () => {
    setIsPressingCta(true);
    setTimeout(() => {
      setIsPressingCta(false);
      onNavigate('request-advance');
    }, 120);
  };

  return (
    <div className="flex flex-col w-full gap-4 max-w-lg mx-auto pb-6">
      {/* Teacher Personalized Greeting & Micro Status */}
      <section className="flex flex-col gap-1 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex flex-col min-w-0">
            <h1 className="text-[24px] font-semibold text-[#0b1c30] tracking-tight flex items-center gap-1.5">
              <span>Good morning, Sarah</span>
              <span className="inline-block animate-bounce text-[20px]">👋</span>
            </h1>
            <p className="text-[13px] text-[#45464d] flex items-center gap-1 truncate mt-0.5">
              <span className="material-symbols-outlined text-[16px] text-[#006c49]">school</span>
              <span>Oakridge International School • Grade 8 Science</span>
            </p>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#6cf8bb]/30 text-[#00714d] text-[11px] font-semibold shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] animate-pulse"></span>
              <span>Active Cycle</span>
            </span>
          </div>
        </div>
      </section>

      {/* Financial Status Card (Deep Navy Container with Emerald Accents) */}
      <section className="relative overflow-hidden rounded-2xl bg-[#131b2e] text-white shadow-xl p-4 sm:p-5 flex flex-col gap-4">
        {/* Decorative Ambient Glow */}
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#006c49]/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full bg-[#565e74]/20 blur-2xl pointer-events-none"></div>

        {/* Top Row: Net Base Salary & Next Payday */}
        <div className="flex items-start justify-between gap-2 relative z-10">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-[#7c839b] uppercase tracking-wider">
              Net base pay
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[24px] font-bold text-white tabular-nums tracking-tight">
                ₦420,000.00
              </span>
              <span className="text-[12px] text-[#7c839b]">/ mo</span>
            </div>
          </div>

          {/* Next Payday Pill Badge */}
          <div className="flex items-center gap-1.5 bg-[#d3e4fe]/15 backdrop-blur-md px-3 py-1.5 rounded-full text-white">
            <span className="material-symbols-outlined text-[16px] text-[#6ffbbe]">event</span>
            <div className="flex flex-col leading-tight">
              <span className="text-[12px] font-semibold text-white">March 28</span>
              <span className="text-[10px] text-[#6ffbbe] font-medium">11 days away</span>
            </div>
          </div>
        </div>

        {/* Core Highlights Grid: Earned So Far & Available to Access */}
        <div className="grid grid-cols-2 gap-3 relative z-10 pt-1">
          {/* Earned So Far */}
          <div className="flex flex-col p-3 rounded-xl bg-[#d3e4fe]/10 backdrop-blur-xs">
            <div className="flex items-center gap-1 text-[#7c839b] text-[11px] font-semibold mb-1">
              <span className="material-symbols-outlined text-[15px] text-[#6ffbbe]">trending_up</span>
              <span>Earned So Far</span>
            </div>
            <span className="text-[20px] font-bold text-white tabular-nums">₦238,000.00</span>
            <span className="text-[11px] text-[#7c839b] mt-0.5">Accrued Mar 1–17</span>
          </div>

          {/* Available to Access (Hero Focus) */}
          <div className="flex flex-col p-3 rounded-xl bg-[#006c49]/30 border border-[#6cf8bb]/30 shadow-inner backdrop-blur-xs">
            <div className="flex items-center justify-between text-[#6ffbbe] text-[11px] font-semibold mb-1">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#6ffbbe] fill">bolt</span>
                <span>Available Now</span>
              </span>
              <span className="text-[10px] bg-[#006c49] px-1.5 py-0.5 rounded text-white font-bold">
                50% Max
              </span>
            </div>
            <span className="text-[20px] font-bold text-[#6ffbbe] tabular-nums">
              ₦{currentAvailable.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-[#7c839b] mt-0.5">Ready for payout</span>
          </div>
        </div>

        {/* Pay Period Velocity Progress Bar */}
        <div className="flex flex-col gap-1.5 relative z-10">
          <div className="flex justify-between items-center text-[12px] text-[#7c839b]">
            <span>Cycle Progress: 17 of 31 days</span>
            <span className="text-[#6ffbbe] font-semibold">57% accrued</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#d3e4fe]/20 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#006c49] to-[#6ffbbe] rounded-full transition-all duration-700 ease-out"
              style={{ width: '57%' }}
            ></div>
          </div>
        </div>
      </section>

      {/* Primary High-Emphasis Action Section */}
      <section className="flex flex-col gap-2">
        <button
          id="withdraw-cta"
          type="button"
          onClick={handleCtaClick}
          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-[#006c49] text-white shadow-lg hover:bg-[#005236] transition-all cursor-pointer ${
            isPressingCta ? 'scale-[0.98]' : 'active:scale-[0.99]'
          }`}
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-[#6cf8bb] text-[#00714d] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold leading-tight">Access Earned Salary</span>
              <span className="text-[13px] opacity-90 leading-tight">Instant transfer to Zenith Bank •••• 8921</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </div>
        </button>
      </section>

      {/* Quick Metrics & Financial Health Pills */}
      <section className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white shadow-xs border border-[#eff4ff]">
          <div className="w-9 h-9 rounded-full bg-[#eff4ff] text-[#45464d] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-[#45464d] font-medium truncate">Advances Taken</span>
            <span className="text-[18px] font-semibold text-[#0b1c30] tabular-nums">
              ₦{totalAdvancesTaken.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white shadow-xs border border-[#eff4ff]">
          <div className="w-9 h-9 rounded-full bg-[#eff4ff] text-[#006c49] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">sell</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-[#45464d] font-medium truncate">Flat Fee</span>
            <span className="text-[18px] font-semibold text-[#0b1c30]">Just ₦500</span>
          </div>
        </div>
      </section>

      {/* Interactive Salary Slider & Calculator Preview Card */}
      <section className="flex flex-col gap-3 p-4 rounded-2xl bg-white shadow-xs border border-[#eff4ff]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c49] text-[22px]">tune</span>
            <span className="text-[15px] text-[#0b1c30] font-bold">Quick Calculator</span>
          </div>
          <span className="text-[11px] text-[#006c49] font-semibold bg-[#6cf8bb]/30 px-2 py-0.5 rounded-full">
            0% Interest
          </span>
        </div>

        <div className="flex flex-col gap-2 mt-0.5">
          <div className="flex justify-between items-baseline">
            <span className="text-[13px] text-[#45464d]">Select amount to preview:</span>
            <span className="text-[20px] text-[#006c49] font-bold tabular-nums">
              ₦{sliderAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <input
            id="advance-slider"
            type="range"
            min={5000}
            max={currentAvailable || 119000}
            step={1000}
            value={sliderAmount}
            onChange={(e) => setSliderAmount(Number(e.target.value))}
            className="w-full h-2 rounded-lg bg-[#dce9ff] appearance-none cursor-pointer accent-[#006c49] focus:outline-hidden"
          />

          <div className="flex justify-between items-center text-[11px] text-[#45464d] font-medium mt-0.5">
            <span>Min ₦5,000</span>
            <span className="text-[#45464d]">Deducted on March 28 pay stub</span>
            <span>Max ₦{currentAvailable.toLocaleString('en-NG')}</span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('request-advance')}
            className="mt-2 w-full py-2 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006c49] text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <span>Proceed with ₦{sliderAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </section>

      {/* Classroom Wellness & Community Spotlight */}
      <section
        onClick={() => setShowStipendModal(true)}
        className="rounded-2xl bg-[#eff4ff] p-4 flex flex-col gap-2.5 cursor-pointer hover:bg-[#e5eeff] transition-all"
      >
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-[#45464d] uppercase tracking-wider">
            Teacher Wellness
          </span>
          <span className="text-[11px] text-[#006c49] font-semibold bg-white/70 px-2 py-0.5 rounded-full">
            Financial Perk
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white">
            <img
              alt="STEM Classroom laboratory with modern educational materials"
              src={IMAGES.stemClassroom}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="text-[14px] text-[#0b1c30] font-semibold truncate">
              STEM Classroom Stipend Match
            </h4>
            <p className="text-[12px] text-[#45464d] line-clamp-1">
              Lopay matches up to ₦50,000 in science lab materials this term.
            </p>
          </div>
          <span className="material-symbols-outlined text-[18px] text-[#006c49] shrink-0">
            arrow_forward
          </span>
        </div>
      </section>

      {/* Recent Activity / Past Pay Periods */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[15px] text-[#0b1c30] font-bold">Recent Activity</h3>
          <button
            type="button"
            onClick={() => onNavigate('advances')}
            className="text-[12px] text-[#006c49] font-semibold hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {activities.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-white shadow-xs border border-[#eff4ff]"
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
                    {item.isPositive ? 'account_balance' : 'price_check'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] text-[#0b1c30] font-bold truncate">
                    {item.title}
                  </span>
                  <span className="text-[12px] text-[#45464d] truncate">{item.date}</span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 pl-2">
                <span
                  className={`text-[15px] font-bold tabular-nums ${
                    item.isPositive ? 'text-[#006c49]' : 'text-[#0b1c30]'
                  }`}
                >
                  {item.isPositive ? '+' : ''}₦{item.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </span>
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold mt-0.5 ${
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
      </section>

      {/* Reassurance Microfooter */}
      <div className="flex items-center justify-center gap-1.5 py-2 text-[#45464d] text-[12px] opacity-80">
        <span className="material-symbols-outlined text-[14px] text-[#006c49]">verified_user</span>
        <span>Zero credit impact • Fully automated payroll settlement</span>
      </div>

      {/* Modal for STEM Perk Details */}
      {showStipendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#006c49]">science</span>
                <h3 className="text-sm font-bold text-[#0b1c30]">STEM Lab Stipend Match</h3>
              </div>
              <button
                onClick={() => setShowStipendModal(false)}
                className="text-xs text-[#76777d] hover:text-[#0b1c30]"
              >
                Close
              </button>
            </div>
            <img
              alt="Classroom Lab"
              src={IMAGES.stemClassroom}
              className="w-full h-36 rounded-xl object-cover"
            />
            <p className="text-xs text-[#45464d] leading-relaxed">
              Oakridge International School and Lopay partner to support STEM teachers. Submit receipts
              for lab glassware, biology models, or chemistry experiment kits and receive an instant 100%
              reimbursement match up to <strong>₦50,000.00</strong> per term.
            </p>
            <div className="p-3 bg-[#eff4ff] rounded-xl text-xs space-y-1">
              <div className="flex justify-between font-semibold text-[#0b1c30]">
                <span>Allocated Limit:</span>
                <span>₦50,000.00</span>
              </div>
              <div className="flex justify-between text-[#006c49]">
                <span>Available to claim:</span>
                <span className="font-bold">₦50,000.00</span>
              </div>
            </div>
            <button
              onClick={() => {
                alert('Stipend claim form submitted to Oakridge Administration!');
                setShowStipendModal(false);
              }}
              className="w-full py-2.5 bg-[#006c49] text-white text-xs font-semibold rounded-xl hover:bg-[#005236]"
            >
              Upload Material Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
