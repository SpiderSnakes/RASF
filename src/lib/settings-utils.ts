import { differenceInMinutes, startOfDay } from "date-fns";

export function canModifyForDate(
  date: Date,
  deadlineTime: string,
  now: Date = new Date()
): { canModify: boolean; reason?: string; timeLeft?: string } {
  const today = startOfDay(now);
  const targetDay = startOfDay(date);

  if (targetDay < today) {
    return { canModify: false, reason: "Date passée" };
  }

  if (targetDay > today) {
    return { canModify: true };
  }

  const [hours, minutes] = deadlineTime.split(":").map(Number);
  const deadline = new Date(today);
  deadline.setHours(hours, minutes, 0, 0);

  if (now >= deadline) {
    return {
      canModify: false,
      reason: `Heure limite dépassée (${deadlineTime})`,
    };
  }

  const minutesLeft = differenceInMinutes(deadline, now);
  const hoursLeft = Math.floor(minutesLeft / 60);
  const remainingMinutes = minutesLeft % 60;

  const timeLeft =
    hoursLeft > 0
      ? `${hoursLeft}h${remainingMinutes.toString().padStart(2, "0")}`
      : `${remainingMinutes} min`;

  return { canModify: true, timeLeft };
}

export function isOpenDay(date: Date, openDays: number[]): boolean {
  return openDays.includes(date.getDay());
}

