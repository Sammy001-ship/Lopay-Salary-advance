import React, { useState } from 'react';
import { IMAGES, DEFAULT_SCHOOL_OWNER } from '../../data/mockData';
import { SchoolOwner, AuthMode } from '../../types';

interface OwnerAuthScreenProps {
  onLoginSuccess: (owner: SchoolOwner) => void;
  onBackToGateway?: () => void;
}

export const OwnerAuthScreen: React.FC<OwnerAuthScreenProps> = ({
  onLoginSuccess,
  onBackToGateway,
}) => {
  const [mode, setMode] = useState<AuthMode>('login');

  // Login form state - completely empty
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  // Sign up form state - completely empty
  const [schoolName, setSchoolName] = useState<string>('');
  const [proprietorName, setProprietorName] = useState<string>('');
  const [signupEmail, setSignupEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [rcNumber, setRcNumber] = useState<string>('');
  const [payrollDay, setPayrollDay] = useState<number>(28);
  const [monthlyBudget, setMonthlyBudget] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState<string>('');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        ...DEFAULT_SCHOOL_OWNER,
        email: loginEmail || DEFAULT_SCHOOL_OWNER.email,
      });
    }, 700);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert('Please agree to the Lopay School Employer Terms.');
      return;
    }

    setIsLoading(true);

    const newOwner: SchoolOwner = {
      id: `owner-${Date.now()}`,
      name: proprietorName || 'School Proprietor',
      roleTitle: 'Proprietor & Governing Director',
      email: signupEmail,
      phone,
      schoolName,
      rcNumber,
      payrollCycleDay: payrollDay,
      totalFaculty: 1,
      monthlyPayrollBudget: parseFloat(monthlyBudget.replace(/,/g, '')) || 5000000,
      verified: true,
      avatarUrl: DEFAULT_SCHOOL_OWNER.avatarUrl,
    };

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(newOwner);
    }, 850);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col space-y-5 animate-in fade-in duration-200">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center space-y-2">
        <img alt="Lopay Logo" src={IMAGES.logo} className="h-9 w-auto object-contain" />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#131b2e] text-[#6ffbbe] text-xs font-semibold">
          <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
          <span>School Owner &amp; Employer Portal</span>
        </div>
        <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">
          {mode === 'login' ? 'Sign In' : 'Register School'}
        </h1>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 p-1 bg-[#e5eeff] rounded-xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`py-2 rounded-lg transition-all cursor-pointer ${
            mode === 'login' ? 'bg-white text-[#0b1c30] shadow-xs' : 'text-[#45464d] hover:text-[#0b1c30]'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`py-2 rounded-lg transition-all cursor-pointer ${
            mode === 'signup' ? 'bg-white text-[#0b1c30] shadow-xs' : 'text-[#45464d] hover:text-[#0b1c30]'
          }`}
        >
          Register School
        </button>
      </div>

      {/* Login Card */}
      {mode === 'login' ? (
        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-5 shadow-xs border border-[#eff4ff] space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0b1c30]">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder=""
                className="w-full h-12 bg-[#eff4ff] rounded-xl px-4 pl-10 text-xs text-[#0b1c30] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#006c49]"
              />
              <span className="material-symbols-outlined absolute left-3 top-3.5 text-[18px] text-[#45464d]">
                mail
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#0b1c30]">Password</label>
              <button type="button" className="text-[11px] text-[#006c49] font-semibold hover:underline">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder=""
                className="w-full h-12 bg-[#eff4ff] rounded-xl px-4 pl-10 text-xs text-[#0b1c30] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#006c49]"
              />
              <span className="material-symbols-outlined absolute left-3 top-3.5 text-[18px] text-[#45464d]">
                lock
              </span>
            </div>
          </div>

          <div className="flex items-center text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded accent-[#006c49]" />
              <span className="text-[#45464d]">Remember session</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#006c49] hover:bg-[#005236] text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* Sign Up Form */
        <form onSubmit={handleSignUp} className="bg-white rounded-2xl p-5 shadow-xs border border-[#eff4ff] space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0b1c30]">School Name</label>
            <input
              type="text"
              required
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder=""
              className="w-full h-11 bg-[#eff4ff] rounded-xl px-3 text-xs text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0b1c30]">Proprietor / Admin Full Name</label>
            <input
              type="text"
              required
              value={proprietorName}
              onChange={(e) => setProprietorName(e.target.value)}
              placeholder=""
              className="w-full h-11 bg-[#eff4ff] rounded-xl px-3 text-xs text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#0b1c30]">Official Work Email</label>
              <input
                type="email"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder=""
                className="w-full h-11 bg-[#eff4ff] rounded-xl px-3 text-xs text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#0b1c30]">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder=""
                className="w-full h-11 bg-[#eff4ff] rounded-xl px-3 text-xs text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#0b1c30]">CAC / RC Number</label>
              <input
                type="text"
                required
                value={rcNumber}
                onChange={(e) => setRcNumber(e.target.value)}
                placeholder=""
                className="w-full h-11 bg-[#eff4ff] rounded-xl px-3 text-xs text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#0b1c30]">Payroll Day</label>
              <select
                value={payrollDay}
                onChange={(e) => setPayrollDay(Number(e.target.value))}
                className="w-full h-11 bg-[#eff4ff] rounded-xl px-3 text-xs text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49]"
              >
                <option value={25}>25th Monthly</option>
                <option value={28}>28th Monthly</option>
                <option value={30}>30th Monthly</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0b1c30]">Estimated Monthly Payroll Pool (₦)</label>
            <input
              type="text"
              required
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              placeholder=""
              className="w-full h-11 bg-[#eff4ff] rounded-xl px-3 text-xs text-[#0b1c30] font-semibold tabular-nums focus:bg-white focus:ring-2 focus:ring-[#006c49]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0b1c30]">Password</label>
            <input
              type="password"
              required
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              placeholder=""
              className="w-full h-11 bg-[#eff4ff] rounded-xl px-3 text-xs text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49]"
            />
          </div>

          <label className="flex items-start gap-2 pt-1 text-xs text-[#45464d] cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 rounded accent-[#006c49]"
            />
            <span>
              I accept the <strong className="text-[#0b1c30]">Lopay School Partnership Agreement</strong>.
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#006c49] hover:bg-[#005236] text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                <span>Registering School...</span>
              </>
            ) : (
              <>
                <span>Register School</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Exit to Gateway */}
      {onBackToGateway && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onBackToGateway}
            className="text-xs text-[#76777d] hover:text-[#0b1c30] transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
          >
            <span className="material-symbols-outlined text-[15px]">arrow_back</span>
            <span>Choose different portal</span>
          </button>
        </div>
      )}
    </div>
  );
};
