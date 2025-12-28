'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

const TASK_1_PROMPTS = [
  {
    id: 1,
    type: 'Line Graph',
    prompt: 'The graph below shows the number of tourists visiting a particular Caribbean island between 2010 and 2017.',
    wordCount: 150,
  },
  {
    id: 2,
    type: 'Bar Chart',
    prompt: 'The bar chart shows the percentage of Australian men and women in different age groups who did regular physical activity in 2010.',
    wordCount: 150,
  },
  {
    id: 3,
    type: 'Pie Chart',
    prompt: 'The pie charts show the main reasons for migration to and from the UK in 2007.',
    wordCount: 150,
  },
];

const TASK_2_PROMPTS = [
  {
    id: 1,
    type: 'Opinion',
    prompt: 'Some people believe that technology has made our lives more complicated. To what extent do you agree or disagree?',
    wordCount: 250,
  },
  {
    id: 2,
    type: 'Discussion',
    prompt: 'Some people think that parents should teach children how to be good members of society. Others believe that school is the place to learn this. Discuss both views and give your own opinion.',
    wordCount: 250,
  },
  {
    id: 3,
    type: 'Problem-Solution',
    prompt: 'Many cities are facing serious environmental pollution. What are the causes of this problem and what measures can be taken to solve it?',
    wordCount: 250,
  },
];

interface ParsedEvaluation {
  overallBand?: string;
  taskResponse?: { score: string; feedback: string };
  coherence?: { score: string; feedback: string };
  lexical?: { score: string; feedback: string };
  grammar?: { score: string; feedback: string };
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
  rawText: string;
}

