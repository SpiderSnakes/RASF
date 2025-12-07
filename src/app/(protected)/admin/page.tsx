"use client";

// =============================================================================
// Page Admin - Tableau de bord
// =============================================================================

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  disabledUsers: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        const users = data.data || [];
        setStats({
          totalUsers: users.length,
          activeUsers: users.filter((u: { status: string }) => u.status === "ACTIVE").length,
          pendingUsers: users.filter((u: { status: string }) => u.status === "PENDING").length,
          disabledUsers: users.filter((u: { status: string }) => u.status === "DISABLED").length,
        });
      } catch (err) {
        setError("Erreur lors du chargement des statistiques");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <PageHeader
        title="Administration"
        description="Gestion des utilisateurs et paramètres de l'application"
      />

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Statistiques utilisateurs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-900">
              {loading ? "..." : stats?.totalUsers}
            </div>
            <div className="text-sm text-gray-500">Total utilisateurs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {loading ? "..." : stats?.activeUsers}
            </div>
            <div className="text-sm text-gray-500">Actifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-amber-600">
              {loading ? "..." : stats?.pendingUsers}
            </div>
            <div className="text-sm text-gray-500">En attente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-400">
              {loading ? "..." : stats?.disabledUsers}
            </div>
            <div className="text-sm text-gray-500">Désactivés</div>
          </CardContent>
        </Card>
      </div>

      {/* Liens rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestion des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Créez des comptes agents, gérez les rôles et les accès.
            </p>
            <Link href="/admin/users">
              <Button>Gérer les utilisateurs</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paramètres globaux</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Configurez l&apos;heure limite, les jours d&apos;ouverture et autres paramètres.
            </p>
            <Link href="/admin/settings">
              <Button variant="outline">Paramètres</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

