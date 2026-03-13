"use client";

import { endOfDay, startOfDay, subDays } from "date-fns";

import { TodoListByDateRange } from "../../_components/today-list-by-daterange";

export const OverdueTodoList = () => {
  const start = startOfDay(new Date(0)); // soonest safe date
  const end = endOfDay(subDays(new Date(), 1)); // end of yesterday

  return <TodoListByDateRange start={start} end={end} />;
};
