'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <div className="cursor-pointer">
              <h1 className="text-2xl font-bold">
                <span className="text-emerald-500">IELTS</span>
                <span className="text-white bg-emerald-500 px-1 rounded ml-0.5">hala</span>
              </h1>
            </div>
          </Link>
          <div className="flex gap-3 items-center">
            {(user?.role === 'admin' || user?.role === 'super_admin') && (
              <Link href="/dashboard/admin">
                <Button variant="outline">
                  {user?.role === 'super_admin' ? '👑 Super Admin' : '👨‍💼 Admin'}
                </Button>
              </Link>
            )}
            <Link href="/dashboard/profile">
              <Button variant="outline">👤 Profile</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            <Link
              href="/dashboard"
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 ${
                pathname === '/dashboard'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              🏠 Dashboard
            </Link>
            <Link
              href="/dashboard/writing"
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 ${
                isActive('/dashboard/writing')
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              ✍️ Writing
            </Link>
            <Link
              href="/dashboard/speaking"
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 ${
                isActive('/dashboard/speaking')
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              🎤 Speaking
            </Link>
            <Link
              href="/dashboard/reading"
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 ${
                isActive('/dashboard/reading')
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              📖 Reading
            </Link>
            <Link
              href="/dashboard/listening"
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 ${
                isActive('/dashboard/listening')
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              👂 Listening
            </Link>
            <Link
              href="/dashboard/vocabulary"
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 ${
                isActive('/dashboard/vocabulary')
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              📚 Vocabulary
            </Link>
            <Link
              href="/dashboard/mock-tests"
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 ${
                isActive('/dashboard/mock-tests')
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              📝 Mock Tests
            </Link>
            <Link
              href="/dashboard/progress"
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 ${
                isActive('/dashboard/progress')
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              📊 Progress
            </Link>
            <Link
              href="/dashboard/study-plan"
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 ${
                isActive('/dashboard/study-plan')
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              📅 Study Plan
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
