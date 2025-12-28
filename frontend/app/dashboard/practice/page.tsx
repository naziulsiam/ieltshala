'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">IELTS Practice</h1>
        <p className="text-gray-600 mb-8">Choose a skill to practice</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/dashboard/writing">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="text-5xl mb-4">✍️</div>
                <h3 className="text-xl font-bold mb-2">Writing</h3>
                <p className="text-gray-600">
                  Practice Task 1 & Task 2 with AI feedback
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/speaking">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="text-5xl mb-4">🎤</div>
                <h3 className="text-xl font-bold mb-2">Speaking</h3>
                <p className="text-gray-600">
                  Practice all 3 parts of speaking test
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/reading">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="text-5xl mb-4">📖</div>
                <h3 className="text-xl font-bold mb-2">Reading</h3>
                <p className="text-gray-600">
                  Improve reading comprehension skills
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/listening">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="text-5xl mb-4">👂</div>
                <h3 className="text-xl font-bold mb-2">Listening</h3>
                <p className="text-gray-600">
                  Practice listening comprehension
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
