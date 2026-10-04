import React, { useState } from 'react';
import { IMAGES } from '../data/mockData';
import { TeacherScreen } from '../types';
import { LopayLogoMark } from './common/LopayLogo';

interface HeaderProps {
  currentScreen: TeacherScreen;
  onNavigate: (screen: TeacherScreen) => void;
  onBack?: () => void;
  showBack?: boolean;
  unreadCount?: number;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onBack,
  showBack = false,
  unreadCount = 2,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getSubtitle = () => {
    switch (currentScreen) {
      case 'dashboard':
        return 'Teacher Dashboard';
      case 'request-advance':
        return 'Request Advance';
      case 'advances':
        return 'Advance Activity';
      case 'settings':
        return 'Account Settings';
      default:
        return 'Teacher Dashboard';
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full z-40 bg-[#f8f9ff]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(11,28,48,0.04)] pt-[env(safe-area-inset-top,0px)]">
        <div className="h-16 max-w-lg mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {showBack && (
              <button
                type="button"
                aria-label="Go back"
                onClick={onBack}
                className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full text-[#0b1c30] hover:bg-[#eff4ff] active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </button>
            )}

            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => onNavigate('dashboard')}
            >
              <LopayLogoMark size={28} color="#0b1c30" accentColor="#ffffff" />
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-extrabold text-[#0b1c30] tracking-[0.06em] leading-none uppercase">
                  LOPAY
                </span>
                <span className="text-[10px] text-[#006c49] font-bold leading-tight truncate mt-0.5">
                  {getSubtitle()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff] active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#006c49] ring-2 ring-[#f8f9ff]"></span>
              )}
            </button>

            <button
              type="button"
              aria-label="Profile"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <img
                alt="Sarah Jenkins Profile"
                src={IMAGES.profileSarah}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#006c49]/40"
              />
            </button>
          </div>
        </div>
      </header>

      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-xl border border-[#d3e4fe] space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#006c49]">notifications_active</span>
                <h3 className="text-sm font-semibold text-[#0b1c30]">School &amp; Wage Alerts</h3>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-xs text-[#45464d] hover:text-[#0b1c30] font-medium"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#eff4ff] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#006c49] shrink-0 mt-0.5">account_balance</span>
                <div>
                  <p className="font-semibold text-[#0b1c30]">Oakridge Payroll Synced</p>
                  <p className="text-[#45464d] mt-0.5">Cycle progress updated: 17 days logged (₦238,000.00 earned so far).</p>
                  <span className="text-[10px] text-[#76777d] mt-1 block">Today at 8:00 AM</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#008cc7] shrink-0 mt-0.5">school</span>
                <div>
                  <p className="font-semibold text-[#0b1c30]">STEM Lab Match Available</p>
                  <p className="text-[#45464d] mt-0.5">Claim up to ₦50,000 in science lab materials through Lopay Teacher Wellness.</p>
                  <span className="text-[10px] text-[#76777d] mt-1 block">Yesterday</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowNotifications(false);
                onNavigate('advances');
              }}
              className="w-full py-2 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006c49] font-semibold text-xs rounded-xl transition-colors"
            >
              View Full History
            </button>
          </div>
        </div>
      )}

      {showProfileMenu && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/40 backdrop-blur-xs"
          onClick={() => setShowProfileMenu(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-xl border border-[#d3e4fe] space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 pb-3 border-b border-[#eff4ff]">
              <img
                alt="Sarah Jenkins Profile"
                src={IMAGES.profileSarah}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-[#006c49]"
              />
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-[#0b1c30] truncate">Sarah Jenkins, M.Ed</h4>
                <p className="text-xs text-[#45464d] truncate">Grade 8 Science • Oakridge</p>
                <span className="inline-flex items-center gap-1 text-[11px] text-[#006c49] font-semibold mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></span> Verified Faculty Member
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onNavigate('settings');
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-[#0b1c30] hover:bg-[#eff4ff] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#76777d]">settings</span>
                  <span>Account &amp; Direct Deposit</span>
                </div>
              </button>

              {onLogout && (
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Sign Out of Teacher Portal</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
