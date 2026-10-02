import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ScreenSwitcherBar } from './components/ScreenSwitcherBar';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { RequestAdvanceScreen } from './components/screens/RequestAdvanceScreen';
import { TeacherDirectoryScreen } from './components/screens/TeacherDirectoryScreen';
import { InviteOnboardingScreen } from './components/screens/InviteOnboardingScreen';
import { AdvancesActivityScreen } from './components/screens/AdvancesActivityScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { OwnerDashboardScreen } from './components/screens/OwnerDashboardScreen';
import {
  INITIAL_COLLEAGUES,
  INITIAL_ACTIVITIES,
  INITIAL_TRANSACTIONS,
} from './data/mockData';
import { AppScreen, Teacher, AdvanceTransaction, ActivityRecord } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('dashboard');
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_COLLEAGUES);
  const [activities, setActivities] = useState<ActivityRecord[]>(INITIAL_ACTIVITIES);
  const [transactions, setTransactions] = useState<AdvanceTransaction[]>(INITIAL_TRANSACTIONS);
  const [availableAmount, setAvailableAmount] = useState<number>(119000.0);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // Screen history stack for realistic back button
  const [previousScreen, setPreviousScreen] = useState<AppScreen>('dashboard');

  const navigateTo = (screen: AppScreen) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (currentScreen === 'request-advance' || currentScreen === 'onboarding-invite') {
      setCurrentScreen(previousScreen || 'dashboard');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  const handleAddTeacher = (newTeacher: Teacher) => {
    setTeachers((prev) => [newTeacher, ...prev]);
  };

  const handleApproveTeacher = (teacherId: string) => {
    setTeachers((prev) =>
      prev.map((teacher) =>
        teacher.id === teacherId
          ? {
              ...teacher,
              status: 'active',
              onboardedAt: 'Approved today',
            }
          : teacher,
      ),
    );
  };

  const handleAdvanceCompleted = (newTx: AdvanceTransaction) => {
    setTransactions((prev) => [newTx, ...prev]);

    // Add to activity stream
    const newActivity: ActivityRecord = {
      id: `act-${Date.now()}`,
      type: 'advance',
      title: 'Salary Advance Payout',
      date: `Today • Zenith Bank (•••• 8921)`,
      amount: newTx.amount,
      status: 'Completed',
      account: 'Zenith Bank Direct Deposit',
      isPositive: false,
    };
    setActivities((prev) => [newActivity, ...prev]);

    // Update remaining available
    setAvailableAmount((prev) => Math.max(0, prev - newTx.amount));
  };

  const showBottomNav = currentScreen !== 'onboarding-invite';
  const showBackInHeader = currentScreen === 'request-advance' || currentScreen === 'onboarding-invite';

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Desktop Screen Switcher & Device Preview Bar */}
      <ScreenSwitcherBar
        currentScreen={currentScreen}
        onSelectScreen={navigateTo}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
      />

      <div className={`flex-1 flex flex-col items-center justify-start ${isMobileFrame ? 'md:py-6' : ''}`}>
        {/* Device Container */}
        <div
          className={`w-full flex flex-col min-h-screen ${
            isMobileFrame
              ? 'md:max-w-[430px] md:min-h-[880px] md:rounded-[40px] md:shadow-[0_25px_60px_-15px_rgba(11,28,48,0.2)] md:border-[8px] md:border-[#131b2e] md:overflow-hidden md:relative bg-[#f8f9ff]'
              : 'max-w-2xl bg-[#f8f9ff]'
          }`}
        >
          {/* Top Header */}
          <Header
            currentScreen={currentScreen}
            onNavigate={navigateTo}
            onBack={handleBack}
            showBack={showBackInHeader}
            unreadCount={2}
          />

          {/* Main Viewport Content */}
          <main className={`flex-1 flex flex-col w-full pt-20 px-4 ${showBottomNav ? 'pb-24' : 'pb-8'}`}>
            {currentScreen === 'dashboard' && (
              <DashboardScreen
                onNavigate={navigateTo}
                activities={activities}
                activeAdvances={transactions}
                availableAmount={availableAmount}
              />
            )}

            {currentScreen === 'request-advance' && (
              <RequestAdvanceScreen
                onBack={handleBack}
                onNavigate={navigateTo}
                availableCap={availableAmount}
                onAdvanceCompleted={handleAdvanceCompleted}
              />
            )}

            {currentScreen === 'teachers' && (
              <TeacherDirectoryScreen
                teachers={teachers}
                onAddTeacher={handleAddTeacher}
                onNavigate={navigateTo}
              />
            )}

            {currentScreen === 'owner-dashboard' && (
              <OwnerDashboardScreen
                teachers={teachers}
                transactions={transactions}
                onNavigate={navigateTo}
                onApproveTeacher={handleApproveTeacher}
              />
            )}

            {currentScreen === 'onboarding-invite' && (
              <InviteOnboardingScreen
                onVerifyAndEnter={() => navigateTo('dashboard')}
                onNavigate={navigateTo}
              />
            )}

            {currentScreen === 'advances' && (
              <AdvancesActivityScreen
                transactions={transactions}
                activities={activities}
                onNavigate={navigateTo}
              />
            )}

            {currentScreen === 'settings' && (
              <SettingsScreen onNavigate={navigateTo} />
            )}
          </main>

          {/* Bottom Navigation */}
          {showBottomNav && (
            <BottomNav
              currentScreen={currentScreen}
              onNavigate={navigateTo}
            />
          )}
        </div>
      </div>
    </div>
  );
}
