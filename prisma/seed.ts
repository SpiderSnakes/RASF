// =============================================================================
// Script de seed pour la base de données RASF
// =============================================================================
// Usage: npm run db:seed
// =============================================================================

import { PrismaClient, Role, AccountStatus, CourseType, ConsumptionMode } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seeding...");

  // ---------------------------------------------------------------------------
  // 1. Créer les paramètres globaux
  // ---------------------------------------------------------------------------
  console.log("⚙️  Création des paramètres globaux...");
  
  await prisma.settings.upsert({
    where: { id: "global" },
    update: {},
    create: {
      id: "global",
      reservationDeadline: "10:00",
      openDays: [1, 2, 3, 4, 5], // Lundi à Vendredi
      weeksInAdvance: 2,
      notificationsEnabled: false,
      operationalTrackingEnabled: true,
    },
  });

  // ---------------------------------------------------------------------------
  // 2. Créer un administrateur
  // ---------------------------------------------------------------------------
  console.log("👤 Création de l'administrateur...");
  
  const adminPassword = await bcrypt.hash("admin123", 12);
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@rasf.local" },
    update: {},
    create: {
      email: "admin@rasf.local",
      firstName: "Admin",
      lastName: "RASF",
      passwordHash: adminPassword,
      canteenAccountNumber: "ADMIN001",
      role: Role.ADMIN,
      status: AccountStatus.ACTIVE,
    },
  });

  // ---------------------------------------------------------------------------
  // 3. Créer un gestionnaire RASF
  // ---------------------------------------------------------------------------
  console.log("👤 Création du gestionnaire...");
  
  const gestionnairePassword = await bcrypt.hash("gestionnaire123", 12);
  
  const gestionnaire = await prisma.user.upsert({
    where: { email: "gestionnaire@rasf.local" },
    update: {},
    create: {
      email: "gestionnaire@rasf.local",
      firstName: "Marie",
      lastName: "Dupont",
      passwordHash: gestionnairePassword,
      canteenAccountNumber: "GEST001",
      role: Role.GESTIONNAIRE,
      status: AccountStatus.ACTIVE,
    },
  });

  // ---------------------------------------------------------------------------
  // 4. Créer quelques agents de test
  // ---------------------------------------------------------------------------
  console.log("👥 Création des agents de test...");
  
  const agentPassword = await bcrypt.hash("agent123", 12);
  
  const agents = await Promise.all([
    prisma.user.upsert({
      where: { email: "agent1@rasf.local" },
      update: {},
      create: {
        email: "agent1@rasf.local",
        firstName: "Jean",
        lastName: "Martin",
        passwordHash: agentPassword,
        canteenAccountNumber: "AGT001",
        role: Role.AGENT,
        status: AccountStatus.ACTIVE,
      },
    }),
    prisma.user.upsert({
      where: { email: "agent2@rasf.local" },
      update: {},
      create: {
        email: "agent2@rasf.local",
        firstName: "Sophie",
        lastName: "Bernard",
        passwordHash: agentPassword,
        canteenAccountNumber: "AGT002",
        role: Role.AGENT,
        status: AccountStatus.ACTIVE,
      },
    }),
    prisma.user.upsert({
      where: { email: "agent3@rasf.local" },
      update: {},
      create: {
        email: "agent3@rasf.local",
        firstName: "Pierre",
        lastName: "Leroy",
        passwordHash: agentPassword,
        canteenAccountNumber: "AGT003",
        role: Role.AGENT,
        status: AccountStatus.ACTIVE,
      },
    }),
  ]);

  // ---------------------------------------------------------------------------
  // 5. Créer des menus pour la semaine en cours
  // ---------------------------------------------------------------------------
  console.log("🍽️  Création des menus de la semaine...");
  
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1); // Lundi de cette semaine
  
  const menuData = [
    {
      dayOffset: 0, // Lundi
      sideDishes: "Riz créole, Grains rouges, Salade verte",
      starters: ["Salade de concombres", "Accras de morue"],
      mains: ["Poulet boucané", "Poisson grillé"],
      desserts: ["Flan coco", "Salade de fruits"],
    },
    {
      dayOffset: 1, // Mardi
      sideDishes: "Purée de pommes de terre, Légumes vapeur",
      starters: ["Soupe de légumes"],
      mains: ["Bœuf bourguignon", "Filet de cabillaud"],
      desserts: ["Tarte aux pommes", "Yaourt"],
    },
    {
      dayOffset: 2, // Mercredi
      sideDishes: "Pâtes, Haricots verts",
      starters: ["Salade niçoise", "Terrine de légumes"],
      mains: ["Escalope de dinde", "Saumon grillé", "Omelette végétarienne"],
      desserts: ["Mousse au chocolat"],
    },
    {
      dayOffset: 3, // Jeudi
      sideDishes: "Riz, Lentilles",
      starters: ["Crudités variées"],
      mains: ["Colombo de porc", "Thon à la créole"],
      desserts: ["Banane flambée", "Fromage blanc"],
    },
    {
      dayOffset: 4, // Vendredi
      sideDishes: "Gratin dauphinois, Ratatouille",
      starters: ["Salade de chèvre chaud", "Boudin créole"],
      mains: ["Entrecôte grillée", "Daurade au four"],
      desserts: ["Crème brûlée", "Glace vanille"],
    },
  ];

  for (const data of menuData) {
    const menuDate = new Date(monday);
    menuDate.setDate(monday.getDate() + data.dayOffset);
    
    // Vérifier si le menu existe déjà
    const existingMenu = await prisma.menu.findUnique({
      where: { date: menuDate },
    });
    
    if (!existingMenu) {
      const menu = await prisma.menu.create({
        data: {
          date: menuDate,
          sideDishes: data.sideDishes,
          isPublished: true,
          options: {
            create: [
              // Entrées
              ...data.starters.map((name, index) => ({
                courseType: CourseType.STARTER,
                name,
                sortOrder: index,
              })),
              // Plats principaux
              ...data.mains.map((name, index) => ({
                courseType: CourseType.MAIN,
                name,
                sortOrder: index,
              })),
              // Desserts
              ...data.desserts.map((name, index) => ({
                courseType: CourseType.DESSERT,
                name,
                sortOrder: index,
              })),
            ],
          },
        },
      });
      
      console.log(`   ✅ Menu créé pour ${menuDate.toLocaleDateString("fr-FR")}`);
    }
  }

  // ---------------------------------------------------------------------------
  // 6. Créer quelques réservations de test
  // ---------------------------------------------------------------------------
  console.log("📝 Création de réservations de test...");
  
  // Récupérer le menu de demain (ou du prochain jour ouvré)
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const menuTomorrow = await prisma.menu.findFirst({
    where: {
      date: {
        gte: tomorrow,
      },
      isPublished: true,
    },
    include: {
      options: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  if (menuTomorrow) {
    const mainOptions = menuTomorrow.options.filter(o => o.courseType === CourseType.MAIN);
    const starterOptions = menuTomorrow.options.filter(o => o.courseType === CourseType.STARTER);
    const dessertOptions = menuTomorrow.options.filter(o => o.courseType === CourseType.DESSERT);

    if (mainOptions.length > 0) {
      // Réservation pour agent1
      await prisma.reservation.upsert({
        where: {
          userId_date: {
            userId: agents[0].id,
            date: menuTomorrow.date,
          },
        },
        update: {},
        create: {
          userId: agents[0].id,
          date: menuTomorrow.date,
          mainOptionId: mainOptions[0].id,
          starterOptionId: starterOptions[0]?.id,
          dessertOptionId: dessertOptions[0]?.id,
          consumptionMode: ConsumptionMode.SUR_PLACE,
        },
      });

      // Réservation pour agent2
      await prisma.reservation.upsert({
        where: {
          userId_date: {
            userId: agents[1].id,
            date: menuTomorrow.date,
          },
        },
        update: {},
        create: {
          userId: agents[1].id,
          date: menuTomorrow.date,
          mainOptionId: mainOptions[mainOptions.length > 1 ? 1 : 0].id,
          starterOptionId: starterOptions[0]?.id,
          consumptionMode: ConsumptionMode.A_EMPORTER,
        },
      });

      console.log(`   ✅ Réservations créées pour ${menuTomorrow.date.toLocaleDateString("fr-FR")}`);
    }
  }

  console.log("\n✅ Seeding terminé avec succès!");
  console.log("\n📋 Comptes de test créés:");
  console.log("   - Admin: admin@rasf.local / admin123");
  console.log("   - Gestionnaire: gestionnaire@rasf.local / gestionnaire123");
  console.log("   - Agents: agent1@rasf.local, agent2@rasf.local, agent3@rasf.local / agent123");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

