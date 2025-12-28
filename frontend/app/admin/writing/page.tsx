'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AdminWritingPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">✍️ Admin - Writing Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Writing Topics & Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">🚧</div>
            <p className="text-lg font-medium mb-2">Admin Panel Coming Soon</p>
            <p className="text-sm">Manage writing prompts, sample essays, and evaluation criteria</p>
            <div className="mt-6 text-left max-w-md mx-auto">
              <p className="font-semibold mb-2">Features to be added:</p>
              <ul className="text-sm space-y-1 ml-6">
                <li>• Add/edit Task 1 & Task 2 prompts</li>
                <li>• Upload sample essays for each band score</li>
                <li>• Manage evaluation rubrics</li>
                <li>• View student submissions</li>
                <li>• Export analytics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
