export type UserRole = 'school_owner' | 'teacher';

export interface Teacher {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  salary: number;
  maxAdvancePct: number;
  eligibleAdvance: number;
  department: string;
  startDate: string;
  bankName: string;
  routingNumber: string;
  accountNumber: string;
  allowAdvances: boolean;
  status: 'active' | 'pending';
  avatarUrl: string;
  invitedAt?: string;
  onboardedAt?: string;
  schoolName?: string;
  isSchoolRegistered?: boolean;
}

export interface RegisteredSchool {
  id: string;
  name: string;
  location: string;
  rcNumber: string;
  isRegisteredWithLopay: boolean;
  payrollCycleDay: number;
  proprietorName: string;
  facultyCount: number;
}

export interface SchoolOwner {
  id: string;
  name: string;
  roleTitle: string;
  email: string;
  phone: string;
  schoolName: string;
  rcNumber: string;
  payrollCycleDay: number;
  totalFaculty: number;
  monthlyPayrollBudget: number;
  verified: boolean;
  avatarUrl: string;
}

export interface AdvanceTransaction {
  id: string;
  teacherId?: string;
  teacherName?: string;
  department?: string;
  amount: number;
  fee: number;
  netReceived: number;
  requestedAt: string;
  repaymentDate: string;
  status: 'completed' | 'repaid' | 'processing';
  bankAccount: string;
  purpose?: string;
  referenceNumber: string;
}

export interface ActivityRecord {
  id: string;
  type: 'deposit' | 'advance' | 'repayment';
  title: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Repaid' | 'Pending';
  account: string;
  isPositive: boolean;
}

export type TeacherScreen = 'dashboard' | 'request-advance' | 'advances' | 'settings';
export type OwnerScreen = 'overview' | 'roster' | 'advances' | 'settings';
export type AuthMode = 'login' | 'signup';
