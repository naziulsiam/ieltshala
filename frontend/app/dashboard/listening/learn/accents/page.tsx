'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function AccentsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/listening" className="text-primary-500 hover:underline mb-4 inline-block">
        ← Back to Listening
      </Link>

      <h1 className="text-3xl font-bold mb-6">Understanding Different English Accents</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          💡 <strong>IELTS uses speakers from various countries!</strong> You might hear British, American, Australian, Canadian, or New Zealand accents.
        </p>
      </div>

      {/* British Accent */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🇬🇧 British English (RP - Received Pronunciation)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Most common in IELTS. Clear, formal pronunciation.
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-bold mb-2">Key Features:</h4>
              <ul className="text-sm space-y-1 ml-4">
                <li>• "R" at end of words not pronounced strongly (car → "cah", water → "wotah")</li>
                <li>• "A" sound in words like "bath, grass, dance" sounds like "ah"</li>
                <li>• "T" in the middle of words is pronounced clearly (water, better)</li>
              </ul>
            </div>

            <div className="bg-white border p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Common Words to Practice:</h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <div>
                  <p><strong>schedule</strong> → "SHED-yool" (not "SKED-yool")</p>
                  <p><strong>privacy</strong> → "PRIV-uh-see" (not "PRY-vuh-see")</p>
                  <p><strong>vitamin</strong> → "VIT-uh-min" (not "VY-tuh-min")</p>
                </div>
                <div>
                  <p><strong>tomato</strong> → "tuh-MAH-toe" (not "tuh-MAY-toe")</p>
                  <p><strong>lieutenant</strong> → "lef-TEN-unt" (not "loo-TEN-unt")</p>
                  <p><strong>advertisement</strong> → "ad-VERT-is-ment"</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* American Accent */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🇺🇸 American English</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Second most common. More relaxed pronunciation.
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-bold mb-2">Key Features:</h4>
              <ul className="text-sm space-y-1 ml-4">
                <li>• "R" at end of words is pronounced strongly (car, water)</li>
                <li>• "T" in middle of words sounds like "D" (water → "wader", better → "bedder")</li>
                <li>• "A" in "bath, grass" sounds like "a" in "cat"</li>
              </ul>
            </div>

            <div className="bg-white border p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Common Words to Practice:</h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <div>
                  <p><strong>schedule</strong> → "SKED-yool"</p>
                  <p><strong>privacy</strong> → "PRY-vuh-see"</p>
                  <p><strong>vitamin</strong> → "VY-tuh-min"</p>
                </div>
                <div>
                  <p><strong>tomato</strong> → "tuh-MAY-toe"</p>
                  <p><strong>lieutenant</strong> → "loo-TEN-unt"</p>
                  <p><strong>aluminum</strong> → "uh-LOO-mih-num"</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Australian Accent */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🇦🇺 Australian English</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Similar to British but with unique vowel sounds.
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-bold mb-2">Key Features:</h4>
              <ul className="text-sm space-y-1 ml-4">
                <li>• "A" sounds like "I" (day → "die", mate → "mite")</li>
                <li>• "I" sounds like "OI" (five → "foive", like → "loike")</li>
                <li>• Rising intonation at end of statements (sounds like questions)</li>
              </ul>
            </div>

            <div className="bg-white border p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Words That Sound Different:</h4>
              <div className="text-sm space-y-1">
                <p><strong>today</strong> → sounds like "to-dye"</p>
                <p><strong>email</strong> → sounds like "ee-mile"</p>
                <p><strong>Australia</strong> → "Oss-TRY-lee-uh"</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Accents */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🌍 Other Accents You Might Hear</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-bold mb-2">🇨🇦 Canadian English</h4>
              <p className="text-sm text-gray-600">Very similar to American, but "about" sounds like "aboot"</p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-bold mb-2">🇳🇿 New Zealand English</h4>
              <p className="text-sm text-gray-600">Similar to Australian, but "e" sounds like "i" (pen → "pin")</p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-bold mb-2">🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scottish English</h4>
              <p className="text-sm text-gray-600">Strong "R" pronunciation, unique vowel sounds</p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-bold mb-2">🇮🇪 Irish English</h4>
              <p className="text-sm text-gray-600">Melodic intonation, "th" can sound like "t" or "d"</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Tips */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🎯 How to Get Familiar with Different Accents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-bold mb-2">1. Watch Shows/Movies</h4>
              <ul className="text-sm space-y-1 ml-4">
                <li>• British: BBC News, Doctor Who, The Crown</li>
                <li>• American: CNN, Friends, any Hollywood movie</li>
                <li>• Australian: ABC News Australia, Home and Away</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-bold mb-2">2. Listen to Podcasts</h4>
              <p className="text-sm">Find podcasts from different English-speaking countries</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-bold mb-2">3. Use YouTube</h4>
              <p className="text-sm">Search for "British accent vs American accent" comparison videos</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-bold mb-2">4. Practice with IELTS Materials</h4>
              <p className="text-sm">Use official Cambridge IELTS books - they include various accents</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Numbers */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🔢 Numbers Pronunciation Differences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white border p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Numbers You Must Know:</h4>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-2 font-mono">
                <div><strong>Number</strong></div>
                <div><strong>British</strong></div>
                <div><strong>American</strong></div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>0</div>
                <div>"oh" or "zero"</div>
                <div>"zero"</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>13 vs 30</div>
                <div>thirTEEN vs THIRty</div>
                <div>thirTEEN vs THIRty</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>14 vs 40</div>
                <div>fourTEEN vs FORty</div>
                <div>fourTEEN vs FORty</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>15 vs 50</div>
                <div>fifTEEN vs FIFty</div>
                <div>fifTEEN vs FIFty</div>
              </div>
            </div>
            <p className="text-xs text-red-600 mt-3">⚠️ Listen carefully for stress! 13/30, 14/40, 15/50 are common traps!</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>🎧 Practice Makes Perfect!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">The more you listen to different accents, the easier IELTS becomes!</p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/listening/learn/traps">
              <Button variant="outline" className="w-full">Common Traps →</Button>
            </Link>
            <Link href="/dashboard/listening/learn/note-taking">
              <Button variant="outline" className="w-full">Note-Taking →</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
