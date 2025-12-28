'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function Task2LearnPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/writing" className="text-primary-500 hover:underline mb-4 inline-block">
        ← Back to Writing
      </Link>

      <h1 className="text-3xl font-bold mb-6">Task 2: Essay Writing</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📋 Task Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="font-bold">40 Minutes</div>
              <div className="text-sm text-gray-600">Recommended time</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-3xl mb-2">📏</div>
              <div className="font-bold">250+ Words</div>
              <div className="text-sm text-gray-600">Minimum requirement</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-bold">67% Weight</div>
              <div className="text-sm text-gray-600">Of total Writing score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📝 Essay Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { 
                type: 'Opinion (Agree/Disagree)', 
                example: 'Some people think that university students should study whatever they like. Others believe that they should only study subjects that will be useful in the future. Discuss both views and give your opinion.',
                structure: 'Introduction → Opinion → Support 1 → Support 2 → Conclusion'
              },
              { 
                type: 'Discussion (Both Views)', 
                example: 'Some people believe that technology makes life more complex. Others think it makes life easier. Discuss both views and give your opinion.',
                structure: 'Introduction → View 1 → View 2 → Your Opinion → Conclusion'
              },
              { 
                type: 'Advantages & Disadvantages', 
                example: 'In many countries, people are now living longer than ever before. What are the advantages and disadvantages of this trend?',
                structure: 'Introduction → Advantages → Disadvantages → Conclusion'
              },
              { 
                type: 'Problem & Solution', 
                example: 'Many cities are facing serious air pollution problems. What are the causes and what solutions can you suggest?',
                structure: 'Introduction → Problems → Solutions → Conclusion'
              },
              { 
                type: 'Two-Part Question', 
                example: 'Why do people choose to live in big cities? What problems does this cause?',
                structure: 'Introduction → Answer Q1 → Answer Q2 → Conclusion'
              },
            ].map((item) => (
              <div key={item.type} className="p-4 border-l-4 border-primary-500 bg-gray-50 rounded">
                <h4 className="font-bold mb-2">{item.type}</h4>
                <p className="text-sm italic text-gray-700 mb-2">"{item.example}"</p>
                <p className="text-xs text-gray-600">Structure: {item.structure}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🏗️ The Standard 4-Paragraph Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Introduction */}
            <div className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50">
              <h4 className="font-bold mb-2">1. Introduction (2-3 sentences, 40-50 words)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="font-semibold">Sentence 1:</span>
                  <span>Paraphrase the question/topic</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold">Sentence 2:</span>
                  <span>State your position/thesis</span>
                </div>
              </div>
              <div className="mt-3 p-3 bg-white rounded">
                <p className="text-xs font-semibold mb-1">Example (Opinion Essay):</p>
                <p className="text-sm text-gray-700">
                  "The debate over whether students should have freedom to choose their university subjects or focus on practical disciplines continues to attract attention. <strong>While both perspectives have merit, I believe that a balanced approach combining personal interests with career prospects is most beneficial.</strong>"
                </p>
              </div>
            </div>

            {/* Body 1 */}
            <div className="border-l-4 border-green-500 pl-4 py-3 bg-green-50">
              <h4 className="font-bold mb-2">2. Body Paragraph 1 (5-6 sentences, 90-100 words)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="font-semibold">Sentence 1:</span>
                  <span>Topic sentence (main idea)</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold">Sentences 2-4:</span>
                  <span>Explanation + Example</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold">Sentence 5:</span>
                  <span>Link back to question</span>
                </div>
              </div>
              <div className="mt-3 p-3 bg-white rounded">
                <p className="text-xs font-semibold mb-1">Example:</p>
                <p className="text-sm text-gray-700">
                  "<strong>On one hand, allowing students to pursue their passions can lead to greater academic success.</strong> When individuals study subjects they genuinely enjoy, they are more likely to remain motivated and engaged throughout their education. For instance, a student passionate about literature may excel in English studies and eventually become a successful writer or teacher. This intrinsic motivation often results in better performance and job satisfaction in the long term."
                </p>
              </div>
            </div>

            {/* Body 2 */}
            <div className="border-l-4 border-purple-500 pl-4 py-3 bg-purple-50">
              <h4 className="font-bold mb-2">3. Body Paragraph 2 (5-6 sentences, 90-100 words)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="font-semibold">Sentence 1:</span>
                  <span>Topic sentence (contrasting or supporting point)</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold">Sentences 2-4:</span>
                  <span>Explanation + Example</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold">Sentence 5:</span>
                  <span>Link back to question</span>
                </div>
              </div>
              <div className="mt-3 p-3 bg-white rounded">
                <p className="text-xs font-semibold mb-1">Example:</p>
                <p className="text-sm text-gray-700">
                  "<strong>On the other hand, focusing on career-oriented subjects addresses practical employment concerns.</strong> In today's competitive job market, graduates with skills in high-demand fields such as engineering or computer science often find employment more easily. Moreover, practical subjects frequently offer higher salaries and better job security. However, this approach should not completely dismiss personal interests, as job satisfaction is equally important for long-term career success."
                </p>
              </div>
            </div>

            {/* Conclusion */}
            <div className="border-l-4 border-orange-500 pl-4 py-3 bg-orange-50">
              <h4 className="font-bold mb-2">4. Conclusion (2-3 sentences, 40-50 words)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="font-semibold">Sentence 1:</span>
                  <span>Summarize main points</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold">Sentence 2:</span>
                  <span>Restate your opinion (NO new ideas)</span>
                </div>
              </div>
              <div className="mt-3 p-3 bg-white rounded">
                <p className="text-xs font-semibold mb-1">Example:</p>
                <p className="text-sm text-gray-700">
                  "<strong>In conclusion, while both personal interests and career prospects are important considerations, the ideal approach involves balancing both factors.</strong> Universities should encourage students to pursue their passions while also providing guidance on career opportunities to ensure both satisfaction and employability."
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>💡 Essential Linking Words</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Adding Information:</h4>
              <p className="text-sm">Furthermore, Moreover, In addition, Additionally, Besides</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Contrasting:</h4>
              <p className="text-sm">However, Nevertheless, On the other hand, By contrast, Although</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Giving Examples:</h4>
              <p className="text-sm">For example, For instance, Such as, To illustrate, Specifically</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Showing Results:</h4>
              <p className="text-sm">Therefore, Consequently, As a result, Thus, Hence</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Listing Points:</h4>
              <p className="text-sm">Firstly, Secondly, Finally, To begin with, Lastly</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Concluding:</h4>
              <p className="text-sm">In conclusion, To sum up, Overall, In summary, All in all</p>
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
              <span>Write at least 250 words (aim for 270-290)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Answer ALL parts of the question</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Give clear examples to support your points</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Use a variety of sentence structures</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Check grammar and spelling</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Plan for 5 minutes before writing</span>
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
              <span>Don't write less than 250 words</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't memorize essays - examiners can tell</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't use informal language or contractions (don't, can't)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't add new ideas in the conclusion</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✗</span>
              <span>Don't repeat the same words - use synonyms</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>🎯 Ready to Practice Task 2?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Write a full essay and get detailed AI feedback with band scores!</p>
          <Link href="/dashboard/writing/practice?task=2">
            <Button size="lg" className="w-full">Start Task 2 Practice →</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
