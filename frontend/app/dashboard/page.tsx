'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userStr));
    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-gray-600">Track your IELTS preparation progress</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Target Band</p>
                <p className="text-4xl font-bold">{user?.targetBand || 7.0}</p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Total Practice</p>
                <p className="text-4xl font-bold">{stats?.totalAttempts || 0}</p>
              </div>
              <div className="text-4xl">✍️</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Avg Score</p>
                <p className="text-4xl font-bold">{stats?.averageScore?.toFixed(1) || '0.0'}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">Study Days</p>
                <p className="text-4xl font-bold">{stats?.studyDays || 0}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Practice by Skill</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <Link href="/dashboard/writing">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">✍️</div>
                <h3 className="text-xl font-bold mb-2">Writing</h3>
                <p className="text-gray-600 text-sm">Task 1 & Task 2</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/speaking">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">🎤</div>
                <h3 className="text-xl font-bold mb-2">Speaking</h3>
                <p className="text-gray-600 text-sm">All 3 Parts</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/reading">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">📖</div>
                <h3 className="text-xl font-bold mb-2">Reading</h3>
                <p className="text-gray-600 text-sm">Comprehension</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/listening">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">👂</div>
                <h3 className="text-xl font-bold mb-2">Listening</h3>
                <p className="text-gray-600 text-sm">Audio Practice</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Additional Tools</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/dashboard/vocabulary">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="text-xl font-bold mb-2">Vocabulary</h3>
                <p className="text-gray-600 text-sm">Flashcards & Learning</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/study-plan">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="text-xl font-bold mb-2">Study Plan</h3>
                <p className="text-gray-600 text-sm">Personalized Schedule</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/mock-tests">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">📝</div>
                <h3 className="text-xl font-bold mb-2">Mock Tests</h3>
                <p className="text-gray-600 text-sm">Full Practice Tests</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentAttempts && stats.recentAttempts.length > 0 ? (
            <div className="space-y-3">
              {stats.recentAttempts.map((attempt: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{attempt.skill} - Task {attempt.task}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(attempt.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">
                      {attempt.bandScore?.toFixed(1) || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">Band Score</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">📝</p>
              <p>No practice attempts yet</p>
              <p className="text-sm mt-2">Start practicing to see your progress here!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
