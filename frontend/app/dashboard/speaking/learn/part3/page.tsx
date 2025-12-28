'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function Part3LearnPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/speaking" className="text-primary-500 hover:underline mb-4 inline-block">
        ← Back to Speaking
      </Link>

      <h1 className="text-3xl font-bold mb-6">Part 3: Two-Way Discussion</h1>

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
                <p className="text-sm text-gray-600">Discussion related to Part 2 topic</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🧠</span>
              </div>
              <div>
                <h3 className="font-semibold">Abstract & complex questions</h3>
                <p className="text-sm text-gray-600">Requires deeper thinking and analysis</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💭</span>
              </div>
              <div>
                <h3 className="font-semibold">Express opinions with justification</h3>
                <p className="text-sm text-gray-600">Explain your views with reasons and examples</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🆚 Part 1 vs Part 3 - What's the Difference?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-bold mb-3">Part 1</h4>
              <p className="text-sm mb-2 font-semibold text-gray-700">Question:</p>
              <p className="text-sm italic mb-3">"Do you like reading books?"</p>
              <p className="text-sm font-semibold text-gray-700">Answer Type:</p>
              <p className="text-sm">Personal, simple answer about yourself</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-bold mb-3">Part 3</h4>
              <p className="text-sm mb-2 font-semibold text-gray-700">Question:</p>
              <p className="text-sm italic mb-3">"Why do you think reading is becoming less popular among young people?"</p>
              <p className="text-sm font-semibold text-gray-700">Answer Type:</p>
              <p className="text-sm">General, analytical answer about society</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📋 Common Question Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: 'Compare & Contrast', example: 'How has education changed in your country over the last 20 years?' },
              { type: 'Advantages & Disadvantages', example: 'What are the benefits and drawbacks of working from home?' },
              { type: 'Cause & Effect', example: 'Why do you think people are becoming more health-conscious?' },
              { type: 'Solutions', example: 'What can be done to reduce pollution in cities?' },
              { type: 'Prediction', example: 'How do you think technology will change in the future?' },
              { type: 'Opinion', example: 'Do you think schools should ban mobile phones?' },
            ].map((item) => (
              <div key={item.type} className="p-3 border-l-4 border-primary-500 bg-gray-50">
                <p className="font-semibold text-sm mb-1">{item.type}</p>
                <p className="text-sm italic text-gray-700">"{item.example}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🎯 How to Answer Part 3 Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">1. Direct Answer (5 seconds)</h4>
              <p className="text-sm italic text-gray-600">"Yes, I believe technology has significantly changed education..."</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold mb-2">2. Explain/Reason (15-20 seconds)</h4>
              <p className="text-sm italic text-gray-600">"This is mainly because students now have access to online resources and can learn at their own pace..."</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold mb-2">3. Example (10-15 seconds)</h4>
              <p className="text-sm italic text-gray-600">"For instance, during the pandemic, millions of students continued their education through video conferencing..."</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold mb-2">4. Conclusion (Optional, 5 seconds)</h4>
              <p className="text-sm italic text-gray-600">"So overall, I think this trend will continue in the future."</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>💡 Essential Phrases for Part 3</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Expressing Opinions:</h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <p>• "In my opinion..."</p>
                <p>• "I believe that..."</p>
                <p>• "From my perspective..."</p>
                <p>• "It seems to me that..."</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Giving Reasons:</h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <p>• "This is mainly because..."</p>
                <p>• "The reason for this is..."</p>
                <p>• "This can be attributed to..."</p>
                <p>• "One of the factors is..."</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Providing Examples:</h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <p>• "For example..."</p>
                <p>• "A good illustration would be..."</p>
                <p>• "Take... for instance"</p>
                <p>• "This is evident in..."</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Balancing Views:</h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <p>• "On one hand... On the other hand..."</p>
                <p>• "While it's true that... however..."</p>
                <p>• "Although... nevertheless..."</p>
                <p>• "Despite this..."</p>
              </div>
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
              <span>Speak for 30-40 seconds per answer (longer than Part 1)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Use sophisticated vocabulary and complex grammar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Provide specific examples from your knowledge or experience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Show you can discuss abstract concepts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>It's okay to say "That's a good question, let me think..."</span>
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
              <span>Don't give short, Part 1-style answers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't say "I don't know" - try to give some opinion</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't talk only about yourself - discuss general trends</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't use simple vocabulary you'd use with children</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>🎯 Ready for Part 3 Practice?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Practice answering complex discussion questions!</p>
          <Link href="/dashboard/speaking/practice">
            <Button size="lg" className="w-full">Start Part 3 Practice →</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
