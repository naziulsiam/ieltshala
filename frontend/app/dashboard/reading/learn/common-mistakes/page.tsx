'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function CommonMistakesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/reading" className="text-primary-500 hover:underline mb-4 inline-block">
        ← Back to Reading
      </Link>

      <h1 className="text-3xl font-bold mb-6">Common Reading Mistakes to Avoid</h1>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-red-800">
          ⚠️ <strong>Avoid these mistakes to improve your band score!</strong> Even advanced students make these errors.
        </p>
      </div>

      {/* Mistake 1 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-red-600">❌ Mistake #1: Spending Too Long on One Question</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-lg mb-3">
            <p className="font-semibold text-sm mb-2">The Problem:</p>
            <p className="text-sm text-gray-700">
              Students spend 5-10 minutes trying to find the answer to ONE difficult question, then run out of time for easier questions later.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-semibold text-sm mb-2">✅ The Solution:</p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>• If you can't find answer in 1-2 minutes, <strong>skip it and move on</strong></li>
              <li>• Put a small mark/circle next to the question</li>
              <li>• Come back to it at the end if you have time</li>
              <li>• Make an educated guess rather than leave it blank</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Mistake 2 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-red-600">❌ Mistake #2: Looking for Exact Words from the Question</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-lg mb-3">
            <p className="font-semibold text-sm mb-2">The Problem:</p>
            <p className="text-sm text-gray-700 mb-2">
              Students search for the exact words from the question in the passage, but IELTS uses <strong>paraphrasing</strong>!
            </p>
            <div className="text-sm bg-white p-3 rounded">
              <p className="font-semibold mb-1">Example:</p>
              <p>Question: "Children prefer outdoor activities"</p>
              <p>Passage: "Youngsters enjoy spending time outside" ← Different words, same meaning!</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-semibold text-sm mb-2">✅ The Solution:</p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>• Train yourself to recognize synonyms and paraphrases</li>
              <li>• Understand the <strong>meaning</strong>, not just the words</li>
              <li>• Look for ideas that match, even with different vocabulary</li>
            </ul>
            <div className="mt-3 text-sm bg-white p-3 rounded">
              <p className="font-semibold mb-2">Common Paraphrases:</p>
              <div className="grid md:grid-cols-2 gap-2">
                <p>• difficult → challenging, hard</p>
                <p>• increase → rise, grow, go up</p>
                <p>• important → significant, crucial, vital</p>
                <p>• children → youngsters, young people</p>
                <p>• many → numerous, a lot of, plenty of</p>
                <p>• benefit → advantage, positive aspect</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mistake 3 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-red-600">❌ Mistake #3: Confusing "False" with "Not Given"</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-lg mb-3">
            <p className="font-semibold text-sm mb-2">The Problem:</p>
            <p className="text-sm text-gray-700">
              This is THE most common mistake! Students can't tell the difference between False and Not Given.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-semibold text-sm mb-2">✅ The Solution - Remember This Rule:</p>
            <div className="space-y-3 text-sm">
              <div className="bg-white p-3 rounded">
                <p className="font-bold mb-1">FALSE = Opposite information exists</p>
                <p className="text-gray-700">Statement: "Dogs are the most popular pets."</p>
                <p className="text-gray-700">Passage: "Cats are the most popular pets." → <strong>FALSE</strong></p>
              </div>

              <div className="bg-white p-3 rounded">
                <p className="font-bold mb-1">NOT GIVEN = No information about this</p>
                <p className="text-gray-700">Statement: "Dogs are the most popular pets."</p>
                <p className="text-gray-700">Passage: "Many families own pets." → <strong>NOT GIVEN</strong> (doesn't say which is most popular)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mistake 4 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-red-600">❌ Mistake #4: Not Reading Instructions Carefully</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-lg mb-3">
            <p className="font-semibold text-sm mb-2">The Problem:</p>
            <p className="text-sm text-gray-700 mb-2">
              Students lose marks for silly mistakes like:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>• Writing 3 words when instruction says "NO MORE THAN TWO WORDS"</li>
              <li>• Writing "True" when instruction says "Write T"</li>
              <li>• Choosing 2 answers when instruction says "Choose THREE letters"</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-semibold text-sm mb-2">✅ The Solution:</p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>• Read instructions for EVERY question type carefully</li>
              <li>• Underline key words (e.g., "NO MORE THAN", "Choose THREE")</li>
              <li>• Double-check your answers match the format</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Mistake 5 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-red-600">❌ Mistake #5: Reading the Passage Word-by-Word</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-lg mb-3">
            <p className="font-semibold text-sm mb-2">The Problem:</p>
            <p className="text-sm text-gray-700">
              Students read every single word slowly and carefully. This wastes time! You'll never finish in 60 minutes.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-semibold text-sm mb-2">✅ The Solution:</p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>• <strong>Skim</strong> first to get the main idea (2-3 minutes)</li>
              <li>• Read questions to know what to look for</li>
              <li>• <strong>Scan</strong> for specific information only</li>
              <li>• Read surrounding sentences carefully when you find keywords</li>
              <li>• Don't worry if you don't understand every word!</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Mistake 6 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-red-600">❌ Mistake #6: Copying Words Incorrectly</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-lg mb-3">
            <p className="font-semibold text-sm mb-2">The Problem:</p>
            <p className="text-sm text-gray-700">
              Finding the right answer but making spelling mistakes when copying from the passage.
            </p>
            <div className="text-sm bg-white p-3 rounded mt-2">
              <p className="font-semibold mb-1">Example:</p>
              <p>Passage word: "accommodation"</p>
              <p>Student writes: "accomodation" → <span className="text-red-600 font-bold">WRONG (0 marks)</span></p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-semibold text-sm mb-2">✅ The Solution:</p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>• Copy spelling <strong>exactly</strong> from the passage</li>
              <li>• Check for double letters (accommodation, millennium)</li>
              <li>• Match capitalization (proper nouns, names)</li>
              <li>• Include hyphens if present (well-known)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Mistake 7 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-red-600">❌ Mistake #7: Leaving Answers Blank</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-lg mb-3">
            <p className="font-semibold text-sm mb-2">The Problem:</p>
            <p className="text-sm text-gray-700">
              Students leave questions blank when they don't know the answer.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-semibold text-sm mb-2">✅ The Solution:</p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>There is NO negative marking in IELTS!</strong> Always guess if you don't know.
            </p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>• Multiple choice → You have 25% chance even with random guess</li>
              <li>• True/False/Not Given → 33% chance</li>
              <li>• Try to make an <strong>educated guess</strong> using logic</li>
              <li>• Write something rather than nothing!</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Mistake 8 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-red-600">❌ Mistake #8: Using Your Own Knowledge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-lg mb-3">
            <p className="font-semibold text-sm mb-2">The Problem:</p>
            <p className="text-sm text-gray-700">
              Students answer based on their personal knowledge instead of information in the passage.
            </p>
            <div className="text-sm bg-white p-3 rounded mt-2">
              <p className="font-semibold mb-1">Example:</p>
              <p>Question: "When was the building constructed?"</p>
              <p>Student thinks: "I know this building! It was 1950."</p>
              <p>But passage says: "Construction began in 1952" → Must use <strong>passage info</strong>!</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-semibold text-sm mb-2">✅ The Solution:</p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>• <strong>ALL answers must come from the passage</strong></li>
              <li>• Ignore your personal knowledge or opinions</li>
              <li>• Only use information explicitly stated in the text</li>
              <li>• Don't make assumptions or inferences beyond what's written</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Mistake 9 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-red-600">❌ Mistake #9: Panicking About Difficult Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-lg mb-3">
            <p className="font-semibold text-sm mb-2">The Problem:</p>
            <p className="text-sm text-gray-700">
              Student sees a passage about "Quantum Physics" or "Medieval Architecture" and thinks: "I don't know anything about this! I'll fail!"
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-semibold text-sm mb-2">✅ The Solution:</p>
            <p className="text-sm text-gray-700 mb-2 font-semibold">
              Remember: <strong>You don't need background knowledge!</strong>
            </p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>• IELTS tests your <strong>reading skills</strong>, not your knowledge</li>
              <li>• All answers are IN the passage</li>
              <li>• Focus on understanding the text, not the subject</li>
              <li>• Even if topic is unfamiliar, you can answer using reading strategies</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Mistake 10 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-red-600">❌ Mistake #10: Doing Matching Headings First</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-lg mb-3">
            <p className="font-semibold text-sm mb-2">The Problem:</p>
            <p className="text-sm text-gray-700">
              Students start with Matching Headings (the most difficult and time-consuming question type), waste 10-15 minutes, and run out of time for easier questions.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-semibold text-sm mb-2">✅ The Solution:</p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>• <strong>Always do Matching Headings LAST</strong></li>
              <li>• Answer easier question types first (MCQ, True/False, Gap-fill)</li>
              <li>• By the time you do Matching Headings, you'll already know the passage well</li>
              <li>• This strategy saves time and reduces stress</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader>
          <CardTitle>🎯 Quick Checklist Before You Submit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>All 40 questions answered (no blanks)</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Spelling copied correctly from passage</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Word limits respected (e.g., NO MORE THAN TWO WORDS)</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Answer format matches instructions (T/F or True/False)</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Answers transferred to answer sheet correctly</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>🚀 Ready to Practice Without These Mistakes?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Now you know what to avoid! Apply these tips in your practice.</p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/reading/learn/vocabulary">
              <Button variant="outline" className="w-full">Academic Vocabulary →</Button>
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
