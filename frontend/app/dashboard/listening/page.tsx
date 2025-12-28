'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import DashboardLayout from '@/components/DashboardLayout';

export default function ListeningPage() {
  const [activeTab, setActiveTab] = useState<'learn' | 'practice'>('learn');

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">👂 Listening Module</h1>

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
            👂 Practice
          </button>
        </div>

        {activeTab === 'learn' ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/dashboard/listening/learn/strategies">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>🎯 Listening Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Prediction, note-taking, and focus techniques
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/listening/learn/accents">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>🗣️ Different Accents</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    British, American, Australian accents
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/listening/learn/note-taking">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>📝 Note-taking Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Effective note-taking during listening
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/listening/learn/traps">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>⚠️ Common Traps</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Avoid typical listening test traps
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        ) : (
          <Link href="/dashboard/listening/practice">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>👂 Start Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Practice with real IELTS-style audio
                </p>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </DashboardLayout>
  );
}
