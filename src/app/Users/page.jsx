'use client';

import { MainLayout } from "@/components/layout/MainLayout";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Key, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import usersApi from "@/lib/api/users";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";


export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [isAdmin, setIsAdmin] = useState(null);
  const router = useRouter();

  useEffect(() => {
    authAPI.getUser().then(res => {
      if (res && res.data && res.data.user) {
        setIsAdmin(res.data.user.is_admin);
        if (!res.data.user.is_admin) {
          router.replace("/Index");
        }
      }
    });
  }, [router]);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const response = await usersApi.getUsers();
      // Defensive: ensure users is always an array
      const data = response?.data?.data || response?.data || [];
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (Array.isArray(response?.data)) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
      setLoading(false);
    } catch (error) {
      setUsers([]);
      setLoading(false);
      setFetchError(
        error?.message || error?.error || "فشل في جلب المستخدمين. حاول مرة أخرى."
      );
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    password: ""
  });

  // Add user function
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (newUser.name && newUser.email && newUser.role && newUser.password) {
      try {
        await usersApi.createUser({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role
        });
        
        console.log("User added successfully");
        
        fetchUsers();
        setNewUser({ name: "", email: "", role: "", password: "" });
        setShowAddForm(false);
      } catch (error) {
        console.error(error.message || "Failed to add user");
      }
    }
  };

  // Toggle form function
  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    setNewUser({ name: "", email: "", role: "", password: "" });
  };

  // Delete function
  const handleDelete = async (userId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await usersApi.deleteUser(userId);
        console.log("User deleted successfully");
        fetchUsers();
      } catch (error) {
        console.error(error.message || "Failed to delete user");
      }
    }
  };

  // Edit function
  const handleEdit = async (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const newName = prompt("Modifier le nom d'utilisateur :", user.name);
      const newEmail = prompt("Modifier l'email :", user.email);
      const newRole = prompt("Modifier le rôle :", user.role);
      if (newName && newEmail && newRole) {
        try {
          await usersApi.updateUser(userId, {
            name: newName,
            email: newEmail,
            role: newRole
          });
          
          console.log("User updated successfully");
          
          fetchUsers();
        } catch (error) {
          console.error(error.message || "Failed to update user");
        }
      }
    }
  };

  // Toggle user active status
  const handleToggleStatus = async (userId) => {
    try {
      await usersApi.toggleStatus(userId);
      fetchUsers();
    } catch (error) {
      console.error(error.message || "Failed to toggle user status");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
          <Button className="gap-2" onClick={toggleAddForm}>
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showAddForm ? "Annuler" : "Ajouter un nouvel utilisateur"}
          </Button>
        </div>

        {/* Error message for fetching users */}
        {fetchError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            <span>خطأ: {fetchError}</span>
          </div>
        )}

        {/* Add User Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un nouvel utilisateur</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom d'utilisateur</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Entrez le nom d'utilisateur"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Entrez l'email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <select
                      id="role"
                      className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      required
                    >
                      <option value="" disabled>اختر الدور</option>
                      <option value="مدير">مدير</option>
                      <option value="موظف مبيعات">موظف مبيعات</option>
                      <option value="أمين مخزن">أمين مخزن</option>
                      <option value="محاسب">محاسب</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Entrez le mot de passe"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Ajouter l'utilisateur</Button>
                  <Button type="button" variant="outline" onClick={toggleAddForm}>
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom d'utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleStatus(user.id)}
                    >
                      <Key className={user.is_active ? "text-green-600" : "text-red-600"} />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="icon" onClick={() => handleEdit(user.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
