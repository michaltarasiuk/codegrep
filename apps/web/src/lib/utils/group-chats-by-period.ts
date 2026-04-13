import { differenceInCalendarDays, isToday, isYesterday } from "date-fns";

const PERIOD_ORDER: TimePeriod[] = [
  "Today",
  "Yesterday",
  "Last 7 days",
  "Last 30 days",
  "Last year",
  "Older",
];

export function groupChatsByPeriod<T extends { updatedAt: Date }>(chats: T[]) {
  const groups = new Map<TimePeriod, T[]>();
  for (const chat of chats) {
    const period = getTimePeriod(chat.updatedAt);
    groups.set(period, [...getGroup(period), chat]);
  }
  return PERIOD_ORDER.map((period) => ({
    period,
    chats: getGroup(period),
  }));
  function getGroup(period: TimePeriod) {
    return groups.get(period) ?? [];
  }
}

type TimePeriod =
  | "Today"
  | "Yesterday"
  | "Last 7 days"
  | "Last 30 days"
  | "Last year"
  | "Older";

function getTimePeriod(date: Date): TimePeriod {
  if (isToday(date)) {
    return "Today";
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  const now = new Date();
  const daysDiff = differenceInCalendarDays(now, date);
  if (daysDiff <= 7) {
    return "Last 7 days";
  }
  if (daysDiff <= 30) {
    return "Last 30 days";
  }
  if (daysDiff <= 365) {
    return "Last year";
  }
  return "Older";
}
