'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function Part2LearnPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/speaking" className="text-primary-500 hover:underline mb-4 inline-block">
        ← Back to Speaking
      </Link>

      <h1 className="text-3xl font-bold mb-6">Part 2: Long Turn (Cue Card)</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>⏱️ Format Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <h3 className="font-semibold">1 minute preparation</h3>
                <p className="text-sm text-gray-600">You get paper and pencil to make notes</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🎤</span>
              </div>
              <div>
                <h3 className="font-semibold">2 minutes speaking</h3>
                <p className="text-sm text-gray-600">Speak continuously without interruption</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">❓</span>
              </div>
              <div>
                <h3 className="font-semibold">1-2 follow-up questions</h3>
                <p className="text-sm text-gray-600">Examiner asks about your topic</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📋 Typical Cue Card Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
            <h3 className="font-bold mb-4">Describe a place you visited that you particularly liked</h3>
            <p className="mb-3 font-medium">You should say:</p>
            <ul className="space-y-2 ml-4">
              <li>• Where it was</li>
              <li>• When you went there</li>
              <li>• What you did there</li>
              <li>• And explain why you liked it</li>
            </ul>
          </div>
          <p className="text-sm text-gray-600 mt-4 italic">All cue cards follow this 4-point structure!</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🎯 How to Structure Your Answer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Introduction (10-15 seconds)</h4>
              <p className="text-sm text-gray-700">Briefly introduce the topic</p>
              <p className="text-sm italic text-gray-600 mt-2">"I'd like to talk about a wonderful trip I took to Cox's Bazar last summer..."</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold mb-2">Main Body (75-90 seconds)</h4>
              <p className="text-sm text-gray-700">Answer all 4 bullet points with details and examples</p>
              <p className="text-sm italic text-gray-600 mt-2">"This place is located in the southeastern part of Bangladesh. I went there with my family in June..."</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold mb-2">Conclusion (15-20 seconds)</h4>
              <p className="text-sm text-gray-700">Summarize why this topic is important to you</p>
              <p className="text-sm italic text-gray-600 mt-2">"Overall, it was a memorable experience that I'll never forget..."</p>
            </div>
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
              <span>Use your 1 minute preparation time wisely - make brief notes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Speak for the full 2 minutes - don't stop early</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Use varied vocabulary and complex sentences</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Add personal experiences and emotions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Use past tense for past events, present for current situations</span>
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
              <span>Don't write full sentences during preparation (only keywords)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't speak for less than 1.5 minutes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't memorize answers - it sounds unnatural</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't panic if you go slightly off-topic - it's okay!</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>💡 Useful Phrases for Part 2</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Starting:</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• "I'd like to talk about..."</li>
                <li>• "The place/person/thing I want to describe is..."</li>
                <li>• "Well, thinking about this topic..."</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Adding Details:</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• "What made it special was..."</li>
                <li>• "The most memorable part was..."</li>
                <li>• "I particularly enjoyed..."</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Connecting Ideas:</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• "In addition to that..."</li>
                <li>• "Another thing worth mentioning is..."</li>
                <li>• "On top of that..."</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Concluding:</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• "All in all..."</li>
                <li>• "Looking back..."</li>
                <li>• "That's why this is so important to me"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>🎯 Ready to Practice Part 2?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Practice speaking for 2 minutes with AI feedback!</p>
          <Link href="/dashboard/speaking/practice">
            <Button size="lg" className="w-full">Start Part 2 Practice →</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
