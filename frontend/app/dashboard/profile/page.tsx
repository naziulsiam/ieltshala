'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">👤 Profile</h1>
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
