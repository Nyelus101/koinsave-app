Koinsave – Modern Savings & Investment Platform

Koinsave is a full-stack savings and investment platform built with Next.js 15, TypeScript, Tailwind CSS, Prisma, and NextAuth. It allows users to securely save money, manage plans, track transactions, and complete billing flows via a clean, responsive interface.


***Tech Stack

Frontend: Next.js 15 (App Router), React Server Components, TypeScript, Tailwind CSS

Backend: Prisma ORM, PostgreSQL, Next.js Server Actions

Auth: NextAuth (email/password)

Payments: Stripe (in progress)


***Key Features

Authentication: Secure signup/login with bcrypt, protected routes, and session handling.

User Dashboard: Responsive view of balance, transactions, active plans, and quick actions.

Transactions: Full CRUD, responsive tables with pagination, mobile-friendly card view, filtering support.

Savings & Billing Flow: Multi-step plan selection with fullscreen Billing Modal and reusable modal logic.

Reusable Modals: Pricing, Billing, Modify Table, and DataTableSettings, preserving design and overlay behavior.

Database Modeling: Prisma models for User, Transaction, Plans, Billing, with future modules (wallet, investments, notifications).

Responsive Design

Mobile-friendly card views

Large-screen tables with adaptive pagination


***Developer Experience

Modern /app directory

Typed server actions

Prisma migrations & seed scripts

Reusable UI components (forms, tables, modals)


***Upcoming Features

Wallet system, Stripe payments, admin dashboard, advanced analytics, notifications, and PWA support.




This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
