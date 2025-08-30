# Product Requirements Document (PRD)

## 1. Overview
A **Personal Financial Management (PFM) Web App** designed for single-user use. The app will be mobile-first, simple, and minimal. It allows the user to record income and expenses directly into a Supabase database. No login or authentication is required. The primary purpose is **quick and easy tracking of personal finances**.

## 2. Goals and Objectives
- Provide a **lightweight, mobile-first web app** for recording personal transactions.
- Focus on **speed and simplicity**: quick add flow with minimal input.
- Store data in **Supabase** for persistence and backup.
- Support **basic analytics** (monthly totals, income vs expense breakdown).
- Allow **data export** (CSV/JSON) for manual backup.

## 3. Key Features
### MVP Features
1. **Add Transaction**
   - Type: Income / Expense
   - Amount
   - Category (optional free text)
   - Note (optional)
   - Date (defaults to today)

2. **Transaction List**
   - Display latest transactions
   - Sorted by date (newest first)
   - Show: date, type, amount, category, note

3. **Basic Summary View**
   - Show total income, total expense, and net balance for current month.

4. **Data Export**
   - Export all transactions as CSV or JSON.

### Future Enhancements (Phase 2+)
- Category management (predefined + custom icons/colors)
- Monthly budgets per category
- Recurring transactions
- Import from CSV/JSON
- PWA installation with offline support
- Transfer/restore data across devices

## 4. Non-Goals
- No authentication/login system.
- No multi-user support.
- No advanced financial features (loans, investments, bank sync).

## 5. Target Platform
- Web App, optimized for **mobile browsers**.
- Can be extended later to PWA.

## 6. Technical Requirements
- **Frontend**: Next.js (React, TailwindCSS)
- **Backend**: Supabase (Postgres, Supabase-js SDK)
- **Database schema** (single table for MVP):

```sql
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('income','expense')),
  amount numeric(14,2) not null,
  category text,
  note text,
  occurred_at date not null,
  created_at timestamptz not null default now()
);
```

- **RLS**: Disabled (private single-user use only)
- **Deployment**: Vercel (frontend), Supabase (backend)

## 7. User Stories
1. As a user, I want to **quickly record an expense** so I can keep track of my spending.
2. As a user, I want to **see my recent transactions** so I can recall what I’ve logged.
3. As a user, I want to **see my monthly total income and expenses** so I can understand my financial balance.
4. As a user, I want to **export my data** so I can back it up manually.

## 8. Success Metrics
- Able to add a transaction in **under 5 seconds**.
- No more than **3 clicks/taps** to log a basic transaction.
- Accurate storage and retrieval of transaction data.
- Successful export functionality tested with >1000 transactions.

## 9. Risks and Mitigations
- **Risk**: Anyone with Supabase anon key could write data.  
  **Mitigation**: App is for personal use; project is not shared publicly.
- **Risk**: Data loss if Supabase project is deleted.  
  **Mitigation**: Provide export option for backup.
- **Risk**: Mobile UX too slow/clunky.  
  **Mitigation**: Keep forms minimal, default values (date=today).

## 10. Future Considerations
- Upgrade security with simple auth if multi-device or sharing is needed.
- Add visualization charts (pie chart by category, bar chart by month).
- Integrate with third-party APIs (Google Sheets sync, Plaid, etc.) if scope grows.

