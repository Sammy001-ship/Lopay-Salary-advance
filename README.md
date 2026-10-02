# Lopay Salary Advance

Lopay Salary Advance is a mobile-first React + TypeScript prototype for an earned-salary advance product designed for teachers and school owners. The app demonstrates a modern salary access workflow, teacher onboarding, payout review, and school-level oversight dashboards.

## Overview

The product is built as a front-end experience with a polished fintech UI and multiple screens for:

- teacher dashboard with earnings and available advance balance
- request advance flow with amount selection and fee breakdown
- teacher directory and onboarding/invite flow
- advances activity ledger
- settings screen
- school owner dashboard for payroll and approval oversight

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind-style utility classes
- Lucide-style material icon usage

## Project Structure

```text
Lopay-Salary-advanvce/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── components/
│   │   ├── BottomNav.tsx
│   │   ├── Header.tsx
│   │   ├── ScreenSwitcherBar.tsx
│   │   └── screens/
│   │       ├── AdvancesActivityScreen.tsx
│   │       ├── DashboardScreen.tsx
│   │       ├── InviteOnboardingScreen.tsx
│   │       ├── OwnerDashboardScreen.tsx
│   │       ├── RequestAdvanceScreen.tsx
│   │       ├── SettingsScreen.tsx
│   │       └── TeacherDirectoryScreen.tsx
│   ├── data/
│   │   └── mockData.ts
│   ├── types/
│   │   └── index.ts
│   └── assets/ (if added later)
└── public/ (if added later)
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the app locally

```bash
npm start
```

This starts the Vite development server on:

```text
http://localhost:3000
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## Main User Flows

### Teacher Flow

- open dashboard
- view salary and available earnings
- request a salary advance
- select amount and see fee and net payout
- confirm transfer
- review advance activity

### School Owner Flow

- view school overview and payroll metrics
- monitor active staff and pending approvals
- approve pending teacher onboarding requests
- review recent payout activity and funding health

## Notes

This repository is currently a front-end prototype and uses mock data instead of a real backend or database. It is designed to showcase the experience and flow of a salary advance product rather than to serve as a production-ready fintech platform.

## Future Enhancements

- connect to a real API/backend
- persist data with local storage or database
- add auth for teacher and owner roles
- add validation and error states
- add automated tests
- introduce role switching and permission-based views

## License

This project is for demonstration and prototype use.
