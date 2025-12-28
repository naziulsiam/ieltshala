'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

const PART_1_QUESTIONS = [
  'Do you work or study?',
  'What do you like to do in your free time?',
  'Do you prefer to stay at home or go out with friends?',
  'What kind of music do you like?',
  'How often do you use public transportation?',
  'Do you enjoy cooking? Why or why not?',
];

const PART_2_TOPICS = [
  {
    id: 1,
    title: 'Describe a person who has influenced you',
    points: [
      'Who this person is',
      'How you know them',
      'What they have done to influence you',
      'And explain why this person is important to you',
    ],
  },
  {
    id: 2,
    title: 'Describe a place you would like to visit',
    points: [
      'Where this place is',
      'How you learned about it',
      'What you would do there',
      'And explain why you want to visit this place',
    ],
  },
  {
    id: 3,
    title: 'Describe a memorable event from your childhood',
    points: [
      'What the event was',
      'When it happened',
      'Who was involved',
      'And explain why it was memorable',
    ],
  },
];

const PART_3_QUESTIONS = [
  'How do people choose their role models?',
  'Do you think celebrities are good role models for young people?',
  'How has the concept of role models changed over time?',
  'What qualities make someone a good leader?',
  'How important is education in developing leadership skills?',
];

export default function SpeakingPracticePage() {
  const [selectedPart, setSelectedPart] = useState<1 | 2 | 3>(1);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [overallScore, setOverallScore] = useState<number | null>(null);

  const getCurrentQuestion = () => {
    if (selectedPart === 1) return PART_1_QUESTIONS[selectedQuestionIndex];
    if (selectedPart === 2) return PART_2_TOPICS[selectedQuestionIndex].title;
    return PART_3_QUESTIONS[selectedQuestionIndex];
  };

  const getPartDescription = () => {
    if (selectedPart === 1) return 'Introduction & Interview (4-5 minutes)';
    if (selectedPart === 2) return 'Long Turn (3-4 minutes)';
    return 'Discussion (4-5 minutes)';
  };

  const extractOverallScore = (evaluationText: string): number | null => {
    // Try to extract overall band score from evaluation
    const patterns = [
      /overall.*?band.*?score.*?:?\s*(\d+\.?\d*)/i,
      /overall.*?score.*?:?\s*(\d+\.?\d*)/i,
      /band.*?score.*?:?\s*(\d+\.?\d*)/i,
    ];

    for (const pattern of patterns) {
      const match = evaluationText.match(pattern);
      if (match) {
        const score = parseFloat(match[1]);
        if (score >= 0 && score <= 9) {
          return score;
        }
      }
    }
    return null;
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
          module: 'speaking',
          activityType: 'practice',
          score,
          details: {
            part: selectedPart,
            responseLength: transcript.length,
          },
          feedback,
        }),
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const handleEvaluate = async () => {
    if (!transcript.trim()) {
      toast.error('Please write your speaking response first!');
      return;
    }

    if (transcript.trim().split(/\s+/).length < 30) {
      toast.error('Your response is too short. Please provide a more detailed answer.');
      return;
    }

    setIsEvaluating(true);
    setEvaluation(null);
    setOverallScore(null);

    try {
      const response = await fetch('http://localhost:5000/api/evaluate/speaking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          part: selectedPart,
          question: getCurrentQuestion(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEvaluation(data.evaluation);
        const score = extractOverallScore(data.evaluation);
        setOverallScore(score);
        toast.success('✅ Response evaluated successfully!');

        // Save progress to database
        if (score) {
          await saveProgress(score, data.evaluation);
        }
      } else {
        toast.error(data.error || 'Failed to evaluate response');
      }
    } catch (error) {
      console.error('Evaluation error:', error);
      toast.error('❌ Failed to connect to evaluation service. Make sure backend is running!');
    } finally {
      setIsEvaluating(false);
    }
  };

  const getBandColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-300';
    if (score >= 7) return 'text-blue-600 bg-blue-50 border-blue-300';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-300';
    return 'text-orange-600 bg-orange-50 border-orange-300';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/dashboard/speaking" className="text-emerald-600 hover:underline mb-4 inline-block">
        ← Back to Speaking
      </Link>

      <h1 className="text-3xl font-bold mb-6">🎤 Speaking Practice</h1>

      {/* Part Selection */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((part) => (
          <button
            key={part}
            onClick={() => {
              setSelectedPart(part as 1 | 2 | 3);
              setSelectedQuestionIndex(0);
              setTranscript('');
              setEvaluation(null);
              setOverallScore(null);
            }}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedPart === part
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">
              {part === 1 ? '👋' : part === 2 ? '📢' : '💬'}
            </div>
            <p className="font-bold mb-1">Part {part}</p>
            <p className="text-xs text-gray-600">
              {part === 1 ? '4-5 min' : part === 2 ? '3-4 min' : '4-5 min'}
            </p>
          </button>
        ))}
      </div>

      {/* Question/Topic Selection */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Part {selectedPart}: {getPartDescription()}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {selectedPart === 2 ? (
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-3">
                {PART_2_TOPICS.map((topic, index) => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setSelectedQuestionIndex(index);
                      setTranscript('');
                      setEvaluation(null);
                      setOverallScore(null);
                    }}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      selectedQuestionIndex === index
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-sm">Topic {topic.id}</p>
                  </button>
                ))}
              </div>

              {/* Current Topic Card */}
              <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                <h3 className="font-bold text-lg mb-4">{PART_2_TOPICS[selectedQuestionIndex].title}</h3>
                <p className="text-sm font-semibold mb-2">You should say:</p>
                <ul className="space-y-2">
                  {PART_2_TOPICS[selectedQuestionIndex].points.map((point, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-emerald-600">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-3 bg-blue-100 rounded">
                  <p className="text-sm font-semibold">
                    ⏱️ You will have 1 minute to prepare and should speak for 2-3 minutes.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(selectedPart === 1 ? PART_1_QUESTIONS : PART_3_QUESTIONS).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedQuestionIndex(index);
                      setTranscript('');
                      setEvaluation(null);
                      setOverallScore(null);
                    }}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      selectedQuestionIndex === index
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-sm font-medium line-clamp-2">{question}</p>
                  </button>
                ))}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <p className="font-semibold text-lg text-gray-800">{getCurrentQuestion()}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Response Area */}
        <Card>
          <CardHeader>
            <CardTitle>Your Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                💡 <strong>Tip:</strong> Record yourself speaking and transcribe your response here, 
                or write what you would say.
              </p>
            </div>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Type or paste your speaking response here..."
              className="w-full h-80 p-4 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none resize-none"
              disabled={isEvaluating}
            />

            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">
                {transcript.trim() ? transcript.trim().split(/\s+/).length : 0} words
              </p>
            </div>

            <div className="mt-4 flex gap-3">
              <Button
                onClick={handleEvaluate}
                size="lg"
                disabled={isEvaluating || !transcript.trim()}
              >
                {isEvaluating ? '⏳ Evaluating...' : '🤖 Evaluate Response'}
              </Button>
              <Button
                onClick={() => {
                  setTranscript('');
                  setEvaluation(null);
                  setOverallScore(null);
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
        <Card>
          <CardHeader>
            <CardTitle>📊 AI Evaluation</CardTitle>
          </CardHeader>
          <CardContent>
            {isEvaluating && (
              <div className="flex flex-col items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mb-4"></div>
                <p className="text-gray-600 font-medium">Analyzing your response...</p>
                <p className="text-sm text-gray-500 mt-2">This may take 10-15 seconds</p>
              </div>
            )}

            {!isEvaluating && !evaluation && (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <div className="text-6xl mb-4">🎤</div>
                <p className="font-medium">Write your response and click</p>
                <p className="font-bold text-emerald-600 text-lg mt-1">"Evaluate Response"</p>
                <p className="text-sm mt-2">to get detailed IELTS feedback</p>
              </div>
            )}

            {!isEvaluating && evaluation && (
              <div className="space-y-4">
                {/* Overall Score */}
                {overallScore && (
                  <div className={`p-6 rounded-lg border-2 text-center ${getBandColor(overallScore)}`}>
                    <p className="text-sm font-semibold mb-2">Overall Band Score</p>
                    <p className="text-5xl font-bold mb-1">{overallScore.toFixed(1)}</p>
                    <p className="text-xs">IELTS Speaking Band</p>
                  </div>
                )}

                {/* Detailed Feedback */}
                <div className="prose prose-sm max-w-none h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg">
                  <div className="whitespace-pre-wrap">{evaluation}</div>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-800">
                    ✅ <strong>Evaluation complete!</strong> Your progress has been saved. 
                    Review the feedback and work on suggested improvements.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="mt-6 bg-blue-50">
        <CardContent className="p-6">
          <h3 className="font-bold mb-3">💡 Speaking Tips:</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold mb-2">Part 1:</p>
              <ul className="space-y-1 text-gray-700">
                <li>• Answer directly and briefly</li>
                <li>• Give reasons for your answers</li>
                <li>• Speak naturally and fluently</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Part 2:</p>
              <ul className="space-y-1 text-gray-700">
                <li>• Use your preparation time wisely</li>
                <li>• Cover all bullet points</li>
                <li>• Speak for the full 2 minutes</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Part 3:</p>
              <ul className="space-y-1 text-gray-700">
                <li>• Give detailed, developed answers</li>
                <li>• Support opinions with examples</li>
                <li>• Use a range of vocabulary</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
