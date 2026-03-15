import { format, subDays } from "date-fns";

/** Mock stats for today: completed vs total (for Radial chart). */
export function getMockTodayStats(): {
  completedToday: number;
  totalToday: number;
} {
  return {
    completedToday: 5,
    totalToday: 8,
  };
}

/** One day's aggregate for the Area chart. */
export type DailyStats = {
  date: string;
  total: number;
  completed: number;
  incomplete: number;
};

/** Mock todos for BreakdownCard (by label). Returns minimal todo-like items with label for pie chart. */
export function getMockBreakdownTodos(): Array<{
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date | null;
  dueDate?: Date | null;
  labelId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  label?: { name: string; color: string };
}> {
  const now = new Date();
  const labels: Array<{ name: string; color: string }> = [
    { name: "Work", color: "blue" },
    { name: "Personal", color: "green" },
    { name: "Shopping", color: "yellow" },
    { name: "No Label", color: "gray" },
  ];
  const todos: Array<{
    id: string;
    title: string;
    completed: boolean;
    completedAt?: Date | null;
    dueDate?: Date | null;
    labelId?: string | null;
    createdAt: Date;
    updatedAt: Date;
    label?: { name: string; color: string };
  }> = [];
  let i = 0;
  // Work: 5, Personal: 4, Shopping: 2, No Label: 3
  for (let w = 0; w < 5; w++)
    todos.push({
      id: `mock-${i++}`,
      title: `Work task ${w + 1}`,
      completed: w < 2,
      completedAt: w < 2 ? now : null,
      labelId: "l1",
      createdAt: now,
      updatedAt: now,
      label: labels[0],
    });
  for (let w = 0; w < 5; w++)
    todos.push({
      id: `mock-${i++}`,
      title: `Work task ${w + 1}`,
      completed: w < 2,
      completedAt:
        w < 1 ? undefined : [2, 3].includes(w) ? now : subDays(now, 1),
      dueDate: subDays(now, 1),
      labelId: "l1",
      createdAt: now,
      updatedAt: now,
      label: labels[0],
    });
  for (let p = 0; p < 4; p++)
    todos.push({
      id: `mock-${i++}`,
      title: `Personal task ${p + 1}`,
      completed: p < 1,
      labelId: "l2",
      createdAt: now,
      updatedAt: now,
      label: labels[1],
    });
  for (let n = 0; n < 3; n++)
    todos.push({
      id: `mock-${i++}`,
      title: `Unlabeled task ${n + 1}`,
      completed: n === 0,
      createdAt: now,
      updatedAt: now,
      label: undefined,
    });

  return todos;
}

/** Mock last 10 days: total, completed, incomplete per day (for Area chart). */
export function getMockDailyStats(): DailyStats[] {
  const today = new Date();
  const days = 5;

  // Cumulative by end of each day so total = completed + incomplete
  let total = 10;
  let completed = 6;

  return Array.from({ length: days }, (_, i) => {
    const date = subDays(today, days - 1 - i);
    const dateStr = format(date, "yyyy-MM-dd");

    total += 1 + (i % 2); // 1 or 2 new tasks per day
    completed += i === 0 ? 0 : 1 + (i % 2); // some completed each day
    const incomplete = Math.max(0, total - completed);
    const overDue = Math.max(0, total - completed);

    return {
      date: dateStr,
      total,
      completed,
      incomplete,
      overDue,
    };
  });
}
