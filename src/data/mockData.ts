import { Teacher, AdvanceTransaction, ActivityRecord } from '../types';

export const INITIAL_TEACHER: Teacher = {
  id: 'sarah-jenkins',
  name: 'Sarah Jenkins, M.Ed',
  title: 'Senior Science Teacher',
  email: 's.jenkins@oakridge.edu',
  phone: '+234 803 349 8812',
  salary: 420000.0,
  maxAdvancePct: 50,
  eligibleAdvance: 210000.0,
  department: 'Grade 8 Science',
  startDate: 'Sep 01, 2021',
  bankName: 'Zenith Bank',
  routingNumber: '•••• 4412',
  accountNumber: '•••••••• 8921',
  allowAdvances: true,
  status: 'active',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwYQ4iAZS7vvey8uq7LB4XaBg7DMoqAccRVriOk0DdIatFb6S70iH4QqP_SxYHZruves5njBBd0xYs3pHzVXhLaMcZ9qTCgX10rdpH4I1zGkyUOId9UhYpO3luaJnTVomW86NU5VCZmjb4s3YGlmzCbMAsGFlbisI8CyvS_NBLBg4rxGyzcMnwIfbDatL6h88phUOnur7R338koM40IymAJPR_qHABuYDF3Bb-5bOzUw67MvIq_8yu',
};

export const INITIAL_COLLEAGUES: Teacher[] = [
  {
    id: 'david-miller',
    name: 'David Miller',
    title: 'Mathematics Instructor',
    email: 'd.miller@oakridge.edu',
    phone: '+234 802 891 2309',
    salary: 395000.0,
    maxAdvancePct: 50,
    eligibleAdvance: 197500.0,
    department: 'Math Dept',
    startDate: 'Aug 15, 2022',
    bankName: 'Access Bank',
    routingNumber: '•••• 1289',
    accountNumber: '•••••••• 4431',
    allowAdvances: true,
    status: 'pending',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsrd8E2UkJkuzLRgovfQdcmIfL3Xe1wkNWCRbPigzvA07NDMVVXBKPdQNgijKCbAApVTvdkGtyuYUsxEL7Wx-VUfc_Vp997vsDwHJMFRnYsY50frX0dJhMZ7S9sqk60bQogwzIw9gJKI70OwSRR3Jn_W-IZuE27KXa1AKw4uFHYZrzRtu64OabnWSmnAlxUff_EZLSnuUMJyEM_g9N4WgT3mE7pEk6jTjU1ADIZA-VR6hxlGnRyvAz',
    invitedAt: 'Invited 2 hours ago',
  },
  {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    title: 'Physics & Chemistry Faculty',
    email: 'e.rostova@oakridge.edu',
    phone: '+234 814 742 1194',
    salary: 440000.0,
    maxAdvancePct: 50,
    eligibleAdvance: 220000.0,
    department: 'Science',
    startDate: 'Jan 10, 2020',
    bankName: 'Guaranty Trust Bank (GTBank)',
    routingNumber: '•••• 7721',
    accountNumber: '•••••••• 9015',
    allowAdvances: true,
    status: 'active',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLJjOQ0Qq7ZT33T4n8-0aZ-XGhSmvdLUKp9caIZF7jnsziC0Rstghz5FQhMD4E6WhB2ueA8Shh0aLHQwZT1kMFE-RFgAfaQtl41FB_L3SIiDtKAsmOxVCI9D48SHjcXAp78OoZdYkVrsirIRx06OsoH2LiUsinVqU5dwE9CAYQ30OfwyU1ScEZgF-ugsQChLN9p4B6q3b7860-altZYA7FkbZNwH41J8Ii2WoqF7xO--kCnbyenvPz',
    onboardedAt: 'Onboarded Yesterday',
  },
];

export const INITIAL_ACTIVITIES: ActivityRecord[] = [
  {
    id: 'act-1',
    type: 'deposit',
    title: 'Salary Deposited',
    date: 'Feb 28 • Monthly Payroll',
    amount: 420000.0,
    status: 'Completed',
    account: 'Zenith Bank Direct Deposit',
    isPositive: true,
  },
  {
    id: 'act-2',
    type: 'advance',
    title: 'Mid-month Advance',
    date: 'Feb 14 • Zenith Bank (•••• 8921)',
    amount: 40000.0,
    status: 'Repaid',
    account: 'Zenith Bank Direct Deposit',
    isPositive: false,
  },
];

