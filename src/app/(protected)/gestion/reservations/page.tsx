import { parseISO } from "date-fns";
import { prisma } from "@/lib/db";
import { ReservationsClient } from "./reservations-client";

type Props = {
  searchParams?: Promise<{ date?: string }>;
};

export default async function ReservationsPage({ searchParams }: Props) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedDate = resolvedSearchParams?.date || new Date().toISOString().slice(0, 10);
  const parsedDate = parseISO(selectedDate);

  const reservationsData = await prisma.reservation.findMany({
    where: {
      date: parsedDate,
    },
    include: {
      user: true,
      starterOption: { select: { name: true } },
      mainOption: { select: { name: true } },
      dessertOption: { select: { name: true } },
    },
    orderBy: [{ consumptionMode: "asc" }, { user: { lastName: "asc" } }],
  });

  const reservations = reservationsData.map((r) => ({
    id: r.id,
    date: r.date.toISOString().slice(0, 10),
    consumptionMode: r.consumptionMode,
    status: r.status,
    user: {
      id: r.user.id,
      firstName: r.user.firstName,
      lastName: r.user.lastName,
      canteenAccountNumber: r.user.canteenAccountNumber,
    },
    starterOption: r.starterOption ? { name: r.starterOption.name } : null,
    mainOption: { name: r.mainOption.name },
    dessertOption: r.dessertOption ? { name: r.dessertOption.name } : null,
    updatedAt: r.updatedAt.toISOString(),
  }));

  return (
    <ReservationsClient
      initialDate={selectedDate}
      reservations={reservations}
    />
  );
}
