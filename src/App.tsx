import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { PortalGateway } from './components/gateway/PortalGateway';
import { OwnerAuthScreen } from './components/auth/OwnerAuthScreen';
import { TeacherAuthScreen } from './components/auth/TeacherAuthScreen';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { RequestAdvanceScreen } from './components/screens/RequestAdvanceScreen';
import { AdvancesActivityScreen } from './components/screens/AdvancesActivityScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import {
  INITIAL_COLLEAGUES,
  INITIAL_ACTIVITIES,
  INITIAL_TRANSACTIONS,
  DEFAULT_SCHOOL_OWNER,
  INITIAL_TEACHER,
} from './data/mockData';
import {
  UserRole,
  Teacher,
  SchoolOwner,
  AdvanceTransaction,
  ActivityRecord,
  TeacherScreen,
} from './types';

export default function App() {
  // Determine selected portal from URL parameter or localStorage
  const [selectedPortal, setSelectedPortal] = useState<UserRole | null>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const portalParam = urlParams.get('portal');
      if (portalParam === 'school_owner' || portalParam === 'owner') return 'school_owner';
      if (portalParam === 'teacher') return 'teacher';

      const savedPortal = localStorage.getItem('lopay_selected_portal');
      if (savedPortal === 'school_owner' || savedPortal === 'teacher') {
        return savedPortal as UserRole;
      }
    } catch {
      // Fallback
    }
    return null;
  });

  // School Owner Auth & Profile
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('lopay_owner_logged_in') === 'true';
    } catch {
      return false;
    }
  });
  const [currentOwner, setCurrentOwner] = useState<SchoolOwner>(DEFAULT_SCHOOL_OWNER);

  // Teacher Auth & Profile
  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('lopay_teacher_logged_in') === 'true';
    } catch {
      return false;
    }
  });
  const [currentTeacher, setCurrentTeacher] = useState<Teacher>(INITIAL_TEACHER);

  // Teacher Screen Navigation
  const [teacherScreen, setTeacherScreen] = useState<TeacherScreen>('dashboard');
  const [previousScreen, setPreviousScreen] = useState<TeacherScreen>('dashboard');

  // Shared application state
  const [teachers, setTeachers] = useState<Teacher[]>([
    INITIAL_TEACHER,
    ...INITIAL_COLLEAGUES,
  ]);
  const [activities, setActivities] = useState<ActivityRecord[]>(INITIAL_ACTIVITIES);
  const [transactions, setTransactions] = useState<AdvanceTransaction[]>(INITIAL_TRANSACTIONS);
  const [availableAmount, setAvailableAmount] = useState<number>(119000.0);

  // Persist selected portal changes
  const handleSelectPortal = (portal: UserRole) => {
    setSelectedPortal(portal);
    try {
      localStorage.setItem('lopay_selected_portal', portal);
      const url = new URL(window.location.href);
      url.searchParams.set('portal', portal);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignore storage errors
    }
  };

  const handleBackToGateway = () => {
    setSelectedPortal(null);
    try {
      localStorage.removeItem('lopay_selected_portal');
      const url = new URL(window.location.href);
      url.searchParams.delete('portal');
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignore storage errors
    }
  };

  // Teacher navigation helpers
  const navigateTeacher = (screen: TeacherScreen) => {
    setPreviousScreen(teacherScreen);
    setTeacherScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTeacherBack = () => {
    if (teacherScreen === 'request-advance') {
      setTeacherScreen(previousScreen || 'dashboard');
    } else {
      setTeacherScreen('dashboard');
    }
  };

  // Faculty management
  const handleAddTeacher = (newTeacher: Teacher) => {
    setTeachers((prev) => [newTeacher, ...prev]);
  };

  // Salary advance execution
  const handleAdvanceCompleted = (newTx: AdvanceTransaction) => {
    const enrichedTx: AdvanceTransaction = {
      ...newTx,
      teacherId: currentTeacher.id,
      teacherName: currentTeacher.name,
      department: currentTeacher.department,
    };

    setTransactions((prev) => [enrichedTx, ...prev]);

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

  // School Owner Auth Handlers
  const handleOwnerLoginSuccess = (owner: SchoolOwner) => {
    setCurrentOwner(owner);
    setIsOwnerLoggedIn(true);
    try {
      localStorage.setItem('lopay_owner_logged_in', 'true');
    } catch {
      // Ignore
    }
  };

  const handleOwnerLogout = () => {
    setIsOwnerLoggedIn(false);
    try {
      localStorage.removeItem('lopay_owner_logged_in');
    } catch {
      // Ignore
    }
  };

  // Teacher Auth Handlers
  const handleTeacherLoginSuccess = (teacher: Teacher) => {
    setCurrentTeacher(teacher);
    setIsTeacherLoggedIn(true);
    setTeacherScreen('dashboard');
    try {
      localStorage.setItem('lopay_teacher_logged_in', 'true');
    } catch {
      // Ignore
    }
  };

  const handleTeacherLogout = () => {
    setIsTeacherLoggedIn(false);
    try {
      localStorage.removeItem('lopay_teacher_logged_in');
    } catch {
      // Ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* ========================================================
          PORTAL SELECTION GATEWAY (If no portal is opened yet)
         ======================================================== */}
      {!selectedPortal && (
        <div className="flex-1 flex items-center justify-center p-4">
          <PortalGateway onSelectPortal={handleSelectPortal} />
        </div>
      )}

      {/* ========================================================
          PORTAL 1: SCHOOL OWNER / PROPRIETOR / ADMIN PORTAL
          Completely separate. No switch in between.
         ======================================================== */}
      {selectedPortal === 'school_owner' && (
        <div className="w-full flex-1 flex flex-col items-center">
          {!isOwnerLoggedIn ? (
            /* School Owner Login & Sign Up Screen */
            <div className="w-full max-w-lg min-h-screen flex items-center justify-center p-4">
              <OwnerAuthScreen
                onLoginSuccess={handleOwnerLoginSuccess}
                onBackToGateway={handleBackToGateway}
              />
            </div>
          ) : (
            /* Authenticated School Owner Dashboard (Remains in portal) */
            <div className="w-full max-w-lg min-h-screen flex flex-col">
              <OwnerDashboard
                owner={currentOwner}
                teachers={teachers}
                transactions={transactions}
                onAddTeacher={handleAddTeacher}
                onLogout={handleOwnerLogout}
              />
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          PORTAL 2: TEACHER / EDUCATOR PORTAL
          Completely separate. No switch in between.
         ======================================================== */}
      {selectedPortal === 'teacher' && (
        <div className="w-full flex-1 flex flex-col items-center">
          {!isTeacherLoggedIn ? (
            /* Teacher Login & Sign Up Screen */
            <div className="w-full max-w-lg min-h-screen flex items-center justify-center p-4">
              <TeacherAuthScreen
                onLoginSuccess={handleTeacherLoginSuccess}
                onBackToGateway={handleBackToGateway}
              />
            </div>
          ) : (
            /* Authenticated Teacher Portal (Remains in portal) */
            <div className="w-full max-w-lg min-h-screen flex flex-col relative">
              <Header
                currentScreen={teacherScreen}
                onNavigate={navigateTeacher}
                onBack={handleTeacherBack}
                showBack={teacherScreen === 'request-advance'}
                unreadCount={2}
                onLogout={handleTeacherLogout}
              />

              <main className="flex-1 flex flex-col w-full pt-20 px-4 pb-24">
                {teacherScreen === 'dashboard' && (
                  <DashboardScreen
                    onNavigate={navigateTeacher}
                    activities={activities}
                    activeAdvances={transactions}
                    availableAmount={availableAmount}
                  />
                )}

                {teacherScreen === 'request-advance' && (
                  <RequestAdvanceScreen
                    onBack={handleTeacherBack}
                    onNavigate={navigateTeacher}
                    availableCap={availableAmount}
                    onAdvanceCompleted={handleAdvanceCompleted}
                  />
                )}

                {teacherScreen === 'advances' && (
                  <AdvancesActivityScreen
                    transactions={transactions}
                    activities={activities}
                    onNavigate={navigateTeacher}
                  />
                )}

                {teacherScreen === 'settings' && (
                  <SettingsScreen
                    onNavigate={navigateTeacher}
                    onLogout={handleTeacherLogout}
                  />
                )}
              </main>

              {/* Teacher Bottom Tab Navigation */}
              <BottomNav
                currentScreen={teacherScreen}
                onNavigate={navigateTeacher}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
