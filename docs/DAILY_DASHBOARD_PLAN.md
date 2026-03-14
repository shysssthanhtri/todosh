# Daily Dashboard: Radial, Pie, Area Charts

## Approach: UI first with mock data

**Phase 1 (first):** Build the dashboard UI and all three charts using **mock data for the last 10 days** so you can see and refine the UI before any backend work.

**Phase 2 (later):** Replace mock data with real API and IndexedDB when ready.

**Route:** The dashboard is at **`/dashboard`** (e.g. `app/(authed)/dashboard/page.tsx`).

---

## 1. Phase 1 — UI first: mock data for 10 days

### Mock data to generate

Create a **mock dashboard module** (e.g. `lib/dashboard-mock.ts` or `app/(authed)/dashboard/mock-data.ts`) that exports:

**A. Today (for Radial + Pie)**

- **Radial:** `completedToday: number`, `totalToday: number`  
  Example: `{ completedToday: 5, totalToday: 8 }`.
- **Pie:** List of today's todos by label: `{ labelId: string | null, labelName: string, count: number }[]`  
  Example: `[{ labelId: "1", labelName: "Work", count: 3 }, { labelId: null, labelName: "No label", count: 2 }]`.

**B. Last 10 days (for Area chart)**

- One entry per day for the last 10 days (including today).
- Each entry: `{ date: string (YYYY-MM-DD), total: number, completed: number, incomplete: number }`.
- **total** = cumulative "open + completed" at end of day (e.g. total created so far).
- **completed** = cumulative completed by end of that day.
- **incomplete** = total − completed at end of that day.

Example for 10 days (vary numbers so the chart looks realistic):

```ts
// Example shape — actual mock can use subDays from date-fns to generate dates
[
  { date: "2025-03-05", total: 12, completed: 8, incomplete: 4 },
  { date: "2025-03-06", total: 15, completed: 10, incomplete: 5 },
  // ... through today
  { date: "2025-03-14", total: 28, completed: 22, incomplete: 6 },
]
```

Use **date-fns** (`subDays`, `startOfDay`, `format`) to generate the last 10 days' dates and fill with plausible counts so the Area chart shows a clear trend.

### Charts to implement (Phase 1)

| Widget | shadcn block / component | Data (mock) |
|--------|---------------------------|-------------|
| **Radial** | `chart` + Recharts radial (or block `chart-radial-simple`) | `completedToday`, `totalToday` from mock |
| **Pie** | `chart` + Recharts pie (or block `chart-pie-simple`) | Today-by-label array from mock |
| **Area** | `chart` + Recharts area (or block `chart-area-stacked`) | Last-10-days array (total, completed, incomplete) from mock |

Install once (if not already): `npx shadcn@latest add chart`. Then implement the three chart UIs on the dashboard page, each reading from the mock module. No API or IndexedDB calls in Phase 1.

---

## 2. Chart components reference

| Widget | shadcn block | Purpose |
|--------|----------------|----------|
| **Radial** | `chart-radial-simple` or `chart-radial-label` | Completion today: e.g. 5/8 tasks. |
| **Pie** | `chart-pie-simple` or `chart-pie-donut` + `chart-pie-legend` | Share of today's todos per label. |
| **Area** | `chart-area-stacked` or `chart-area-default` (multi-series) | Total / completed / incomplete per day, last 10 days. |

---

## 3. Data definitions (for Phase 2)

### "Today"

- **Today's todos** = incomplete with `dueDate` = today **or** completed with `completedAt` = today.

### Radial (today completion)

- **Completed today:** count where `completedAt` is within today.
- **Total today:** incomplete due today + completed today.
- **Progress:** completed today / total today.

### Pie (by label today)

- **Input:** Today's todos grouped by `labelId` (use "No label" for null).
- **Output:** One slice per label with count (and optional percentage).

### Area (last 10 days)

- **Per day:** `created_count`, `completed_count` from API; then **total** = cumulative created, **completed** = cumulative completed, **incomplete** = total − completed.

---

## 4. Implementation steps

Follow in order. Route: **`/dashboard`** → `app/(authed)/dashboard/page.tsx`.

### Step 1: Ensure chart component is installed

- Run: `npx shadcn@latest add chart` (if not already added).
- Confirm `components/ui/chart.tsx` exists and Recharts is in `package.json`.

### Step 2: Create mock data module

- Add file: `lib/dashboard-mock.ts` (or `app/(authed)/dashboard/mock-data.ts`).
- Use `date-fns`: `format`, `subDays`, `startOfDay` (or `endOfDay`) to build the last 10 days’ dates.
- Export **today stats** for Radial + Pie:
  - `getMockTodayStats()` (or a constant) → `{ completedToday: number, totalToday: number }`.
  - `getMockTodayByLabel()` (or a constant) → `{ labelId: string | null, labelName: string, count: number }[]`.
- Export **last 10 days** for Area:
  - `getMockDailyStats()` (or a constant) → `{ date: string, total: number, completed: number, incomplete: number }[]`.
- Use plausible numbers so charts look realistic (e.g. total = completed + incomplete, cumulative growth over 10 days).

### Step 3: Dashboard page layout

- In `app/(authed)/dashboard/page.tsx`:
  - Add a page title and optional description.
  - Create a grid or flex layout with three sections: one for Radial, one for Pie, one for Area.
  - Use existing `Card` (and `CardHeader` / `CardTitle` / `CardContent`) from `@/components/ui/card` for each chart.

### Step 4: Radial chart (today completion)

- In the first card, implement a **radial** chart (Recharts `RadialBarChart` + `RadialBar`, or copy from shadcn block `chart-radial-simple`).
- Use `ChartContainer` and `ChartConfig` from `@/components/ui/chart`.
- Data: pass `completedToday` and `totalToday` from the mock module (e.g. value = completedToday, max = totalToday, or a percentage).
- Label: e.g. “Today’s progress” or “Completed today”.

### Step 5: Pie chart (today by label)

- In the second card, implement a **pie** chart (Recharts `PieChart` + `Pie` + `Cell`, optional `Legend`).
- Use `ChartContainer` and `ChartConfig` from `@/components/ui/chart`.
- Data: pass the today-by-label array from the mock module; map `labelName` to label and `count` to value.
- Label: e.g. “Todos by label (today)”.

### Step 6: Area chart (last 10 days)

- In the third card, implement an **area** chart (Recharts `AreaChart` + `Area` for total, completed, incomplete).
- Use `ChartContainer`, `ChartConfig`, and optionally `ChartTooltip` / `ChartTooltipContent` from `@/components/ui/chart`.
- Data: pass the 10-day array from the mock module; use `date` as x-axis and `total`, `completed`, `incomplete` as series.
- Label: e.g. “Last 10 days” or “Total / completed / incomplete per day”.

### Step 7: Wire mock data and verify

- Import mock getters/constants in the dashboard page and pass them into each chart.
- Ensure the page is a client component if charts use hooks (add `"use client"` at top of `page.tsx` if needed).
- Open `/dashboard` and confirm all three charts render with the mock data.

### Step 8 (later): Replace mock with real data

- When ready: add API or use IndexedDB, and replace mock imports with real data fetching in the same dashboard page.
