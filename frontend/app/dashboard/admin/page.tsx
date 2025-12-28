'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vocabulary');

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      console.log('Token:', token);
      console.log('User:', userStr);
      
      if (!token || !userStr) {
        toast.error('Please login as admin');
        router.push('/login');
        return;
      }

      const user = JSON.parse(userStr);
      console.log('User role:', user.role);
      
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        toast.error('Admin access required');
        router.push('/dashboard');
        return;
      }

      setUserRole(user.role);
      setLoading(false);
    } catch (error) {
      console.error('Auth check error:', error);
      toast.error('Authentication failed');
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">
                {userRole === 'super_admin' ? '👑 Super Admin Panel' : '👨‍💼 Admin Panel'}
              </h1>
              <p className="text-sm text-gray-600">
                {userRole === 'super_admin' 
                  ? 'Full system control and content management'
                  : 'Content management dashboard'}
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">← Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-xl font-bold mb-2">Vocabulary</h3>
              <p className="text-gray-600 mb-4">
                Add and manage vocabulary words with Bangla meanings
              </p>
              <p className="text-sm text-emerald-600 font-semibold">Coming soon</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="text-4xl mb-3">✍️</div>
              <h3 className="text-xl font-bold mb-2">Writing Prompts</h3>
              <p className="text-gray-600 mb-4">
                Create and edit writing practice prompts
              </p>
              <p className="text-sm text-emerald-600 font-semibold">Coming soon</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="text-4xl mb-3">🎤</div>
              <h3 className="text-xl font-bold mb-2">Speaking Topics</h3>
              <p className="text-gray-600 mb-4">
                Manage speaking practice topics
              </p>
              <p className="text-sm text-emerald-600 font-semibold">Coming soon</p>
            </CardContent>
          </Card>

          {userRole === 'super_admin' && (
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">👥</div>
                  <h3 className="text-xl font-bold mb-2">User Management</h3>
                  <p className="text-gray-600 mb-4">
                    Manage users and permissions
                  </p>
                  <p className="text-sm text-emerald-600 font-semibold">Coming soon</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="text-xl font-bold mb-2">Analytics</h3>
                  <p className="text-gray-600 mb-4">
                    View system statistics and reports
                  </p>
                  <p className="text-sm text-emerald-600 font-semibold">Coming soon</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">⚙️</div>
                  <h3 className="text-xl font-bold mb-2">Settings</h3>
                  <p className="text-gray-600 mb-4">
                    Configure system settings
                  </p>
                  <p className="text-sm text-emerald-600 font-semibold">Coming soon</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
