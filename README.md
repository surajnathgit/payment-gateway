# Payment Gateway — Next.js App Router

## Setup
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Material UI v5 for UI components
- Zustand (with persist middleware) for state management + localStorage
- AbortController for 6s frontend timeout

## Assumptions
- Card validation uses Luhn algorithm
- Mock API: 60% success, 25% fail, 15% timeout (8s delay → frontend cancels at 6s)
- Transaction history persists via localStorage using Zustand persist middleware

## What I'd improve with more time
- Add flip animation to card preview (front/back for CVV)
- Add real currency conversion rates
- Add unit tests for validation utils
- Add skeleton loading states
- Add toast notifications for quick feedback