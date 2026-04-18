import { differenceInCalendarDays, isToday, isYesterday } from "date-fns";

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
  let now = new Date();
  let diff = differenceInCalendarDays(now, date);
  if (diff <= 7) {
    return "Last 7 days";
  }
  if (diff <= 30) {
    return "Last 30 days";
  }
  if (diff <= 365) {
    return "Last year";
  }
  return "Older";
}

let PERIOD_ORDER: TimePeriod[] = [
  "Today",
  "Yesterday",
  "Last 7 days",
  "Last 30 days",
  "Last year",
  "Older",
];

export function groupChatsByPeriod<T extends { updatedAt: Date }>(chats: T[]) {
  let groups = new Map<TimePeriod, T[]>();
  for (let chat of chats) {
    let period = getTimePeriod(chat.updatedAt);
    groups.set(period, [...(groups.get(period) ?? []), chat]);
  }
  return PERIOD_ORDER.map((period) => ({
    period,
    chats: groups.get(period) ?? [],
  }));
}
