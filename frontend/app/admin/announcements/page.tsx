'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AdminAnnouncementsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-2">Send notifications to all users</p>
        </div>
        <Button>+ Create Announcement</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Announcement System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">📢 Announcement Management</p>
            <p className="text-gray-500 mb-6">Send important updates to all users</p>
            <div className="max-w-2xl mx-auto text-left bg-purple-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Features After Deployment:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✅ Send email notifications to all users</li>
                <li>✅ In-app notifications</li>
                <li>✅ Schedule announcements</li>
                <li>✅ Target specific user groups</li>
                <li>✅ Announcement history tracking</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