export const INITIAL_TRANSACTIONS: AdvanceTransaction[] = [
  {
    id: 'tx-2025-0214',
    amount: 40000.0,
    fee: 500.0,
    netReceived: 39500.0,
    requestedAt: 'Feb 14, 2025 09:24 AM',
    repaymentDate: 'Feb 28, 2025',
    status: 'repaid',
    bankAccount: 'Zenith Bank Direct Deposit (•••• 8921)',
    purpose: 'Classroom supplies',
    referenceNumber: 'LP-9941829',
  },
];

export const IMAGES = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1WZV0_CP80zlpyoX-KyJ4aNRFfZ2eP5PX-qn_Lt68bnENiUm3vM2-fRNeBbV-UZ0BP8gfXotrr18DHth9fEPxZYgoI20HSCGv4wpftlF_3CLVVrlaZhEkWcTWwBiyTYRoGaApg8_mXO6yPgsu80jfFjVQ3eW1SZGHfk5Adtd_5KXGKos2RGslMWIyVHSv5SSZjnza1k9Jrhq-wKBZM_IQci9ss9jMnmxgcaexJgPp337Mgo05c1uIXyhw',
  profileSarah: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwYQ4iAZS7vvey8uq7LB4XaBg7DMoqAccRVriOk0DdIatFb6S70iH4QqP_SxYHZruves5njBBd0xYs3pHzVXhLaMcZ9qTCgX10rdpH4I1zGkyUOId9UhYpO3luaJnTVomW86NU5VCZmjb4s3YGlmzCbMAsGFlbisI8CyvS_NBLBg4rxGyzcMnwIfbDatL6h88phUOnur7R338koM40IymAJPR_qHABuYDF3Bb-5bOzUw67MvIq_8yu',
  davidMiller: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsrd8E2UkJkuzLRgovfQdcmIfL3Xe1wkNWCRbPigzvA07NDMVVXBKPdQNgijKCbAApVTvdkGtyuYUsxEL7Wx-VUfc_Vp997vsDwHJMFRnYsY50frX0dJhMZ7S9sqk60bQogwzIw9gJKI70OwSRR3Jn_W-IZuE27KXa1AKw4uFHYZrzRtu64OabnWSmnAlxUff_EZLSnuUMJyEM_g9N4WgT3mE7pEk6jTjU1ADIZA-VR6hxlGnRyvAz',
  elenaRostova: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLJjOQ0Qq7ZT33T4n8-0aZ-XGhSmvdLUKp9caIZF7jnsziC0Rstghz5FQhMD4E6WhB2ueA8Shh0aLHQwZT1kMFE-RFgAfaQtl41FB_L3SIiDtKAsmOxVCI9D48SHjcXAp78OoZdYkVrsirIRx06OsoH2LiUsinVqU5dwE9CAYQ30OfwyU1ScEZgF-ugsQChLN9p4B6q3b7860-altZYA7FkbZNwH41J8Ii2WoqF7xO--kCnbyenvPz',
  stemClassroom: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAALJPXkzU0h3PIKV51Imex5QEMvyPJLwvJVjMsC-1ceqdioxezj1PPmEwPVNNZ7lt-tzk_cmSKjW9h-Qj32PEB2c5KNHfLFh6AWxTKZs-mENk0pZ_Mq9VIDT-00oPwoSdjSLdX0Nr0IlYn9z5ojtprBVDRwNoBU7efmhRo3vGn6brAVazNAi7e-GGwjl-9VebSRda16qTEYK0NFJtSN3yqFTyhLWJGoyMWa4xADvJIAShjKsVIWOy_',
  affirmationTeacher: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJLQG82sCE1se_kBvFEAiRvya-RMnFWPfEYCQ1IX_0HF20GQy9x1H6YbRyRCK_Upsiv5jDWnZQjgCVNRG9oaB69M1uTeTEpmP5TRIuGxQtGVi6lNPfqS1TnvlCxPSDnVB9oaXnFhDcnJef6LbgnkFOKoiFUUZBZLw-Ns56l3A2fHdX-zknzulV8yR6Q1tfVCoou9rKHRYYv8SjHpxwniPJuUBgUkFO5lG7VuI1fCnEzIchprVF_X2E',
};
