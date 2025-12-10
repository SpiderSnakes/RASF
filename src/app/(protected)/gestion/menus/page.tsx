import { startOfWeek, addDays, parseISO } from "date-fns";
import { prisma } from "@/lib/db";
import { MenusClient, MenuWithCourses } from "./menus-client";

type Props = {
  searchParams?: Promise<{ week?: string }>;
};

function getWeekStart(searchWeek?: string) {
  if (searchWeek) {
    const parsed = parseISO(searchWeek);
    if (!isNaN(parsed.getTime())) {
      return startOfWeek(parsed, { weekStartsOn: 1 });
    }
  }
  return startOfWeek(new Date(), { weekStartsOn: 1 });
}

export default async function MenusPage({ searchParams }: Props) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const weekStart = getWeekStart(resolvedSearchParams?.week);
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const menusData = await prisma.menu.findMany({
    where: {
      date: {
        gte: weekDays[0],
        lte: weekDays[weekDays.length - 1],
      },
    },
    include: { options: true },
    orderBy: { date: "asc" },
  });

  const menus: MenuWithCourses[] = menusData.map((m) => ({
    id: m.id,
    date: m.date.toISOString(),
    sideDishes: m.sideDishes,
    notes: m.notes,
    isPublished: m.isPublished,
    starters: m.options.filter((o) => o.courseType === "STARTER"),
    mains: m.options.filter((o) => o.courseType === "MAIN"),
    desserts: m.options.filter((o) => o.courseType === "DESSERT"),
  }));

  return (
    <MenusClient
      weekStart={weekStart.toISOString()}
      weekDays={weekDays.map((d) => d.toISOString())}
      menus={menus}
    />
  );
}

