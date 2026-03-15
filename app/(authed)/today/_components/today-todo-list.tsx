"use client";

import { endOfDay, startOfDay } from "date-fns";

import { TodoListByDateRange } from "../../_components/today-list-by-daterange";

export const TodayTodoList = () => {
  const start = startOfDay(new Date(0)); // soonest safe date
  const end = endOfDay(new Date()); // end of today
  return <TodoListByDateRange start={start} end={end} />;
};
