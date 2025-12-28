'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function ReadingStrategiesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/reading" className="text-primary-500 hover:underline mb-4 inline-block">
        ← Back to Reading
      </Link>

      <h1 className="text-3xl font-bold mb-6">Reading Strategies & Techniques</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>⏱️ Time Management Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="font-semibold mb-2">⚠️ Golden Rule: Spend MAXIMUM 20 minutes per passage!</p>
            <p className="text-sm text-gray-700">You have 60 minutes for 3 passages. Don't spend 30 minutes on passage 1 and rush through passage 3!</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h4 className="font-semibold">Skim the passage (2-3 minutes)</h4>
                <p className="text-sm text-gray-600">Read the title, first paragraph, first sentence of each paragraph, and conclusion</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h4 className="font-semibold">Read ALL questions (2-3 minutes)</h4>
                <p className="text-sm text-gray-600">Understand what you're looking for before reading in detail</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h4 className="font-semibold">Scan & Answer (13-15 minutes)</h4>
                <p className="text-sm text-gray-600">Find keywords from questions in the text and answer systematically</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🔍 Skimming vs Scanning - Know the Difference!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border-2 border-blue-500 rounded-lg">
              <h4 className="font-bold text-blue-700 mb-3 text-lg">👁️ Skimming</h4>
              <p className="text-sm font-semibold mb-2">Purpose: Get the general idea/main topic</p>
              <p className="text-sm mb-3"><strong>Speed:</strong> Very fast (1-2 minutes per passage)</p>
              <div className="text-sm space-y-1">
                <p className="font-semibold">What to read:</p>
                <ul className="ml-4 space-y-1">
                  <li>✓ Title & subtitle</li>
                  <li>✓ First paragraph (introduction)</li>
                  <li>✓ First sentence of each paragraph</li>
                  <li>✓ Last paragraph (conclusion)</li>
                  <li>✓ Any bold/italic words</li>
                </ul>
              </div>
              <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                <strong>Example:</strong> "What is this passage mainly about?"
              </div>
            </div>

            <div className="p-4 border-2 border-green-500 rounded-lg">
              <h4 className="font-bold text-green-700 mb-3 text-lg">🎯 Scanning</h4>
              <p className="text-sm font-semibold mb-2">Purpose: Find specific information</p>
              <p className="text-sm mb-3"><strong>Speed:</strong> Fast but focused</p>
              <div className="text-sm space-y-1">
                <p className="font-semibold">How to scan:</p>
                <ul className="ml-4 space-y-1">
                  <li>✓ Look for keywords from question</li>
                  <li>✓ Look for synonyms/paraphrases</li>
                  <li>✓ Move eyes quickly like a scanner</li>
                  <li>✓ Focus on names, dates, numbers</li>
                  <li>✓ Read surrounding sentences carefully</li>
                </ul>
              </div>
              <div className="mt-3 p-2 bg-green-50 rounded text-xs">
                <strong>Example:</strong> "In which year did the event occur?"
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>💡 Smart Reading Techniques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-bold mb-2">1. Follow the Order</h4>
              <p className="text-sm text-gray-700">
                Most questions follow the order of information in the passage. If you can't find answer to Q5, it's probably between the answers to Q4 and Q6.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-bold mb-2">2. Look for Paraphrases</h4>
              <p className="text-sm text-gray-700 mb-2">
                The passage rarely uses the exact same words as the question. Train yourself to spot synonyms:
              </p>
              <div className="text-xs space-y-1 ml-4">
                <p>• "difficult" → "challenging"</p>
                <p>• "children" → "youngsters, young people"</p>
                <p>• "increased" → "rose, grew, went up"</p>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-bold mb-2">3. Understand Question Instructions</h4>
              <p className="text-sm text-gray-700 mb-2">
                Pay close attention to instructions! Common requirements:
              </p>
              <div className="text-xs space-y-1 ml-4">
                <p>• "Choose NO MORE THAN TWO WORDS" - don't write three words!</p>
                <p>• "Write T for True, F for False" - don't write "True" or "False"</p>
                <p>• "Choose THREE letters A-F" - exactly 3, not 2 or 4</p>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-bold mb-2">4. Don't Leave Blanks</h4>
              <p className="text-sm text-gray-700">
                There's no negative marking! If you don't know, make an educated guess. You have a 25% chance with multiple choice!
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-bold mb-2">5. Transfer Answers Carefully</h4>
              <p className="text-sm text-gray-700">
                In the real exam, you must transfer answers to the answer sheet. Check:
              </p>
              <div className="text-xs space-y-1 ml-4">
                <p>• Correct spelling (copy exactly from passage)</p>
                <p>• Correct question number</p>
                <p>• Proper capitalization</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🎯 Question Strategy by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-blue-500 bg-gray-50">
              <h4 className="font-semibold mb-1">Multiple Choice → Read options AFTER reading passage section</h4>
              <p className="text-sm text-gray-600">Don't read all options first, they'll confuse you!</p>
            </div>

            <div className="p-3 border-l-4 border-green-500 bg-gray-50">
              <h4 className="font-semibold mb-1">True/False/Not Given → Look for exact information</h4>
              <p className="text-sm text-gray-600">Not Given = information not mentioned at all</p>
            </div>

            <div className="p-3 border-l-4 border-purple-500 bg-gray-50">
              <h4 className="font-semibold mb-1">Matching Headings → Do this question type LAST</h4>
              <p className="text-sm text-gray-600">It takes the most time. Do easier questions first!</p>
            </div>

            <div className="p-3 border-l-4 border-orange-500 bg-gray-50">
              <h4 className="font-semibold mb-1">Gap Fill → Pay attention to grammar</h4>
              <p className="text-sm text-gray-600">The word must fit grammatically (noun, verb, adjective, etc.)</p>
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
              <span>Read instructions carefully for each question type</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Underline keywords in questions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Look for synonyms and paraphrases</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Check your spelling when copying from passage</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Move on if stuck - come back later</span>
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
              <span>Don't read the passage word-by-word in detail first</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't spend more than 20 minutes on one passage</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't look for exact words from questions - look for synonyms</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't panic if passage topic is unfamiliar - all answers are in the text</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't waste time on difficult words - focus on understanding the sentence</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>🎯 Ready to Apply These Strategies?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Practice reading passages with these techniques and track your improvement!</p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/reading/learn/question-types">
              <Button variant="outline" className="w-full">Learn Question Types →</Button>
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
