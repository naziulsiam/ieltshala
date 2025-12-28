'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function NoteTakingPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/listening" className="text-primary-500 hover:underline mb-4 inline-block">
        ← Back to Listening
      </Link>

      <h1 className="text-3xl font-bold mb-6">Note-Taking Skills for Listening</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          💡 <strong>Speed is key!</strong> You need to write while listening. Learn abbreviations and symbols to save time.
        </p>
      </div>

      {/* Common Abbreviations */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>✍️ Essential Abbreviations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Time & Frequency:</h4>
              <div className="text-sm space-y-1 bg-gray-50 p-3 rounded">
                <p>• mins = minutes</p>
                <p>• hrs = hours</p>
                <p>• yrs = years</p>
                <p>• wk = week</p>
                <p>• mon = month</p>
                <p>• tmrw = tomorrow</p>
                <p>• yday = yesterday</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Common Words:</h4>
              <div className="text-sm space-y-1 bg-gray-50 p-3 rounded">
                <p>• info = information</p>
                <p>• lib = library</p>
                <p>• dept = department</p>
                <p>• gov = government</p>
                <p>• uni = university</p>
                <p>• max = maximum</p>
                <p>• min = minimum</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Directions:</h4>
              <div className="text-sm space-y-1 bg-gray-50 p-3 rounded">
                <p>• N/S/E/W = North/South/East/West</p>
                <p>• nr = near</p>
                <p>• opp = opposite</p>
                <p>• bet = between</p>
                <p>• nxt = next to</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">People & Places:</h4>
              <div className="text-sm space-y-1 bg-gray-50 p-3 rounded">
                <p>• Dr = doctor</p>
                <p>• Prof = professor</p>
                <p>• St = street</p>
                <p>• Ave = avenue</p>
                <p>• Rd = road</p>
                <p>• apt = apartment</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Symbols */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🔣 Useful Symbols</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2 bg-gray-50 p-4 rounded">
              <p><strong>& or +</strong> = and</p>
              <p><strong>→</strong> = leads to, results in</p>
              <p><strong>←</strong> = comes from, caused by</p>
              <p><strong>↑</strong> = increase, more, higher</p>
              <p><strong>↓</strong> = decrease, less, lower</p>
              <p><strong>=</strong> = equals, same as</p>
              <p><strong>≠</strong> = not equal, different</p>
            </div>

            <div className="space-y-2 bg-gray-50 p-4 rounded">
              <p><strong>@</strong> = at</p>
              <p><strong>#</strong> = number</p>
              <p><strong>$</strong> = money, cost</p>
              <p><strong>%</strong> = percent</p>
              <p><strong>?</strong> = question, uncertain</p>
              <p><strong>!</strong> = important</p>
              <p><strong>×</strong> = times, multiply</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What to Write */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📝 What to Write vs What to Skip</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-bold mb-3 text-green-700">✓ Always Write:</h4>
              <ul className="text-sm space-y-1">
                <li>• Numbers (dates, times, prices)</li>
                <li>• Names (people, places)</li>
                <li>• Key nouns & verbs</li>
                <li>• Specific details</li>
                <li>• Technical terms</li>
                <li>• Adjectives describing size/color</li>
              </ul>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-bold mb-3 text-red-700">✗ Don't Waste Time Writing:</h4>
              <ul className="text-sm space-y-1">
                <li>• Articles (a, an, the)</li>
                <li>• Connecting words (however, but)</li>
                <li>• Full sentences</li>
                <li>• Information not asked for</li>
                <li>• Repeated information</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Examples */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>💡 Note-Taking Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold text-sm mb-2">Example 1:</p>
              <p className="text-sm italic mb-2">
                Audio: "The library opens at 9 AM on weekdays and closes at 6 PM."
              </p>
              <p className="text-sm">
                <strong>Your notes:</strong> lib 9am-6pm wkdays ✓
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <p className="font-semibold text-sm mb-2">Example 2:</p>
              <p className="text-sm italic mb-2">
                Audio: "Dr. Sarah Johnson, who graduated from Oxford University in 2015, now works at the city hospital."
              </p>
              <p className="text-sm">
                <strong>Your notes:</strong> Dr Sarah Johnson, city hosp ✓
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="font-semibold text-sm mb-2">Example 3:</p>
              <p className="text-sm italic mb-2">
                Audio: "The apartment costs $800 per month, plus an additional $50 for utilities."
              </p>
              <p className="text-sm">
                <strong>Your notes:</strong> apt $800/mon + $50 util = $850 ✓
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🎯 Pro Note-Taking Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
              <h4 className="font-bold text-sm mb-1">1. Write While Listening (Not After)</h4>
              <p className="text-sm">Don't wait! Write immediately or you'll forget.</p>
            </div>

            <div className="p-3 border-l-4 border-green-500 bg-green-50">
              <h4 className="font-bold text-sm mb-1">2. Use Your Own Abbreviations</h4>
              <p className="text-sm">Create abbreviations that make sense to YOU. As long as you understand them!</p>
            </div>

            <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
              <h4 className="font-bold text-sm mb-1">3. Leave Space</h4>
              <p className="text-sm">If you miss something, leave a space and move on. Don't panic!</p>
            </div>

            <div className="p-3 border-l-4 border-orange-500 bg-orange-50">
              <h4 className="font-bold text-sm mb-1">4. Write Legibly Enough</h4>
              <p className="text-sm">You need to read your notes later! But don't waste time making it perfect.</p>
            </div>

            <div className="p-3 border-l-4 border-red-500 bg-red-50">
              <h4 className="font-bold text-sm mb-1">5. Spelling Counts in Final Answer</h4>
              <p className="text-sm">Notes can be messy, but when you transfer to answer sheet, spelling must be perfect!</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Exercise */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>✏️ Practice Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            Try abbreviating these sentences as fast as you can:
          </p>

          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm mb-2">1. "The university library is open Monday to Friday from 8 AM to 10 PM."</p>
              <p className="text-xs text-gray-500">Suggested: uni lib Mon-Fri 8am-10pm</p>
            </div>

            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm mb-2">2. "Professor Williams teaches mathematics on Tuesday and Thursday afternoons."</p>
              <p className="text-xs text-gray-500">Suggested: Prof Williams math Tues & Thurs PM</p>
            </div>

            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm mb-2">3. "The cost increased from $200 to $350 next month."</p>
              <p className="text-xs text-gray-500">Suggested: cost ↑ $200 → $350 nxt mon</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>🚀 Ready to Practice Listening?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Now you know how to take notes quickly! Apply these techniques in practice tests.</p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/listening/learn/strategies">
              <Button variant="outline" className="w-full">← Strategies</Button>
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
