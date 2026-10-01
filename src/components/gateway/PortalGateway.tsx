import React from 'react';
import { IMAGES } from '../../data/mockData';
import { UserRole } from '../../types';

interface PortalGatewayProps {
  onSelectPortal: (role: UserRole) => void;
}

export const PortalGateway: React.FC<PortalGatewayProps> = ({ onSelectPortal }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col justify-center min-h-[80vh] space-y-6 animate-in fade-in duration-300">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <img alt="Lopay Logo" src={IMAGES.logo} className="h-10 w-auto object-contain" />
        <div>
          <h1 className="text-[26px] font-bold text-[#0b1c30] tracking-tight">
            Earned Wage Access for Education
          </h1>
          <p className="text-[13px] text-[#45464d] mt-1.5 leading-relaxed">
            Welcome to Lopay. Please choose your portal to sign up or sign in.
          </p>
        </div>
      </div>

      {/* Two Standalone Portal Entry Cards */}
      <div className="space-y-4 pt-2">
        {/* Portal 1: School Owner & Administrator */}
        <div
          onClick={() => onSelectPortal('school_owner')}
          className="group relative overflow-hidden bg-white p-5 rounded-2xl border-2 border-[#eff4ff] hover:border-[#006c49] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col space-y-3 active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[#131b2e] text-[#6ffbbe] flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[26px]">admin_panel_settings</span>
            </div>
            <span className="text-[11px] font-bold text-[#006c49] bg-[#6cf8bb]/30 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></span>
              Employer Access
            </span>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0b1c30] group-hover:text-[#006c49] transition-colors">
              School Owner Portal
            </h2>
            <p className="text-[12px] text-[#45464d] mt-0.5 leading-relaxed">
              For school proprietors, directors, and HR administrators. Register your school, manage faculty
              rosters, and automate payday settlements.
            </p>
          </div>

          <div className="pt-2 border-t border-[#eff4ff] flex items-center justify-between text-xs font-bold text-[#006c49]">
            <span>Sign in or Register School</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </div>
        </div>

        {/* Portal 2: Teacher & Faculty Member */}
        <div
          onClick={() => onSelectPortal('teacher')}
          className="group relative overflow-hidden bg-white p-5 rounded-2xl border-2 border-[#eff4ff] hover:border-[#006c49] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col space-y-3 active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[#006c49] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[26px]">school</span>
            </div>
            <span className="text-[11px] font-bold text-[#00714d] bg-[#6cf8bb]/30 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></span>
              0% APR Benefit
            </span>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0b1c30] group-hover:text-[#006c49] transition-colors">
              Teacher Portal
            </h2>
            <p className="text-[12px] text-[#45464d] mt-0.5 leading-relaxed">
              For teachers and school faculty members. Access your earned salary before payday, preview instant
              disbursements, and track earnings.
            </p>
          </div>

          <div className="pt-2 border-t border-[#eff4ff] flex items-center justify-between text-xs font-bold text-[#006c49]">
            <span>Teacher Sign in or Sign up</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-[#45464d] text-center pt-2">
        <span className="material-symbols-outlined text-[16px] text-[#006c49] fill">verified_user</span>
        <span>Secure 256-bit encryption • Direct NIBSS/NIP Settlement</span>
      </div>
    </div>
  );
};
