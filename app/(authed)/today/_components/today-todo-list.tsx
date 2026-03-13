"use client";

import { endOfDay, startOfDay } from "date-fns";

import { TodoListByDateRange } from "../../_components/today-list-by-daterange";

export const TodayTodoList = () => {
  return (
    <TodoListByDateRange
      start={startOfDay(new Date())}
      end={endOfDay(new Date())}
    />
  );
};
