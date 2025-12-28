'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import DashboardLayout from '@/components/DashboardLayout';

export default function SpeakingPage() {
  const [activeTab, setActiveTab] = useState<'learn' | 'practice'>('learn');

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🎤 Speaking Module</h1>

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
            🎤 Practice
          </button>
        </div>

        {activeTab === 'learn' ? (
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/dashboard/speaking/learn/part1">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>👋 Part 1 - Introduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Personal questions about yourself and daily life
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/speaking/learn/part2">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>🗣️ Part 2 - Cue Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    2-minute speech on a given topic
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/speaking/learn/part3">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>💬 Part 3 - Discussion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    In-depth discussion on abstract topics
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        ) : (
          <Link href="/dashboard/speaking/practice">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>🎤 Start Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Practice speaking with AI feedback
                </p>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </DashboardLayout>
  );
}