export default function WritingPracticePage() {
  const [selectedTask, setSelectedTask] = useState<1 | 2>(1);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [essay, setEssay] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<ParsedEvaluation | null>(null);

  const prompts = selectedTask === 1 ? TASK_1_PROMPTS : TASK_2_PROMPTS;
  const currentPrompt = prompts[selectedPromptIndex];

  const parseEvaluation = (text: string): ParsedEvaluation => {
    const parsed: ParsedEvaluation = { rawText: text };

    // Extract overall band score
    const overallMatch = text.match(/overall.*?band.*?(?:score)?:?\s*(\d+\.?\d*)/i);
    if (overallMatch) parsed.overallBand = overallMatch[1];

    // Extract individual scores and feedback
    const criteriaPatterns = [
      { key: 'taskResponse', names: ['task achievement', 'task response'] },
      { key: 'coherence', names: ['coherence and cohesion', 'coherence & cohesion'] },
      { key: 'lexical', names: ['lexical resource', 'vocabulary'] },
      { key: 'grammar', names: ['grammatical range and accuracy', 'grammar'] },
    ];

    criteriaPatterns.forEach(({ key, names }) => {
      for (const name of names) {
        const regex = new RegExp(`${name}.*?(?:score)?:?\\s*(\\d+\\.?\\d*)([\\s\\S]*?)(?=(?:\\d+\\.|$|strengths|weaknesses|suggestions|overall))`, 'i');
        const match = text.match(regex);
        if (match) {
          parsed[key as keyof ParsedEvaluation] = {
            score: match[1],
            feedback: match[2].trim().substring(0, 200),
          } as any;
          break;
        }
      }
    });

    // Extract strengths
    const strengthsMatch = text.match(/strengths?:?\s*([\s\S]*?)(?=weaknesses|suggestions|overall|$)/i);
    if (strengthsMatch) {
      parsed.strengths = strengthsMatch[1]
        .split(/[\n\-•]/)
        .map(s => s.trim())
        .filter(s => s.length > 10)
        .slice(0, 5);
    }

    // Extract weaknesses
    const weaknessesMatch = text.match(/weaknesses?:?\s*([\s\S]*?)(?=suggestions|overall|$)/i);
    if (weaknessesMatch) {
      parsed.weaknesses = weaknessesMatch[1]
        .split(/[\n\-•]/)
        .map(s => s.trim())
        .filter(s => s.length > 10)
        .slice(0, 5);
    }

    // Extract suggestions
    const suggestionsMatch = text.match(/suggestions?:?\s*([\s\S]*?)$/i);
    if (suggestionsMatch) {
      parsed.suggestions = suggestionsMatch[1]
        .split(/[\n\-•]/)
        .map(s => s.trim())
        .filter(s => s.length > 10)
        .slice(0, 5);
    }

    return parsed;
  };

  const saveProgress = async (score: number, feedback: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await fetch('http://localhost:5000/api/progress/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          module: 'writing',
          activityType: 'practice',
          score,
          details: {
            taskType: selectedTask === 1 ? 'task1' : 'task2',
            wordCount,
          },
          feedback,
        }),
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const handleEssayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setEssay(text);
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
  };

  const handleSubmit = async () => {
    if (wordCount < currentPrompt.wordCount) {
      toast.error(`Your essay is too short! You need at least ${currentPrompt.wordCount} words. You have ${wordCount} words.`);
      return;
    }

    setIsEvaluating(true);
    setEvaluation(null);

    try {
      const response = await fetch('http://localhost:5000/api/evaluate/writing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          essay,
          taskType: selectedTask,
          prompt: currentPrompt.prompt,
        }),
      });

      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        toast.error('Backend returned invalid response. Check if backend is running correctly.');
        setIsEvaluating(false);
        return;
      }

      if (data.success) {
        const parsed = parseEvaluation(data.evaluation);
        setEvaluation(parsed);
        toast.success('✅ Essay evaluated successfully!');

        // Save progress to database
        if (parsed.overallBand) {
          await saveProgress(parseFloat(parsed.overallBand), data.evaluation);
        }
      } else {
        toast.error(data.error || 'Failed to evaluate essay');
      }
    } catch (error) {
      console.error('Evaluation error:', error);
      toast.error('❌ Failed to connect to evaluation service. Make sure backend is running on port 5000!');
    } finally {
      setIsEvaluating(false);
    }
  };

  const getBandColor = (score?: string) => {
    if (!score) return 'bg-gray-100 text-gray-700';
    const num = parseFloat(score);
    if (num >= 8) return 'bg-green-100 text-green-700 border-green-300';
    if (num >= 7) return 'bg-blue-100 text-blue-700 border-blue-300';
    if (num >= 6) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-orange-100 text-orange-700 border-orange-300';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/dashboard/writing" className="text-emerald-600 hover:underline mb-4 inline-block">
        ← Back to Writing
      </Link>

      <h1 className="text-3xl font-bold mb-6">✍️ Writing Practice</h1>

      {/* Task Selection */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => { 
            setSelectedTask(1); 
            setSelectedPromptIndex(0); 
            setEssay(''); 
            setWordCount(0); 
            setEvaluation(null);
          }}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
            selectedTask === 1
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Task 1 (150 words)
        </button>
        <button
          onClick={() => { 
            setSelectedTask(2); 
            setSelectedPromptIndex(0); 
            setEssay(''); 
            setWordCount(0); 
            setEvaluation(null);
          }}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
            selectedTask === 2
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Task 2 (250 words)
        </button>
      </div>

      {/* Prompt Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select a Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            {prompts.map((prompt, index) => (
              <button
                key={prompt.id}
                onClick={() => { 
                  setSelectedPromptIndex(index); 
                  setEssay(''); 
                  setWordCount(0); 
                  setEvaluation(null);
                }}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedPromptIndex === index
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold mb-1">{prompt.type}</p>
                <p className="text-xs text-gray-500">Prompt {prompt.id}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Prompt */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📝 Task {selectedTask} - {currentPrompt.type}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 rounded-lg mb-4">
            <p className="text-gray-800">{currentPrompt.prompt}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>⏱️ Time: {selectedTask === 1 ? '20' : '40'} minutes</span>
            <span>📝 Minimum: {currentPrompt.wordCount} words</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Writing Area */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Write Your Answer</CardTitle>
              <div className={`text-sm font-semibold ${
                wordCount >= currentPrompt.wordCount ? 'text-green-600' : 'text-orange-600'
              }`}>
                {wordCount} / {currentPrompt.wordCount} words
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <textarea
              value={essay}
              onChange={handleEssayChange}
              placeholder="Start writing your essay here..."
              className="w-full h-96 p-4 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none resize-none"
              disabled={isEvaluating}
            />

            <div className="mt-4 flex gap-3">
              <Button 
                onClick={handleSubmit} 
                size="lg"
                disabled={isEvaluating || wordCount < currentPrompt.wordCount}
              >
                {isEvaluating ? '⏳ Evaluating...' : '🤖 Evaluate Essay'}
              </Button>
              <Button
                onClick={() => { 
                  setEssay(''); 
                  setWordCount(0); 
                  setEvaluation(null);
                }}
                variant="outline"
                size="lg"
                disabled={isEvaluating}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Results */}
        <div className="space-y-6">
          {isEvaluating && (
            <Card>
              <CardContent className="p-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mb-4"></div>
                  <p className="text-gray-600 font-medium">Analyzing your essay...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take 10-15 seconds</p>
                </div>
              </CardContent>
            </Card>
          )}

          {!isEvaluating && !evaluation && (
            <Card>
              <CardContent className="p-12">
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="font-medium">Write your essay and click</p>
                  <p className="font-bold text-emerald-600 text-lg mt-1">"Evaluate Essay"</p>
                  <p className="text-sm mt-2">to get detailed IELTS feedback</p>
                </div>
              </CardContent>
            </Card>
          )}

          {!isEvaluating && evaluation && (
            <>
              {/* Overall Band Score */}
              {evaluation.overallBand && (
                <Card className="border-2 border-emerald-600">
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">Overall Band Score</p>
                    <div className="text-5xl font-bold text-emerald-600 mb-2">
                      {evaluation.overallBand}
                    </div>
                    <p className="text-sm text-gray-500">IELTS Writing Band</p>
                  </CardContent>
                </Card>
              )}

              {/* Individual Scores */}
              <div className="grid grid-cols-2 gap-4">
                {evaluation.taskResponse && (
                  <Card className={`border-2 ${getBandColor(evaluation.taskResponse.score)}`}>
                    <CardContent className="p-4">
                      <p className="text-xs font-semibold mb-1">
                        {selectedTask === 1 ? 'Task Achievement' : 'Task Response'}
                      </p>
                      <p className="text-3xl font-bold">{evaluation.taskResponse.score}</p>
                    </CardContent>
                  </Card>
                )}

                {evaluation.coherence && (
                  <Card className={`border-2 ${getBandColor(evaluation.coherence.score)}`}>
                    <CardContent className="p-4">
                      <p className="text-xs font-semibold mb-1">Coherence & Cohesion</p>
                      <p className="text-3xl font-bold">{evaluation.coherence.score}</p>
                    </CardContent>
                  </Card>
                )}

                {evaluation.lexical && (
                  <Card className={`border-2 ${getBandColor(evaluation.lexical.score)}`}>
                    <CardContent className="p-4">
                      <p className="text-xs font-semibold mb-1">Lexical Resource</p>
                      <p className="text-3xl font-bold">{evaluation.lexical.score}</p>
                    </CardContent>
                  </Card>
                )}

                {evaluation.grammar && (
                  <Card className={`border-2 ${getBandColor(evaluation.grammar.score)}`}>
                    <CardContent className="p-4">
                      <p className="text-xs font-semibold mb-1">Grammar</p>
                      <p className="text-3xl font-bold">{evaluation.grammar.score}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Strengths */}
              {evaluation.strengths && evaluation.strengths.length > 0 && (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-700">✅ Strengths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {evaluation.strengths.map((strength, i) => (
                        <li key={i} className="text-sm text-green-800 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Weaknesses */}
              {evaluation.weaknesses && evaluation.weaknesses.length > 0 && (
                <Card className="bg-orange-50 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-orange-700">⚠️ Areas to Improve</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {evaluation.weaknesses.map((weakness, i) => (
                        <li key={i} className="text-sm text-orange-800 flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Suggestions */}
              {evaluation.suggestions && evaluation.suggestions.length > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-700">💡 Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {evaluation.suggestions.map((suggestion, i) => (
                        <li key={i} className="text-sm text-blue-800 flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      {/* Tips */}
      <Card className="mt-6 bg-blue-50">
        <CardContent className="p-6">
          <h3 className="font-bold mb-3">💡 Writing Tips:</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600">✓</span>
              <span>Plan your essay for 5 minutes before writing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600">✓</span>
              <span>Use the structures you learned in the Learn section</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600">✓</span>
              <span>Write more than the minimum word count (160 for Task 1, 270 for Task 2)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600">✓</span>
              <span>Your progress is automatically saved to track improvement!</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
