import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { startOfWeek, addDays, parseISO } from "date-fns";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardClient } from "./dashboard-client";

type Props = {
  searchParams?: { week?: string };
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

export default async function DashboardPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/login");
  }

  const weekStart = getWeekStart(searchParams?.week);
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const settings = await prisma.settings.findUnique({ where: { id: "global" } });
  const effectiveSettings = {
    reservationDeadline: settings?.reservationDeadline ?? "10:00",
    openDays: settings?.openDays ?? [1, 2, 3, 4, 5],
  };

  const menusData = await prisma.menu.findMany({
    where: {
      isPublished: true,
      date: {
        gte: weekDays[0],
        lte: weekDays[weekDays.length - 1],
      },
    },
    include: { options: true },
    orderBy: { date: "asc" },
  });

  const menus = menusData.map((m) => ({
    id: m.id,
    date: m.date.toISOString(),
    sideDishes: m.sideDishes,
    isPublished: m.isPublished,
    starters: m.options.filter((o) => o.courseType === "STARTER"),
    mains: m.options.filter((o) => o.courseType === "MAIN"),
    desserts: m.options.filter((o) => o.courseType === "DESSERT"),
  }));

  const reservationsData = await prisma.reservation.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: weekDays[0],
        lte: weekDays[weekDays.length - 1],
      },
    },
    include: {
      starterOption: true,
      mainOption: true,
      dessertOption: true,
    },
    orderBy: { date: "asc" },
  });

  const reservations = reservationsData.map((r) => ({
    id: r.id,
    date: r.date.toISOString(),
    consumptionMode: r.consumptionMode,
    starterOption: r.starterOption ? { id: r.starterOption.id, name: r.starterOption.name } : null,
    mainOption: { id: r.mainOption.id, name: r.mainOption.name },
    dessertOption: r.dessertOption ? { id: r.dessertOption.id, name: r.dessertOption.name } : null,
  }));

  return (
    <DashboardClient
      userId={session.user.id}
      userFirstName={session.user.firstName}
      weekStartISO={weekStart.toISOString()}
      menus={menus}
      reservations={reservations}
      settings={effectiveSettings}
    />
  );
}
