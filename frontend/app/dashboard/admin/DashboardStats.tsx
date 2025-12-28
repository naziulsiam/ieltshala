'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { toast } from 'react-hot-toast';

export default function DashboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading statistics...</div>;
  }

  if (!stats) {
    return <div>No statistics available</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">System Overview</h2>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <p className="text-blue-100 text-sm mb-1">Total Users</p>
            <p className="text-4xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <p className="text-green-100 text-sm mb-1">Vocabulary Words</p>
            <p className="text-4xl font-bold">{stats.totalVocab}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <p className="text-purple-100 text-sm mb-1">Writing Prompts</p>
            <p className="text-4xl font-bold">{stats.totalWriting}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <p className="text-orange-100 text-sm mb-1">Total Activities</p>
            <p className="text-4xl font-bold">{stats.totalProgress}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users by Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.usersByRole.map((role: any) => (
              <div key={role._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-semibold capitalize">{role._id}</span>
                <span className="text-2xl font-bold text-emerald-600">{role.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
