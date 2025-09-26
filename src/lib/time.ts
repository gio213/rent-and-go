import { addDays, startOfDay } from "date-fns";

export const computeReminderAt = (endDate: Date) => {
  const reminderDate = startOfDay(addDays(endDate, -1)); // 1 day before endDate
  return reminderDate;
};
