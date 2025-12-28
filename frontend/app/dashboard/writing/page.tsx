'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DashboardLayout from '@/components/DashboardLayout';

export default function WritingPage() {
  const [activeTab, setActiveTab] = useState<'learn' | 'practice'>('learn');

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">✍️ Writing Module</h1>

        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('learn')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'learn'
                ? 'border-b-2 border-emerald-600 text-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📚 Learn
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'practice'
                ? 'border-b-2 border-emerald-600 text-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ✍️ Practice
          </button>
        </div>

        {activeTab === 'learn' ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/dashboard/writing/learn/task1">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>📊 Task 1 - Academic</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Learn how to describe graphs, charts, tables, and diagrams
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/writing/learn/task2">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>✍️ Task 2 - Essay</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Master essay writing with different question types
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        ) : (
          <Link href="/dashboard/writing/practice">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>✍️ Start Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get AI-powered feedback on your writing
                </p>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </DashboardLayout>
  );
}
