import React, { useState, useMemo } from 'react';
import { INITIAL_TEACHER, REGISTERED_SCHOOLS } from '../../data/mockData';
import { Teacher, AuthMode, RegisteredSchool } from '../../types';
import { LopayLogo } from '../common/LopayLogo';

interface TeacherAuthScreenProps {
  onLoginSuccess: (teacher: Teacher) => void;
  onBackToGateway?: () => void;
}

export const TeacherAuthScreen: React.FC<TeacherAuthScreenProps> = ({
  onLoginSuccess,
  onBackToGateway,
}) => {
  const [mode, setMode] = useState<AuthMode>('login');

  // Login form state - completely empty
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPin, setLoginPin] = useState<string>('');

  // Sign up state - completely empty
  const [fullName, setFullName] = useState<string>('');
  const [schoolQuery, setSchoolQuery] = useState<string>('');
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState<boolean>(false);
  const [personalEmail, setPersonalEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [signupPin, setSignupPin] = useState<string>('');
  const [agreed, setAgreed] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Real-time school lookup in Lopay registry
  const matchingSchools = useMemo(() => {
    if (!schoolQuery.trim()) return REGISTERED_SCHOOLS;
    const q = schoolQuery.toLowerCase().trim();
    return REGISTERED_SCHOOLS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.rcNumber.toLowerCase().includes(q)
    );
  }, [schoolQuery]);

  // Determine if typed school is verified under Lopay
  const verifiedSchool = useMemo(() => {
    if (!schoolQuery.trim()) return null;
    const q = schoolQuery.toLowerCase().trim();
    return (
      REGISTERED_SCHOOLS.find(
        (s) => s.name.toLowerCase() === q || s.name.toLowerCase().includes(q)
      ) || null
    );
  }, [schoolQuery]);

  const isSchoolVerified = !!verifiedSchool && schoolQuery.trim().length >= 4;

  const handleSelectSchool = (school: RegisteredSchool) => {
    setSchoolQuery(school.name);
    setIsSchoolDropdownOpen(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        ...INITIAL_TEACHER,
        email: loginEmail || INITIAL_TEACHER.email,
      });
    }, 650);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('Please agree to the Fair Wage Access terms.');
      return;
    }

    if (!personalEmail.trim() || !personalEmail.includes('@')) {
      alert('Please provide a valid email address.');
      return;
    }

    setIsLoading(true);

    const newTeacher: Teacher = {
      id: `teacher-${Date.now()}`,
      name: fullName || 'Teacher Member',
      title: 'Faculty Educator',
      email: personalEmail,
      phone,
      salary: 420000.0,
      maxAdvancePct: 50,
      eligibleAdvance: 210000.0,
      department: department || 'Academics',
      startDate: 'Sep 01, 2024',
      bankName: 'Zenith Bank',
      routingNumber: '•••• 4412',
      accountNumber: '•••••••• 8921',
      allowAdvances: true,
      status: 'active',
      avatarUrl: INITIAL_TEACHER.avatarUrl,
      schoolName: schoolQuery,
      isSchoolRegistered: isSchoolVerified,
    };

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(newTeacher);
    }, 800);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col space-y-5 animate-in fade-in duration-200">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center space-y-2">
        <LopayLogo variant="full" size="sm" showSubtitle={true} className="mb-1" />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006c49] text-white text-xs font-semibold shadow-xs">
          <span className="material-symbols-outlined text-[15px]">school</span>
          <span>Educator &amp; Faculty Portal</span>
        </div>
        <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">
          {mode === 'login' ? 'Teacher Sign In' : 'New Teacher Sign Up'}
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
          Teacher Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`py-2 rounded-lg transition-all cursor-pointer ${
            mode === 'signup' ? 'bg-white text-[#0b1c30] shadow-xs' : 'text-[#45464d] hover:text-[#0b1c30]'
          }`}
        >
          New Teacher Sign Up
        </button>
      </div>

      {/* Login Form */}
      {mode === 'login' ? (
        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-5 shadow-xs border border-[#eff4ff] space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0b1c30]">Teacher Email</label>
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
              <label className="text-xs font-semibold text-[#0b1c30]">4-Digit Access PIN</label>
              <button type="button" className="text-[11px] text-[#006c49] font-semibold hover:underline">
                Reset PIN
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                maxLength={6}
                value={loginPin}
                onChange={(e) => setLoginPin(e.target.value)}
                placeholder=""
                className="w-full h-12 bg-[#eff4ff] rounded-xl px-4 pl-10 text-sm tracking-widest text-[#0b1c30] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#006c49]"
              />
              <span className="material-symbols-outlined absolute left-3 top-3.5 text-[18px] text-[#45464d]">
                pin
              </span>
            </div>
          </div>

          <div className="flex items-center text-xs pt-1">
            <div className="flex items-center gap-1.5 text-[#006c49] text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[15px]">face</span>
              <span>Face ID Enabled</span>
            </div>
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
        <form onSubmit={handleSignUp} className="bg-white rounded-2xl p-5 shadow-xs border border-[#eff4ff] space-y-4">
          {/* 1. Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0b1c30]">Full Legal Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder=""
              className="w-full h-11 bg-[#eff4ff] rounded-xl px-3 text-xs text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49] outline-hidden"
            />
          </div>

          {/* 2. Affiliated School with Live Lopay Registration Search */}
          <div className="space-y-1 relative">
            <label className="text-xs font-semibold text-[#0b1c30]">
              Affiliated School
            </label>

            <div className="relative">
              <input
                type="text"
                required
                value={schoolQuery}
                onFocus={() => {
                  if (schoolQuery.trim().length > 0) setIsSchoolDropdownOpen(true);
                }}
                onChange={(e) => {
                  setSchoolQuery(e.target.value);
                  setIsSchoolDropdownOpen(e.target.value.trim().length > 0);
                }}
                placeholder=""
                className="w-full h-11 bg-[#eff4ff] rounded-xl px-3 pl-9 pr-9 text-xs text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49] outline-hidden"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-[#45464d]">
                school
              </span>

              {isSchoolVerified ? (
                <span
                  title="Registered with Lopay"
                  className="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-[#006c49]"
                >
                  verified
                </span>
              ) : (
                <span
                  className="material-symbols-outlined absolute right-2.5 top-2.5 text-[18px] text-[#76777d]"
                >
                  search
                </span>
              )}
            </div>

            {/* Dropdown Suggestions when searching */}
            {isSchoolDropdownOpen && matchingSchools.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-[#d3e4fe] z-20 max-h-52 overflow-y-auto divide-y divide-[#eff4ff]">
                <div className="p-2 bg-[#f8f9ff] text-[10px] font-semibold text-[#45464d] uppercase tracking-wider flex items-center justify-between">
                  <span>Registered Lopay Schools ({matchingSchools.length})</span>
                  <button
                    type="button"
                    onClick={() => setIsSchoolDropdownOpen(false)}
                    className="text-[#76777d] hover:text-[#0b1c30]"
                  >
                    ✕
                  </button>
                </div>
                {matchingSchools.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectSchool(s)}
                    className="w-full text-left p-2.5 hover:bg-[#eff4ff] transition-colors cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0b1c30] truncate">{s.name}</p>
                      <p className="text-[11px] text-[#45464d] truncate">{s.location} • {s.rcNumber}</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-semibold bg-[#6cf8bb]/30 text-[#00714d] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></span>
                      Lopay Active
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* School Verification Status Card */}
            {isSchoolVerified && verifiedSchool ? (
              <div className="p-3 bg-[#eff4ff] border border-[#6cf8bb]/60 rounded-xl flex items-start gap-2.5 animate-in fade-in">
                <span className="material-symbols-outlined text-[20px] text-[#006c49] shrink-0 mt-0.5">
                  check_circle
                </span>
                <div className="text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#0b1c30]">School Registered with Lopay</span>
                    <span className="text-[10px] font-bold bg-[#006c49] text-white px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-[#45464d] mt-0.5">
                    {verifiedSchool.name} is registered. Payroll cycle: <strong>{verifiedSchool.payrollCycleDay}th of month</strong>.
                  </p>
                </div>
              </div>
            ) : schoolQuery.trim().length >= 3 ? (
              <div className="p-3 bg-[#fff8e1] border border-[#ffe082] rounded-xl flex items-start gap-2.5 animate-in fade-in">
                <span className="material-symbols-outlined text-[20px] text-[#b78103] shrink-0 mt-0.5">
                  info
                </span>
                <div className="text-xs space-y-1">
                  <span className="font-bold text-[#5c3e00]">School Not Registered with Lopay</span>
                  <p className="text-[11px] text-[#7a5500]">
                    "{schoolQuery}" has not created an account with Lopay yet.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* 3. Teacher Personal Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0b1c30]">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={personalEmail}
                onChange={(e) => setPersonalEmail(e.target.value)}
                placeholder=""
                className="w-full h-11 bg-[#eff4ff] rounded-xl px-3 pl-9 text-xs text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49] outline-hidden"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-[#45464d]">
                alternate_email
              </span>
            </div>
          </div>

          {/* 4. Phone & Department */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#0b1c30]">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder=""
                className="w-full h-11 bg-[#eff4ff] rounded-xl px-3 text-xs text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49] outline-hidden"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#0b1c30]">Department / Subject</label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder=""
                className="w-full h-11 bg-[#eff4ff] rounded-xl px-3 text-xs text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49] outline-hidden"
              />
            </div>
          </div>

          {/* 5. Create 4-Digit Access PIN */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0b1c30]">4-Digit Access PIN</label>
            <input
              type="password"
              required
              maxLength={4}
              value={signupPin}
              onChange={(e) => setSignupPin(e.target.value)}
              placeholder=""
              className="w-full h-11 bg-[#eff4ff] rounded-xl px-3 text-center text-sm font-bold tracking-widest text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49] outline-hidden"
            />
          </div>

          {/* 6. Agreement */}
          <label className="flex items-start gap-2 pt-1 text-xs text-[#45464d] cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded accent-[#006c49]"
            />
            <span>
              I agree to the <strong className="text-[#0b1c30]">Fair Wage Access Agreement</strong>.
            </span>
          </label>

          {/* 7. Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#006c49] hover:bg-[#005236] text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Sign Up</span>
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
