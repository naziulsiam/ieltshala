'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function Task1LearnPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/writing" className="text-primary-500 hover:underline mb-4 inline-block">
        ← Back to Writing
      </Link>

      <h1 className="text-3xl font-bold mb-6">Task 1: Academic Report Writing</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📋 Task Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="font-bold">20 Minutes</div>
              <div className="text-sm text-gray-600">Recommended time</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-3xl mb-2">📏</div>
              <div className="font-bold">150+ Words</div>
              <div className="text-sm text-gray-600">Minimum requirement</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-bold">33% Weight</div>
              <div className="text-sm text-gray-600">Of total Writing score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📊 Types of Visual Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: '📈', type: 'Line Graph', desc: 'Shows trends over time' },
              { icon: '📊', type: 'Bar Chart', desc: 'Compares different categories' },
              { icon: '🥧', type: 'Pie Chart', desc: 'Shows proportions/percentages' },
              { icon: '📉', type: 'Table', desc: 'Displays numerical data' },
              { icon: '🔄', type: 'Process Diagram', desc: 'Shows steps/stages' },
              { icon: '🗺️', type: 'Map', desc: 'Shows geographical changes' },
            ].map((item) => (
              <div key={item.type} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <h4 className="font-semibold">{item.type}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📝 The Perfect Structure (4 Paragraphs)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Paragraph 1 */}
            <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
              <h4 className="font-bold mb-2">1. Introduction (1-2 sentences)</h4>
              <p className="text-sm text-gray-700 mb-3">
                <strong>Purpose:</strong> Paraphrase the question/title
              </p>
              <div className="bg-white p-3 rounded text-sm">
                <p className="font-semibold mb-1">Example:</p>
                <p className="text-gray-600 italic mb-2">Question: "The chart below shows the percentage of households in different countries owning smartphones between 2010 and 2020."</p>
                <p className="text-green-700">✓ "The bar chart illustrates the proportion of families possessing smartphones across various nations during a ten-year period from 2010 to 2020."</p>
              </div>
            </div>

            {/* Paragraph 2 */}
            <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
              <h4 className="font-bold mb-2">2. Overview (2-3 sentences)</h4>
              <p className="text-sm text-gray-700 mb-3">
                <strong>Purpose:</strong> Summarize the main trends/features (NO specific data)
              </p>
              <div className="bg-white p-3 rounded text-sm">
                <p className="font-semibold mb-1">Example:</p>
                <p className="text-green-700">
                  "Overall, smartphone ownership increased significantly in all countries over the period. South Korea consistently had the highest percentage, while India showed the most dramatic growth."
                </p>
              </div>
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                <strong>⚠️ Important:</strong> This is the MOST important paragraph! Even if you run out of time, complete this section.
              </div>
            </div>

            {/* Paragraph 3 */}
            <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50">
              <h4 className="font-bold mb-2">3. Body Paragraph 1 (3-4 sentences)</h4>
              <p className="text-sm text-gray-700 mb-3">
                <strong>Purpose:</strong> Describe specific details with data
              </p>
              <div className="bg-white p-3 rounded text-sm">
                <p className="font-semibold mb-1">Example:</p>
                <p className="text-green-700">
                  "In 2010, South Korea led with 60% of households owning smartphones, followed by Japan at 45% and the USA at 40%. By contrast, India had the lowest figure at just 10%."
                </p>
              </div>
            </div>

            {/* Paragraph 4 */}
            <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50">
              <h4 className="font-bold mb-2">4. Body Paragraph 2 (3-4 sentences)</h4>
              <p className="text-sm text-gray-700 mb-3">
                <strong>Purpose:</strong> Continue with more specific details
              </p>
              <div className="bg-white p-3 rounded text-sm">
                <p className="font-semibold mb-1">Example:</p>
                <p className="text-green-700">
                  "Over the following decade, all nations experienced substantial growth. The most notable increase occurred in India, where the percentage soared to 75% by 2020. Meanwhile, South Korea reached 95%, maintaining its position as the leader."
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>💡 Essential Vocabulary & Phrases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Introduction Phrases:</h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <p>• "The chart illustrates..."</p>
                <p>• "The graph shows..."</p>
                <p>• "The table presents..."</p>
                <p>• "The diagram depicts..."</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Overview Phrases:</h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <p>• "Overall..."</p>
                <p>• "In general..."</p>
                <p>• "It is clear that..."</p>
                <p>• "The main trend is..."</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Describing Increases:</h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <p>• increased / rose / grew</p>
                <p>• climbed / soared / surged</p>
                <p>• experienced an upward trend</p>
                <p>• saw a significant rise</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Describing Decreases:</h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <p>• decreased / fell / dropped</p>
                <p>• declined / plummeted / slumped</p>
                <p>• experienced a downward trend</p>
                <p>• witnessed a sharp fall</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Making Comparisons:</h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <p>• compared to / in comparison with</p>
                <p>• whereas / while</p>
                <p>• by contrast / on the other hand</p>
                <p>• similarly / likewise</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Describing Data:</h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <p>• accounted for 25%</p>
                <p>• stood at 40%</p>
                <p>• reached a peak of...</p>
                <p>• hit a low of...</p>
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
              <span>Write at least 150 words (aim for 170-190)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Include an overview paragraph - it's essential!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Use specific data/numbers from the visual</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Make comparisons where relevant</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Use varied vocabulary (don't repeat same words)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Write in a formal, academic style</span>
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
              <span>Don't give your opinion or add information not in the visual</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't copy the question word-for-word in the introduction</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't include specific data in the overview</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't describe every single detail (choose main features)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't spend more than 20 minutes (save time for Task 2)</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>🎯 Ready to Practice Task 1?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Apply what you've learned and get AI feedback on your report!</p>
          <Link href="/dashboard/writing/practice?task=1">
            <Button size="lg" className="w-full">Start Task 1 Practice →</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
