'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function StudyPlanPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📅 Study Plan</h1>
        <Card>
          <CardHeader>
            <CardTitle>Personalized Study Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Create and manage your study schedule
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
