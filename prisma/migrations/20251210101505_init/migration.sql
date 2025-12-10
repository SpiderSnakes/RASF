-- CreateEnum
CREATE TYPE "Role" AS ENUM ('AGENT', 'GESTIONNAIRE', 'ADMIN');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "ConsumptionMode" AS ENUM ('SUR_PLACE', 'A_EMPORTER');

-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('STARTER', 'MAIN', 'DESSERT');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('BOOKED', 'SERVED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('RESERVATION_CREATED', 'RESERVATION_MODIFIED', 'RESERVATION_CANCELLED', 'RESERVATION_SERVED', 'RESERVATION_NO_SHOW', 'ACCOUNT_CREATED', 'ACCOUNT_ACTIVATED', 'ACCOUNT_DISABLED', 'MENU_CREATED', 'MENU_MODIFIED', 'MENU_DELETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "passwordHash" TEXT,
    "canteenAccountNumber" TEXT,
    "role" "Role" NOT NULL DEFAULT 'AGENT',
    "status" "AccountStatus" NOT NULL DEFAULT 'PENDING',
    "activationToken" TEXT,
    "activationExpires" TIMESTAMP(3),
    "resetToken" TEXT,
    "resetTokenExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "sideDishes" TEXT,
    "notes" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuOption" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "courseType" "CourseType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "maxCapacity" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "starterOptionId" TEXT,
    "mainOptionId" TEXT NOT NULL,
    "dessertOptionId" TEXT,
    "consumptionMode" "ConsumptionMode" NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'BOOKED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "reservationDeadline" TEXT NOT NULL DEFAULT '10:00',
    "openDays" INTEGER[] DEFAULT ARRAY[1, 2, 3, 4, 5]::INTEGER[],
    "weeksInAdvance" INTEGER NOT NULL DEFAULT 2,
    "maxDailyCapacity" INTEGER,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "operationalTrackingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "performedById" TEXT,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_canteenAccountNumber_key" ON "User"("canteenAccountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_activationToken_key" ON "User"("activationToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_canteenAccountNumber_idx" ON "User"("canteenAccountNumber");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_date_key" ON "Menu"("date");

-- CreateIndex
CREATE INDEX "Menu_date_idx" ON "Menu"("date");

-- CreateIndex
CREATE INDEX "Menu_isPublished_idx" ON "Menu"("isPublished");

-- CreateIndex
CREATE INDEX "MenuOption_menuId_idx" ON "MenuOption"("menuId");

-- CreateIndex
CREATE INDEX "MenuOption_courseType_idx" ON "MenuOption"("courseType");

-- CreateIndex
CREATE INDEX "MenuOption_menuId_courseType_idx" ON "MenuOption"("menuId", "courseType");

-- CreateIndex
CREATE INDEX "Reservation_date_idx" ON "Reservation"("date");

-- CreateIndex
CREATE INDEX "Reservation_userId_idx" ON "Reservation"("userId");

-- CreateIndex
CREATE INDEX "Reservation_status_idx" ON "Reservation"("status");

-- CreateIndex
CREATE INDEX "Reservation_mainOptionId_idx" ON "Reservation"("mainOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_userId_date_key" ON "Reservation"("userId", "date");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_performedById_idx" ON "AuditLog"("performedById");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "MenuOption" ADD CONSTRAINT "MenuOption_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_starterOptionId_fkey" FOREIGN KEY ("starterOptionId") REFERENCES "MenuOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_mainOptionId_fkey" FOREIGN KEY ("mainOptionId") REFERENCES "MenuOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_dessertOptionId_fkey" FOREIGN KEY ("dessertOptionId") REFERENCES "MenuOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
