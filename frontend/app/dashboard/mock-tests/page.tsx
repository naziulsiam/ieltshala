'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function MockTestsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📝 Mock Tests</h1>
        <Card>
          <CardHeader>
            <CardTitle>Full IELTS Practice Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Take complete mock tests under real exam conditions
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
