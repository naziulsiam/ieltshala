'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function VocabularyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/reading" className="text-primary-500 hover:underline mb-4 inline-block">
        ← Back to Reading
      </Link>

      <h1 className="text-3xl font-bold mb-6">Academic Vocabulary for IELTS Reading</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          💡 <strong>You don't need to memorize thousands of words!</strong> Focus on understanding common academic words and recognizing synonyms.
        </p>
      </div>

      {/* Common Academic Words */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📚 Most Common Academic Words</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            These words appear frequently in IELTS Reading passages. Learn their meanings!
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded">
                <p className="font-semibold text-sm">significant</p>
                <p className="text-xs text-gray-600">= important, meaningful, considerable</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="font-semibold text-sm">substantial</p>
                <p className="text-xs text-gray-600">= large, considerable, significant</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="font-semibold text-sm">evident</p>
                <p className="text-xs text-gray-600">= clear, obvious, apparent</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="font-semibold text-sm">establish</p>
                <p className="text-xs text-gray-600">= set up, create, prove</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="font-semibold text-sm">enhance</p>
                <p className="text-xs text-gray-600">= improve, increase, strengthen</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded">
                <p className="font-semibold text-sm">comprehensive</p>
                <p className="text-xs text-gray-600">= complete, thorough, extensive</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="font-semibold text-sm">demonstrate</p>
                <p className="text-xs text-gray-600">= show, prove, illustrate</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="font-semibold text-sm">constitute</p>
                <p className="text-xs text-gray-600">= make up, form, represent</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="font-semibold text-sm">contemporary</p>
                <p className="text-xs text-gray-600">= modern, current, present-day</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="font-semibold text-sm">fundamental</p>
                <p className="text-xs text-gray-600">= basic, essential, primary</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Synonym Groups */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🔄 Important Synonym Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            IELTS loves to paraphrase! Train yourself to recognize these synonym groups.
          </p>

          <div className="space-y-3">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <p className="font-bold text-sm mb-2">INCREASE / RISE</p>
              <p className="text-sm">grow, expand, escalate, surge, soar, climb, go up, enhance, boost, augment</p>
            </div>

            <div className="p-4 border-l-4 border-red-500 bg-red-50">
              <p className="font-bold text-sm mb-2">DECREASE / FALL</p>
              <p className="text-sm">decline, drop, reduce, diminish, plummet, slump, go down, lessen, dwindle</p>
            </div>

            <div className="p-4 border-l-4 border-green-500 bg-green-50">
              <p className="font-bold text-sm mb-2">IMPORTANT / SIGNIFICANT</p>
              <p className="text-sm">crucial, vital, essential, key, major, critical, fundamental, substantial</p>
            </div>

            <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
              <p className="font-bold text-sm mb-2">SHOW / DEMONSTRATE</p>
              <p className="text-sm">illustrate, reveal, indicate, display, exhibit, present, prove, confirm</p>
            </div>

            <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
              <p className="font-bold text-sm mb-2">PROBLEM / ISSUE</p>
              <p className="text-sm">challenge, difficulty, obstacle, concern, matter, complication, dilemma</p>
            </div>

            <div className="p-4 border-l-4 border-pink-500 bg-pink-50">
              <p className="font-bold text-sm mb-2">ADVANTAGE / BENEFIT</p>
              <p className="text-sm">merit, positive aspect, strength, plus, gain, asset, pro</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Context Clues */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🔍 Using Context Clues</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Don't panic if you see an unfamiliar word! Use these strategies to guess meaning from context.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-bold text-sm mb-2">1. Look for Definitions in the Text</h4>
              <p className="text-sm text-gray-700 mb-2">Writers often define difficult words:</p>
              <div className="bg-white p-3 rounded text-sm">
                <p>"Photosynthesis, <strong>the process by which plants convert sunlight into energy</strong>, is essential for life."</p>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-bold text-sm mb-2">2. Look for Examples</h4>
              <p className="text-sm text-gray-700 mb-2">Examples help clarify meaning:</p>
              <div className="bg-white p-3 rounded text-sm">
                <p>"Nocturnal animals, <strong>such as owls and bats</strong>, are active at night."</p>
                <p className="text-gray-600 mt-1">→ nocturnal = active at night</p>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-bold text-sm mb-2">3. Look at Surrounding Words</h4>
              <p className="text-sm text-gray-700 mb-2">Context gives clues:</p>
              <div className="bg-white p-3 rounded text-sm">
                <p>"The building was dilapidated, with broken windows and crumbling walls."</p>
                <p className="text-gray-600 mt-1">→ dilapidated = in very bad condition</p>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-bold text-sm mb-2">4. Break Down the Word</h4>
              <p className="text-sm text-gray-700 mb-2">Use prefixes and suffixes:</p>
              <div className="bg-white p-3 rounded text-sm space-y-1">
                <p>• <strong>un-</strong>predictable = not predictable</p>
                <p>• <strong>pre-</strong>historic = before historic times</p>
                <p>• <strong>-able</strong> = can be done (readable, drinkable)</p>
                <p>• <strong>-less</strong> = without (hopeless, careless)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topic-Specific Vocabulary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📖 Common Topic Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            IELTS Reading passages often cover these topics. Familiarize yourself with key vocabulary:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { 
                topic: '🌍 Environment', 
                words: 'pollution, conservation, sustainable, ecosystem, renewable, deforestation, carbon footprint'
              },
              { 
                topic: '🏫 Education', 
                words: 'curriculum, academic, pedagogy, literacy, assessment, enrollment, qualification'
              },
              { 
                topic: '💻 Technology', 
                words: 'innovation, digital, automation, artificial intelligence, breakthrough, revolutionize'
              },
              { 
                topic: '🏥 Health', 
                words: 'treatment, diagnosis, symptoms, prevention, immunity, epidemic, therapy'
              },
              { 
                topic: '💼 Business', 
                words: 'commerce, profit, investment, entrepreneur, market, consumer, revenue'
              },
              { 
                topic: '🏛️ History/Culture', 
                words: 'civilization, heritage, archaeology, artifacts, tradition, customs, era'
              },
              { 
                topic: '🔬 Science', 
                words: 'research, hypothesis, experiment, analysis, theory, evidence, methodology'
              },
              { 
                topic: '👥 Society', 
                words: 'demographic, community, urban, rural, migration, diversity, inequality'
              },
            ].map((item) => (
              <div key={item.topic} className="p-4 border rounded-lg hover:border-primary-500 transition-all">
                <h4 className="font-bold text-sm mb-2">{item.topic}</h4>
                <p className="text-xs text-gray-600">{item.words}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transition Words */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🔗 Transition & Connecting Words</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            These words show relationships between ideas. Understanding them helps you follow the passage logic.
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-semibold text-sm mb-1">Adding Information:</p>
              <p className="text-xs">moreover, furthermore, in addition, additionally, besides</p>
            </div>

            <div className="p-3 bg-gray-50 rounded">
              <p className="font-semibold text-sm mb-1">Contrasting:</p>
              <p className="text-xs">however, nevertheless, on the other hand, whereas, although</p>
            </div>

            <div className="p-3 bg-gray-50 rounded">
              <p className="font-semibold text-sm mb-1">Cause & Effect:</p>
              <p className="text-xs">therefore, consequently, as a result, thus, hence</p>
            </div>

            <div className="p-3 bg-gray-50 rounded">
              <p className="font-semibold text-sm mb-1">Examples:</p>
              <p className="text-xs">for instance, for example, such as, to illustrate</p>
            </div>

            <div className="p-3 bg-gray-50 rounded">
              <p className="font-semibold text-sm mb-1">Sequencing:</p>
              <p className="text-xs">firstly, subsequently, finally, meanwhile, eventually</p>
            </div>

            <div className="p-3 bg-gray-50 rounded">
              <p className="font-semibold text-sm mb-1">Emphasizing:</p>
              <p className="text-xs">indeed, in fact, particularly, especially, notably</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>💡 Vocabulary Learning Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary-500">✓</span>
              <span>Don't try to memorize every word - focus on understanding in context</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500">✓</span>
              <span>Read English articles (BBC, The Guardian) to see words in real use</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500">✓</span>
              <span>Learn word families (e.g., significant, significance, significantly)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500">✓</span>
              <span>Practice guessing meaning from context during reading practice</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500">✓</span>
              <span>Use flashcards for words you frequently encounter</span>
            </li>
          </ul>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link href="/dashboard/vocabulary">
              <Button variant="outline" className="w-full">Practice with Flashcards →</Button>
            </Link>
            <Link href="/dashboard/reading/practice">
              <Button className="w-full">Start Reading Practice →</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
