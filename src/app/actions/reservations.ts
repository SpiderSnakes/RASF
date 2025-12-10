 "use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ReservationStatus, ConsumptionMode } from "@prisma/client";
import { parseISO, startOfDay } from "date-fns";

const RESERVATION_PATHS = ["/dashboard", "/gestion/reservations"];

async function revalidateReservations() {
  for (const path of RESERVATION_PATHS) {
    revalidatePath(path);
  }
}

type UpsertReservationInput = {
  reservationId?: string;
  userId: string;
  date: string; // yyyy-MM-dd
  starterOptionId?: string | null;
  mainOptionId: string;
  dessertOptionId?: string | null;
  consumptionMode: ConsumptionMode;
};

export async function upsertReservationAction(input: UpsertReservationInput) {
  const { reservationId, userId, date, starterOptionId, mainOptionId, dessertOptionId, consumptionMode } = input;
  const parsedDate = startOfDay(parseISO(date));

  if (!mainOptionId) throw new Error("Un plat principal est requis");

  if (reservationId) {
    await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        date: parsedDate,
        starterOptionId: starterOptionId || null,
        mainOptionId,
        dessertOptionId: dessertOptionId || null,
        consumptionMode,
      },
    });
  } else {
    await prisma.reservation.upsert({
      where: {
        userId_date: { userId, date: parsedDate },
      },
      update: {
        starterOptionId: starterOptionId || null,
        mainOptionId,
        dessertOptionId: dessertOptionId || null,
        consumptionMode,
      },
      create: {
        userId,
        date: parsedDate,
        starterOptionId: starterOptionId || null,
        mainOptionId,
        dessertOptionId: dessertOptionId || null,
        consumptionMode,
        status: ReservationStatus.BOOKED,
      },
    });
  }

  await revalidateReservations();
  return { success: true };
}

export async function updateReservationStatusAction(reservationId: string, status: ReservationStatus) {
  await prisma.reservation.update({
    where: { id: reservationId },
    data: { status },
  });
  await revalidateReservations();
  return { success: true };
}

export async function deleteReservationAction(reservationId: string) {
  await prisma.reservation.delete({ where: { id: reservationId } });
  await revalidateReservations();
  return { success: true };
}

