import React from 'react';
import { TeacherScreen } from '../types';

interface BottomNavProps {
  currentScreen: TeacherScreen;
  onNavigate: (screen: TeacherScreen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    {
      screen: 'dashboard' as TeacherScreen,
      label: 'Home',
      icon: 'dashboard',
    },
    {
      screen: 'request-advance' as TeacherScreen,
      label: 'Advance',
      icon: 'payments',
    },
    {
      screen: 'advances' as TeacherScreen,
      label: 'Activity',
      icon: 'receipt_long',
    },
    {
      screen: 'settings' as TeacherScreen,
      label: 'Settings',
      icon: 'manage_accounts',
    },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-[env(safe-area-inset-bottom,0px)] bg-[#f8f9ff]/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(11,28,48,0.05)] border-t border-[#d3e4fe]/40">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.screen;

          return (
            <button
              key={item.screen}
              type="button"
              onClick={() => onNavigate(item.screen)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-12 transition-colors cursor-pointer select-none active:scale-95 ${
                isActive
                  ? 'text-[#006c49] font-bold'
                  : 'text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[24px] ${isActive ? 'fill' : ''}`}
              >
                {item.icon}
              </span>
              <span className="text-[11px] tracking-tight leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
