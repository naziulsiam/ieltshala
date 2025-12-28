'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function Part1LearnPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/speaking" className="text-primary-500 hover:underline mb-4 inline-block">
        ← Back to Speaking
      </Link>

      <h1 className="text-3xl font-bold mb-6">Part 1: Introduction & Interview</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>⏱️ Format Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⏱️</span>
              </div>
              <div>
                <h3 className="font-semibold">Duration: 4-5 minutes</h3>
                <p className="text-sm text-gray-600">Short answers to personal questions</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">❓</span>
              </div>
              <div>
                <h3 className="font-semibold">10-12 questions</h3>
                <p className="text-sm text-gray-600">About 3 different topics from your life</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📋 Common Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Home & Family', examples: 'Where do you live? Tell me about your family.' },
              { title: 'Work & Studies', examples: 'What do you do? Why did you choose this subject?' },
              { title: 'Hobbies & Interests', examples: 'What do you do in your free time?' },
              { title: 'Daily Routine', examples: 'What do you usually do on weekends?' },
              { title: 'Food & Eating', examples: 'What kind of food do you like?' },
              { title: 'Technology', examples: 'How often do you use your phone?' },
            ].map((topic) => (
              <div key={topic.title} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">{topic.title}</h4>
                <p className="text-sm text-gray-600 italic">"{topic.examples}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>✅ Do's</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Give short but complete answers (2-3 sentences)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Be natural and speak like you're talking to a friend</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Add reasons or examples to support your answer</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Maintain good eye contact with the examiner</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>❌ Don'ts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't give one-word answers like "Yes" or "No"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't memorize and recite prepared answers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't speak too long (keep it under 30 seconds per question)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't ask the examiner to repeat every question</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>🎯 Ready to Practice?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Now that you understand the format, try answering Part 1 questions with AI feedback!</p>
          <Link href="/dashboard/speaking/practice/part1">
            <Button size="lg" className="w-full">
              Start Part 1 Practice →
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
