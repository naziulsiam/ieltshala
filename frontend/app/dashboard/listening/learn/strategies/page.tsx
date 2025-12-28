'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function ListeningStrategiesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/listening" className="text-primary-500 hover:underline mb-4 inline-block">
        ← Back to Listening
      </Link>

      <h1 className="text-3xl font-bold mb-6">Listening Strategies & Techniques</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          💡 <strong>Key Rule:</strong> You only hear the audio ONCE! Use these strategies to maximize your score.
        </p>
      </div>

      {/* Before Listening */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📖 BEFORE Listening: Use Reading Time Wisely</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            You get 30 seconds before each section to read the questions. This is CRUCIAL time!
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-bold mb-2">1. Read the Instructions</h4>
              <p className="text-sm text-gray-700">Check word limits (NO MORE THAN TWO WORDS), format requirements</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-bold mb-2">2. Underline Keywords</h4>
              <p className="text-sm text-gray-700 mb-2">Focus on:</p>
              <ul className="text-sm ml-4 space-y-1">
                <li>• Question words (Who, What, When, Where, Why, How)</li>
                <li>• Names, places, dates, numbers</li>
                <li>• Important nouns and verbs</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-bold mb-2">3. Predict Answers</h4>
              <p className="text-sm text-gray-700 mb-2">Think about what type of answer you're looking for:</p>
              <div className="text-sm bg-white p-3 rounded">
                <p className="font-semibold mb-1">Examples:</p>
                <p>Q: "The meeting is on ______" → Expect: day/date</p>
                <p>Q: "The cost is ______" → Expect: price/number</p>
                <p>Q: "The speaker feels ______" → Expect: emotion/adjective</p>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-bold mb-2">4. Look at Question Order</h4>
              <p className="text-sm text-gray-700">Answers usually come in order. If you miss Q5, focus on Q6 - Q5 is probably lost!</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* While Listening */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🎧 WHILE Listening: Active Listening Techniques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-bold mb-2">1. Follow the Questions in Order</h4>
              <p className="text-sm text-gray-700">Listen for keywords from Q1, then move to Q2, Q3... Don't jump around!</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-bold mb-2">2. Listen for Synonyms & Paraphrasing</h4>
              <p className="text-sm text-gray-700 mb-2">
                The audio RARELY uses exact words from the question!
              </p>
              <div className="bg-white p-3 rounded text-sm">
                <p className="font-semibold mb-1">Example:</p>
                <p>Question: "What is her occupation?"</p>
                <p>Audio: "She works as a doctor" ← uses "works as" not "occupation"</p>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-bold mb-2">3. Write While Listening</h4>
              <p className="text-sm text-gray-700 mb-2">Don't wait! Write answers immediately:</p>
              <ul className="text-sm ml-4 space-y-1">
                <li>• Use abbreviations (e.g., "tmrw" for tomorrow)</li>
                <li>• Write what you hear even if you're not 100% sure</li>
                <li>• You can correct later if speaker changes their mind</li>
              </ul>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-bold mb-2">4. Stay Calm if You Miss an Answer</h4>
              <p className="text-sm text-gray-700">
                If you miss Q3, <strong>MOVE ON to Q4!</strong> Don't panic and miss more questions trying to find Q3.
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-bold mb-2">5. Watch for Corrections & Changes</h4>
              <p className="text-sm text-gray-700 mb-2">
                Speakers often correct themselves - always write the FINAL answer!
              </p>
              <div className="bg-white p-3 rounded text-sm">
                <p className="font-semibold mb-1">Example of a TRAP:</p>
                <p>"The meeting is on Tuesday... actually, no, make that Wednesday."</p>
                <p className="text-green-700">✓ Correct answer: Wednesday (not Tuesday!)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* After Listening */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>✍️ AFTER Listening: Review Time (10 minutes)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            After all 4 sections, you get 10 minutes to transfer answers to the answer sheet. Use this time wisely!
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-bold mb-2">1. Check Spelling</h4>
              <p className="text-sm text-gray-700">Wrong spelling = 0 marks! Double-check every word.</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-bold mb-2">2. Check Grammar</h4>
              <p className="text-sm text-gray-700 mb-2">Answer must fit grammatically:</p>
              <div className="text-sm bg-white p-3 rounded">
                <p>Q: "She works as a ______"</p>
                <p className="text-red-600">✗ "teaches" (wrong - doesn't fit)</p>
                <p className="text-green-700">✓ "teacher" (correct - noun needed)</p>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-bold mb-2">3. Check Word Limits</h4>
              <p className="text-sm text-gray-700">If it says "NO MORE THAN TWO WORDS", don't write three!</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-bold mb-2">4. Fill All Blanks</h4>
              <p className="text-sm text-gray-700">No negative marking! Guess if you don't know - you might be right!</p>
            </div>

            <div className="p-4 bg-pink-50 rounded-lg">
              <h4 className="font-bold mb-2">5. Check Capitalization</h4>
              <p className="text-sm text-gray-700">Capitalize proper nouns: names, places, days, months</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Concentration Tips */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🧠 Staying Focused for 30 Minutes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Listening continuously for 30 minutes is hard! Use these tips:
          </p>

          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold">✓</span>
              <span className="text-sm">Practice listening to English podcasts/news for 30+ minutes daily</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold">✓</span>
              <span className="text-sm">Get enough sleep the night before the exam</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold">✓</span>
              <span className="text-sm">Follow along with your pencil on the question paper</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold">✓</span>
              <span className="text-sm">Don't dwell on missed questions - keep moving forward</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold">✓</span>
              <span className="text-sm">Use the short breaks between sections to refocus</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Section-Specific Tips */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📊 Section-Specific Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
              <h4 className="font-semibold mb-1">Section 1 (Easiest)</h4>
              <p className="text-sm">Focus on details: names, addresses, phone numbers, dates. Spelling counts!</p>
            </div>

            <div className="p-3 border-l-4 border-green-500 bg-green-50">
              <h4 className="font-semibold mb-1">Section 2</h4>
              <p className="text-sm">One speaker, so easier to follow. Watch for maps, diagrams, or plans.</p>
            </div>

            <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
              <h4 className="font-semibold mb-1">Section 3</h4>
              <p className="text-sm">Multiple speakers - identify who says what. Often about academic topics.</p>
            </div>

            <div className="p-3 border-l-4 border-orange-500 bg-orange-50">
              <h4 className="font-semibold mb-1">Section 4 (Hardest)</h4>
              <p className="text-sm">Academic lecture - fastest speech. Focus on main ideas and key terminology.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>🎯 Ready to Apply These Strategies?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Master these techniques and learn about common traps!</p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/listening/learn/traps">
              <Button variant="outline" className="w-full">Common Traps →</Button>
            </Link>
            <Link href="/dashboard/listening/learn/accents">
              <Button variant="outline" className="w-full">Learn Accents →</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
