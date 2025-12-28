'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { toast } from 'react-hot-toast';

export default function UserManager() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/users/all', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const updateRole = async (userId: string, role: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Role updated!');
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        toast.success('User deleted!');
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">User Management</h2>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-4 py-4">{user.name}</td>
                    <td className="px-4 py-4">{user.email}</td>
                    <td className="px-4 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user._id, e.target.value)}
                        className="px-2 py-1 border rounded"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
