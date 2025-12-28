'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Users', value: '1,234', icon: '👥', color: 'bg-blue-500' },
    { label: 'Active Today', value: '89', icon: '⚡', color: 'bg-green-500' },
    { label: 'Speaking Tests', value: '567', icon: '🎤', color: 'bg-purple-500' },
    { label: 'Writing Tests', value: '423', icon: '✍️', color: 'bg-orange-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to IELTShala Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-l-4 border-l-primary-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { user: 'John Doe', action: 'Completed Speaking Test', time: '5 mins ago', score: '7.5' },
              { user: 'Jane Smith', action: 'Submitted Writing Task 2', time: '12 mins ago', score: '7.0' },
              { user: 'Ahmed Khan', action: 'Completed Reading Test', time: '23 mins ago', score: '8.0' },
              { user: 'Fatima Ali', action: 'Completed Listening Test', time: '35 mins ago', score: '6.5' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                    {activity.user.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-600">Band {activity.score}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
