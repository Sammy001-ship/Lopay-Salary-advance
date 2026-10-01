import React from 'react';
import { AppScreen } from '../types';

interface BottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    {
      screen: 'dashboard' as AppScreen,
      label: 'Home',
      icon: 'dashboard',
    },
    {
      screen: 'advances' as AppScreen,
      label: 'Advances',
      icon: 'payments',
    },
    {
      screen: 'teachers' as AppScreen,
      label: 'Teachers',
      icon: 'school',
    },
    {
      screen: 'settings' as AppScreen,
      label: 'Settings',
      icon: 'manage_accounts',
    },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-[env(safe-area-inset-bottom,0px)] bg-[#f8f9ff]/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(11,28,48,0.05)] border-t border-[#d3e4fe]/40">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive =
            currentScreen === item.screen ||
            (item.screen === 'advances' && currentScreen === 'request-advance');

          return (
            <button
              key={item.screen}
              type="button"
              onClick={() => onNavigate(item.screen)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-12 transition-colors cursor-pointer select-none active:scale-95 ${
                isActive
                  ? 'text-[#006c49] font-semibold'
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
