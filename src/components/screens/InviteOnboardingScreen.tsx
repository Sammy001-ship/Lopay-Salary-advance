import React, { useState } from 'react';
import { AppScreen } from '../../types';

interface InviteOnboardingScreenProps {
  onVerifyAndEnter: () => void;
  onNavigate: (screen: AppScreen) => void;
}

export const InviteOnboardingScreen: React.FC<InviteOnboardingScreenProps> = ({
  onVerifyAndEnter,
  onNavigate,
}) => {
  const [pin, setPin] = useState<string[]>(['4', '7', '2', '']);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [authMethod, setAuthMethod] = useState<'pin' | 'biometrics'>('pin');

  const handlePinChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newPin = [...pin];
    newPin[index] = val.slice(-1);
    setPin(newPin);

    // Auto-advance
    if (val && index < 3) {
      const nextInput = document.getElementById(`pin-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert('Please acknowledge the Terms of Service and Fair Wage Access Agreement.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerifyAndEnter();
    }, 1100);
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto pb-10 space-y-4">
      {/* Top verified invite banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#eff4ff] shadow-xs p-5 border border-[#d3e4fe]/50">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#6ffbbe]/20 pointer-events-none blur-xl"></div>

        <div className="flex items-start gap-3.5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-[#6cf8bb] text-[#00714d] flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[28px] fill">school</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#dce9ff] text-[#0b1c30] text-[11px] font-semibold mb-1.5">
              <span className="material-symbols-outlined text-[13px] text-[#006c49]">verified</span>
              <span>Verified Employer Invite</span>
            </div>

            <h2 className="text-[20px] font-bold text-[#0b1c30] tracking-tight leading-snug">
              Oakridge School invited you to Lopay!
            </h2>
            <p className="text-[13px] text-[#45464d] mt-1 leading-relaxed">
              Access your earned pay whenever you need it, before payday. Zero predatory interest, transparent flat fee.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 flex items-center justify-between text-[11px] font-semibold text-[#00714d] bg-white/85 rounded-xl px-3 py-2 shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#006c49]">stars</span>
            <span>Sponsored Faculty Benefit</span>
          </div>
          <span className="text-[#006c49] font-bold">100% Free Setup</span>
        </div>
      </div>

      {/* School Records Card */}
      <div className="rounded-2xl bg-white shadow-xs p-4 sm:p-5 border border-[#eff4ff] space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#0b1c30]">
              <span className="material-symbols-outlined text-[18px]">badge</span>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#0b1c30] leading-tight">School Records</h3>
              <p className="text-[11px] text-[#45464d]">Pre-synced via Oakridge HR Portal</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#00714d] text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></span>
            Auto-Matched
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff]">
            <span className="text-[13px] text-[#45464d]">Full Name</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-[#0b1c30]">Sarah Jenkins</span>
              <span className="material-symbols-outlined text-[16px] text-[#006c49] fill">
                check_circle
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff]">
            <span className="text-[13px] text-[#45464d]">Institution</span>
            <span className="text-[13px] font-bold text-[#0b1c30] text-right truncate max-w-[200px]">
              Oakridge International School
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff]">
            <span className="text-[13px] text-[#45464d]">Position &amp; Role</span>
            <span className="text-[13px] font-bold text-[#0b1c30] text-right">
              Senior Science Teacher
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-[#eff4ff]">
              <span className="text-[11px] text-[#45464d] block">Base Salary</span>
              <span className="text-[20px] font-bold text-[#006c49] block mt-0.5">
                ₦420,000 <span className="text-[11px] text-[#45464d] font-normal">/ mo</span>
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#eff4ff]">
              <span className="text-[11px] text-[#45464d] block">Pay Cycle</span>
              <span className="text-[13px] font-bold text-[#0b1c30] block mt-1.5">
                28th of every month
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#45464d]">
                account_balance
              </span>
              <div>
                <span className="text-[11px] text-[#45464d] block">Direct Deposit Target</span>
                <span className="text-[13px] font-bold text-[#0b1c30]">
                  Zenith Bank Direct Deposit
                </span>
              </div>
            </div>
            <span className="text-[13px] font-semibold text-[#0b1c30] bg-[#d3e4fe] px-2 py-0.5 rounded-md">
              •••• 8921
            </span>
          </div>
        </div>
      </div>

      {/* Quick Security Setup */}
      <div className="rounded-2xl bg-white shadow-xs p-4 sm:p-5 border border-[#eff4ff] space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#0b1c30]">
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#0b1c30] leading-tight">
                Quick Security Setup
              </h3>
              <p className="text-[11px] text-[#45464d]">Fast, secure authorization</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAuthMethod(authMethod === 'pin' ? 'biometrics' : 'pin')}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#006c49] bg-[#6ffbbe]/40 px-2.5 py-0.5 rounded-full cursor-pointer hover:bg-[#6ffbbe]/60 transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">face</span>
            <span>Face ID Ready</span>
          </button>
        </div>

        <div className="bg-[#eff4ff] p-4 rounded-xl space-y-2">
          <label className="text-[11px] font-semibold text-[#45464d] block text-center uppercase tracking-wider">
            Set 4-Digit Access PIN
          </label>

          <div className="flex items-center justify-center gap-3 max-w-[240px] mx-auto py-1">
            {pin.map((digit, idx) => (
              <input
                key={idx}
                id={`pin-input-${idx}`}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                placeholder="•"
                onChange={(e) => handlePinChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-12 text-center text-[22px] font-bold bg-white text-[#0b1c30] rounded-xl shadow-xs outline-hidden focus:bg-[#dce9ff] focus:ring-2 focus:ring-[#006c49] transition-all cursor-text"
              />
            ))}
          </div>

          <p className="text-center text-[11px] text-[#45464d] mt-1 flex items-center justify-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[14px] text-[#006c49]">fingerprint</span>
            <span>Face ID / Biometrics will be prompted upon login</span>
          </p>
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer select-none p-2 rounded-xl hover:bg-[#eff4ff] transition-colors">
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="peer sr-only"
            />
            <div className="w-5 h-5 rounded-md bg-[#eff4ff] border border-[#d3e4fe] peer-checked:bg-[#006c49] peer-checked:border-[#006c49] flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-[16px] text-white">check</span>
            </div>
          </div>
          <span className="text-[12px] text-[#45464d] leading-snug">
            I acknowledge and agree to the{' '}
            <span className="text-[#0b1c30] font-semibold underline decoration-[#006c49]">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="text-[#0b1c30] font-semibold underline decoration-[#006c49]">
              Fair Wage Access Agreement
            </span>
            .
          </span>
        </label>
      </div>

      {/* Primary CTA */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          disabled={isVerifying}
          onClick={handleSubmit}
          className="w-full h-14 bg-[#006c49] hover:bg-[#005236] active:scale-[0.99] text-white rounded-2xl text-[15px] font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
        >
          {isVerifying ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[20px]">
                progress_activity
              </span>
              <span>Validating School HR Credentials...</span>
            </>
          ) : (
            <>
              <span>Verify &amp; Enter Dashboard</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#45464d] py-1">
          <span className="material-symbols-outlined text-[16px] text-[#006c49] fill">
            verified_user
          </span>
          <span>Bank-grade 256-bit encryption • FDIC insured partner</span>
        </div>
      </div>
    </div>
  );
};
