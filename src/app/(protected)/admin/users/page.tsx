"use client";

// =============================================================================
// Page Admin - Gestion des utilisateurs
// =============================================================================

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { CreateUserModal } from "@/components/admin/create-user-modal";
import { ImportUsersModal } from "@/components/admin/import-users-modal";
import { ExportButton } from "@/components/export/export-button";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  canteenAccountNumber: string | null;
  role: "AGENT" | "GESTIONNAIRE" | "ADMIN";
  status: "PENDING" | "ACTIVE" | "DISABLED";
  createdAt: string;
  lastLoginAt: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/users${search ? `?search=${search}` : ""}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setUsers(data.data || []);
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timeout);
  }, [fetchUsers]);

  const handleDisable = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir désactiver cet utilisateur ?")) return;

    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      fetchUsers();
    } catch (err) {
      setError("Erreur lors de la désactivation");
    }
  };

  const getRoleBadge = (role: string) => {
    const config: Record<string, { variant: "info" | "warning" | "danger"; label: string }> = {
      ADMIN: { variant: "danger", label: "Admin" },
      GESTIONNAIRE: { variant: "warning", label: "Gestionnaire" },
      AGENT: { variant: "info", label: "Agent" },
    };
    const { variant, label } = config[role] || { variant: "info", label: role };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "success" | "warning" | "default"; label: string }> = {
      ACTIVE: { variant: "success", label: "Actif" },
      PENDING: { variant: "warning", label: "En attente" },
      DISABLED: { variant: "default", label: "Désactivé" },
    };
    const { variant, label } = config[status] || { variant: "default", label: status };
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <>
      <PageHeader
        title="Gestion des utilisateurs"
        description="Créez et gérez les comptes des agents"
        actions={
          <div className="flex gap-2">
            <ExportButton
              options={[{ label: "Exporter tous les utilisateurs", url: "/api/export/users" }]}
              label="Export CSV"
            />
            <Button variant="outline" onClick={() => setShowImportModal(true)}>
              Import CSV
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              + Nouvel utilisateur
            </Button>
          </div>
        }
      />

      {/* Barre de recherche */}
      <div className="mb-6">
        <Input
          placeholder="Rechercher par nom, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Liste des utilisateurs */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Chargement...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucun utilisateur trouvé
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Nom
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      N° Compte
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                      Rôle
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                      Statut
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {user.lastName.toUpperCase()} {user.firstName}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {user.canteenAccountNumber || "-"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {user.status !== "DISABLED" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDisable(user.id)}
                          >
                            Désactiver
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de création */}
      {showCreateModal && (
        <CreateUserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchUsers();
          }}
        />
      )}

      {/* Modal d'import */}
      {showImportModal && (
        <ImportUsersModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            fetchUsers();
          }}
        />
      )}
    </>
  );
}

