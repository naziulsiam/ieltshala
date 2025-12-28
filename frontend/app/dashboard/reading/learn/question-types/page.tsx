'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function QuestionTypesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/reading" className="text-primary-500 hover:underline mb-4 inline-block">
        ← Back to Reading
      </Link>

      <h1 className="text-3xl font-bold mb-6">IELTS Reading Question Types</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          💡 <strong>There are 10 main question types in IELTS Reading.</strong> Each requires a different strategy!
        </p>
      </div>

      {/* Question Type 1 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. Multiple Choice Questions (MCQ)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            Choose the correct answer from options A, B, C, or D
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-3">
            <p className="text-sm font-semibold mb-2">Example:</p>
            <p className="text-sm mb-2">According to the passage, smartphones have...</p>
            <div className="text-sm space-y-1 ml-4">
              <p>A) decreased in popularity</p>
              <p>B) <strong>become essential for communication</strong> ✓</p>
              <p>C) replaced computers entirely</p>
              <p>D) remained the same price</p>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded text-sm">
            <p className="font-semibold mb-1">Strategy:</p>
            <ul className="space-y-1 ml-4">
              <li>• Underline key words in the question</li>
              <li>• Find the relevant section in passage</li>
              <li>• Eliminate obviously wrong answers</li>
              <li>• Watch for distractors (half-true options)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Question Type 2 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2. True / False / Not Given</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            Decide if statements agree with information in the passage
          </p>
          
          <div className="space-y-2 mb-3">
            <div className="p-3 bg-green-50 rounded">
              <p className="font-semibold text-sm">TRUE = Statement matches the passage</p>
            </div>
            <div className="p-3 bg-red-50 rounded">
              <p className="font-semibold text-sm">FALSE = Statement contradicts the passage</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded">
              <p className="font-semibold text-sm">NOT GIVEN = Information not mentioned in passage</p>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded text-sm">
            <p className="font-semibold mb-1">Common Mistake:</p>
            <p>Students confuse FALSE and NOT GIVEN! Remember:</p>
            <ul className="space-y-1 ml-4 mt-2">
              <li>• FALSE = Opposite information is in the passage</li>
              <li>• NOT GIVEN = No information at all about this in passage</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Question Type 3 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>3. Yes / No / Not Given</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            Similar to True/False, but asks if statements agree with the <strong>author's opinion/claims</strong>
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm mb-3">
            <p className="font-semibold">⚠️ Important Difference:</p>
            <p>True/False = Facts | Yes/No = Opinions/Claims</p>
          </div>

          <div className="bg-blue-50 p-3 rounded text-sm">
            <p className="font-semibold mb-1">Strategy:</p>
            <ul className="space-y-1 ml-4">
              <li>• Look for opinion words (believe, claim, argue, suggest)</li>
              <li>• Check if author expresses this view</li>
              <li>• Not Given = author doesn't express opinion on this</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Question Type 4 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>4. Matching Headings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            Match paragraph headings (summaries) to paragraphs A, B, C, etc.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-3">
            <p className="text-sm font-semibold mb-2">Example:</p>
            <p className="text-sm mb-1">Paragraph A → <strong>iii) The benefits of regular exercise</strong></p>
            <p className="text-sm">Paragraph B → <strong>v) Different types of physical activity</strong></p>
          </div>

          <div className="bg-red-50 border border-red-200 p-3 rounded text-sm mb-3">
            <p className="font-semibold">⚠️ Most Difficult & Time-Consuming!</p>
            <p>Do this question type LAST after answering easier ones first.</p>
          </div>

          <div className="bg-blue-50 p-3 rounded text-sm">
            <p className="font-semibold mb-1">Strategy:</p>
            <ul className="space-y-1 ml-4">
              <li>• Read all headings first</li>
              <li>• Focus on topic sentence (usually first sentence)</li>
              <li>• Cross out used headings</li>
              <li>• Look for keywords and synonyms</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Question Types 5-10 Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Other Question Types (5-10)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { num: 5, type: 'Matching Information', desc: 'Match statements to paragraphs' },
              { num: 6, type: 'Matching Features', desc: 'Match names/dates to descriptions' },
              { num: 7, type: 'Sentence Completion', desc: 'Complete sentences with words from passage' },
              { num: 8, type: 'Summary Completion', desc: 'Fill gaps in a summary' },
              { num: 9, type: 'Note/Table/Flow-chart Completion', desc: 'Complete visual organizers' },
              { num: 10, type: 'Diagram Labelling', desc: 'Label parts of a diagram' },
            ].map((item) => (
              <div key={item.num} className="p-3 border rounded-lg hover:border-primary-500 transition-all">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {item.num}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{item.type}</h4>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <p className="font-semibold mb-2">💡 Universal Tips for ALL Gap-Fill Questions:</p>
            <ul className="space-y-1 ml-4">
              <li>• Copy spelling exactly from passage</li>
              <li>• Respect word limits (e.g., NO MORE THAN TWO WORDS)</li>
              <li>• Answer must be grammatically correct</li>
              <li>• Use words from passage, not your own words</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>🎯 Master These Question Types!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Now practice with real passages and track which types you need to improve!</p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/reading/learn/common-mistakes">
              <Button variant="outline" className="w-full">Common Mistakes →</Button>
            </Link>
            <Link href="/dashboard/reading/practice">
              <Button className="w-full">Start Practice →</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
