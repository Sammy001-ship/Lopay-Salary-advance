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
}

export interface AdvanceTransaction {
  id: string;
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

export type AppScreen = 'dashboard' | 'request-advance' | 'teachers' | 'advances' | 'settings' | 'onboarding-invite';
