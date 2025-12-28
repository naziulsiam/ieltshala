'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import DashboardLayout from '@/components/DashboardLayout';

export default function ReadingPage() {
  const [activeTab, setActiveTab] = useState<'learn' | 'practice'>('learn');

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📖 Reading Module</h1>

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
            📖 Practice
          </button>
        </div>

        {activeTab === 'learn' ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/dashboard/reading/learn/strategies">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>🎯 Reading Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Skimming, scanning, and detailed reading techniques
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/reading/learn/question-types">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>❓ Question Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Master all IELTS reading question formats
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/reading/learn/vocabulary">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>📚 Academic Vocabulary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Build vocabulary for academic texts
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/reading/learn/common-mistakes">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>⚠️ Common Mistakes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Avoid typical reading test errors
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        ) : (
          <Link href="/dashboard/reading/practice">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>📖 Start Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Practice with real IELTS-style passages
                </p>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </DashboardLayout>
  );
}
