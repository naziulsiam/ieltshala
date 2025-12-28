'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function ProgressPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📊 Progress Tracking</h1>
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Track your improvement across all skills
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
