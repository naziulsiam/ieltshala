'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
      router.push('/login');
    } else if (userData.role !== 'admin' && userData.role !== 'superadmin') {
      router.push('/dashboard');
      alert('Access denied. Admin privileges required.');
    } else {
      setUser(userData);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const menuItems = [
    { icon: '📊', label: 'Dashboard', href: '/admin/dashboard' },
    { icon: '👥', label: 'Users', href: '/admin/users' },
    { icon: '🎤', label: 'Speaking Topics', href: '/admin/speaking' },
    { icon: '✍️', label: 'Writing Tasks', href: '/admin/writing' },
    { icon: '📚', label: 'Vocabulary', href: '/admin/vocabulary' },
    { icon: '📢', label: 'Announcements', href: '/admin/announcements' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold">
              I
            </div>
            <div>
              <div className="font-bold text-lg">IELTShala</div>
              <div className="text-xs text-gray-500">Admin Panel</div>
            </div>
          </Link>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors mb-1">
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-4 bg-gray-50 rounded-lg mb-2">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
