'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function TrapsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/listening" className="text-primary-500 hover:underline mb-4 inline-block">
        ← Back to Listening
      </Link>

      <h1 className="text-3xl font-bold mb-6">Common Listening Traps & How to Avoid Them</h1>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-red-800">
          ⚠️ <strong>IELTS deliberately includes distractors!</strong> Learn to recognize these patterns and avoid falling for traps.
        </p>
      </div>

      {/* Trap 1 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-red-600">🪤 Trap #1: Speaker Changes Their Mind</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            The speaker mentions one answer, then corrects it. You must write the FINAL answer!
          </p>

          <div className="bg-white border-2 border-red-300 p-4 rounded-lg mb-3">
            <p className="font-semibold text-sm mb-2">Example:</p>
            <p className="text-sm italic mb-2">
              "The meeting is on Tuesday... oh wait, actually it's been moved to Wednesday."
            </p>
            <p className="text-sm">
              <span className="text-red-600 font-bold">✗ Wrong: Tuesday</span><br/>
              <span className="text-green-600 font-bold">✓ Correct: Wednesday</span>
            </p>
          </div>

          <div className="bg-green-50 p-3 rounded">
            <p className="font-semibold text-sm mb-1">How to Avoid:</p>
            <p className="text-sm">Listen for correction words: "actually, I mean, sorry, no, wait, instead, rather"</p>
          </div>
        </CardContent>
      </Card>

      {/* Trap 2 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-red-600">🪤 Trap #2: Similar Sounding Words</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            IELTS uses words that sound similar to confuse you.
          </p>

          <div className="bg-white border-2 border-red-300 p-4 rounded-lg mb-3">
            <h4 className="font-semibold mb-2">Common Confusing Pairs:</h4>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <p>• thirteen (13) vs thirty (30)</p>
              <p>• fourteen (14) vs forty (40)</p>
              <p>• fifteen (15) vs fifty (50)</p>
              <p>• price vs prize</p>
              <p>• affect vs effect</p>
              <p>• advice vs advise</p>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded">
            <p className="font-semibold text-sm mb-1">How to Avoid:</p>
            <p className="text-sm">Focus on STRESS: thirTEEN vs THIRty. Listen to the whole sentence for context.</p>
          </div>
        </CardContent>
      </Card>

      {/* Trap 3 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-red-600">🪤 Trap #3: Negative Statements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            Speaker uses negative forms that change the meaning.
          </p>

          <div className="bg-white border-2 border-red-300 p-4 rounded-lg mb-3">
            <p className="font-semibold text-sm mb-2">Example:</p>
            <p className="text-sm italic mb-2">
              Question: "Is the library open on Sunday?"<br/>
              Audio: "The library is NOT open on Sunday."
            </p>
            <p className="text-sm">
              <span className="text-red-600 font-bold">✗ Wrong: Yes</span><br/>
              <span className="text-green-600 font-bold">✓ Correct: No</span>
            </p>
          </div>

          <div className="bg-green-50 p-3 rounded">
            <p className="font-semibold text-sm mb-1">How to Avoid:</p>
            <p className="text-sm">Listen carefully for: not, no, never, hardly, barely, rarely, seldom</p>
          </div>
        </CardContent>
      </Card>

      {/* Trap 4 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-red-600">🪤 Trap #4: Multiple Numbers Mentioned</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            Several numbers are mentioned, but only ONE is the correct answer.
          </p>

          <div className="bg-white border-2 border-red-300 p-4 rounded-lg mb-3">
            <p className="font-semibold text-sm mb-2">Example:</p>
            <p className="text-sm italic mb-2">
              "The course normally costs $500, but there's a discount of $100, so you'll pay $400."
            </p>
            <p className="text-sm">
              Question: "How much will the student pay?"<br/>
              <span className="text-green-600 font-bold">✓ Correct: $400 (final price)</span>
            </p>
          </div>

          <div className="bg-green-50 p-3 rounded">
            <p className="font-semibold text-sm mb-1">How to Avoid:</p>
            <p className="text-sm">Understand what the question is asking for. Listen to the COMPLETE information.</p>
          </div>
        </CardContent>
      </Card>

      {/* Trap 5 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-red-600">🪤 Trap #5: Dates & Times Confusion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white border-2 border-red-300 p-4 rounded-lg mb-3">
            <h4 className="font-semibold mb-2">Common Confusions:</h4>
            <div className="space-y-2 text-sm">
              <p>• 3rd (third) vs 13th (thirteenth)</p>
              <p>• 3:15 (three fifteen) vs 3:50 (three fifty)</p>
              <p>• 1st May vs May 1st (different formats)</p>
              <p>• AM vs PM (morning vs afternoon)</p>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded">
            <p className="font-semibold text-sm mb-1">How to Avoid:</p>
            <p className="text-sm">Write down numbers as you hear them. Double-check AM/PM and date format.</p>
          </div>
        </CardContent>
      </Card>

      {/* Trap 6 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-red-600">🪤 Trap #6: Paraphrasing & Synonyms</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            Question uses different words than the audio (most common trap!).
          </p>

          <div className="bg-white border-2 border-red-300 p-4 rounded-lg mb-3">
            <p className="font-semibold text-sm mb-2">Example:</p>
            <p className="text-sm">
              Question: "What is the main benefit?"<br/>
              Audio: "The primary advantage is..." ← uses "advantage" not "benefit"
            </p>
          </div>

          <div className="bg-green-50 p-3 rounded">
            <p className="font-semibold text-sm mb-1">How to Avoid:</p>
            <p className="text-sm">Train yourself to recognize synonyms. Understand the meaning, not just the words.</p>
          </div>
        </CardContent>
      </Card>

      {/* Trap 7 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-red-600">🪤 Trap #7: Extra Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            Speaker gives more details than needed. You must select only what answers the question.
          </p>

          <div className="bg-white border-2 border-red-300 p-4 rounded-lg mb-3">
            <p className="font-semibold text-sm mb-2">Example:</p>
            <p className="text-sm italic mb-2">
              Question: "What is his job?"<br/>
              Audio: "John Smith, who graduated last year, works as an engineer in London."
            </p>
            <p className="text-sm">
              <span className="text-red-600 font-bold">✗ Wrong: John Smith / graduated last year / London</span><br/>
              <span className="text-green-600 font-bold">✓ Correct: engineer</span>
            </p>
          </div>

          <div className="bg-green-50 p-3 rounded">
            <p className="font-semibold text-sm mb-1">How to Avoid:</p>
            <p className="text-sm">Focus on what the question asks. Ignore extra details.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader>
          <CardTitle>🎯 Final Tips to Avoid Traps</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-red-500">⚠️</span>
              <span>Always wait until the speaker finishes - they might correct themselves</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">⚠️</span>
              <span>Don't panic if you hear the keyword - wait for the actual answer</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">⚠️</span>
              <span>Practice with official IELTS materials to see trap patterns</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">⚠️</span>
              <span>Trust the process - answers come in order (usually)</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>🚀 Practice Avoiding These Traps!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/listening/learn/note-taking">
              <Button variant="outline" className="w-full">Note-Taking Tips →</Button>
            </Link>
            <Link href="/dashboard/listening/practice">
              <Button className="w-full">Start Practice →</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
