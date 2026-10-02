import React from 'react';
import { AppScreen } from '../types';

interface ScreenSwitcherBarProps {
  currentScreen: AppScreen;
  onSelectScreen: (screen: AppScreen) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

export const ScreenSwitcherBar: React.FC<ScreenSwitcherBarProps> = ({
  currentScreen,
  onSelectScreen,
  isMobileFrame,
  onToggleMobileFrame,
}) => {
  const screens: { id: AppScreen; label: string; icon: string }[] = [
    { id: 'dashboard', label: '1. Dashboard', icon: 'dashboard' },
    { id: 'request-advance', label: '2. Request Advance', icon: 'payments' },
    { id: 'teachers', label: '3. Add Teacher / Roster', icon: 'person_add' },
    { id: 'owner-dashboard', label: '4. Owner Dashboard', icon: 'business' },
    { id: 'onboarding-invite', label: '5. Invite Onboarding', icon: 'mark_email_read' },
    { id: 'advances', label: '6. Activity Ledger', icon: 'receipt_long' },
    { id: 'settings', label: '7. Settings', icon: 'settings' },
  ];

  return (
    <div className="hidden md:flex items-center justify-between px-4 py-2 bg-[#131b2e] text-white border-b border-[#213145] text-xs sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <span className="font-bold text-[#6ffbbe] flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">touch_app</span>
          <span>Lopay Screens:</span>
        </span>

        <div className="flex items-center gap-1 bg-[#213145] p-1 rounded-xl">
          {screens.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectScreen(s.id)}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                currentScreen === s.id
                  ? 'bg-[#006c49] text-white shadow-xs'
                  : 'text-[#d3e4fe] hover:text-white hover:bg-[#3f465c]/40'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMobileFrame}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#213145] hover:bg-[#3f465c] text-white rounded-lg transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isMobileFrame ? 'stay_current_portrait' : 'desktop_windows'}
          </span>
          <span>{isMobileFrame ? 'Phone Frame' : 'Fluid Width'}</span>
        </button>
      </div>
    </div>
  );
};
