# Porket - Personal Finance Tracker

A simple, mobile-first web application for tracking personal income and expenses. Built with Next.js 15, React 19, and Supabase.

## Features

### MVP Features ✅
- **Add Transactions**: Record income/expense with amount, category, note, and date
- **Transaction List**: View recent transactions sorted by date
- **Monthly Summary**: See total income, expenses, and net balance for current month
- **Data Export**: Export all transactions as CSV or JSON for backup

### Key Characteristics
- **Mobile-first design** - Optimized for mobile browsers
- **No authentication** - Single-user personal use
- **Quick entry** - Under 5 seconds to add a transaction
- **Minimal UI** - Clean, distraction-free interface

## Setup Instructions

### 1. Database Setup
You need to create the transactions table in your Supabase database. Run this SQL in your Supabase SQL editor:

```sql
-- Create transactions table for Personal Financial Management app
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('income','expense')),
  amount numeric(14,2) not null,
  category text,
  note text,
  occurred_at date not null,
  created_at timestamptz not null default now()
);

-- Create index for better performance on date queries
create index if not exists idx_transactions_occurred_at on public.transactions (occurred_at desc);
create index if not exists idx_transactions_created_at on public.transactions (created_at desc);

-- Since this is a single-user app with no authentication, we disable RLS
alter table public.transactions disable row level security;
```

### 2. Environment Variables
Make sure your `.env.local` file contains:

```
NEXT_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install and Run
```bash
npm install
npm run dev
```

Visit http://localhost:3000 to start using the app.

## Usage

### Quick Start
1. **Add your first transaction** - Select Income/Expense, enter amount, optionally add category and note
2. **View your summary** - Monthly totals are automatically calculated
3. **Browse transactions** - Recent transactions appear below the form
4. **Export data** - Use the export buttons to backup your data

### Tips for Fast Entry
- Date defaults to today
- Category and note are optional
- Form resets after each transaction
- Mobile keyboard optimized for numbers

## Technical Details

### Architecture
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4 with dark mode support
- **Database**: Supabase (PostgreSQL)
- **Build**: Turbopack for fast compilation

### File Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Main app page with all components
│   └── globals.css         # Global styles and theme variables
├── components/
│   ├── transaction-form.tsx    # Form for adding transactions
│   ├── transaction-list.tsx    # List of recent transactions
│   ├── monthly-summary.tsx     # Monthly income/expense summary
│   └── data-export.tsx         # CSV/JSON export functionality
└── lib/
    └── supabase.ts         # Supabase client and types
```

### Security Note
This app is designed for single-user personal use without authentication. The Supabase anon key allows direct database access. Do not share this project publicly or use it in production without implementing proper authentication and row-level security.

## Future Enhancements
- Category management with icons/colors
- Monthly budgets per category  
- Recurring transactions
- PWA with offline support
- Data visualization (charts)
- Import functionality