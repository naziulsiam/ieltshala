'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

const SAMPLE_AUDIOS = [
  {
    id: 1,
    title: 'Conversation about Weekend Plans',
    section: 'Section 1',
    difficulty: 'Easy',
    transcript: `Woman: Hi Tom, do you have any plans for this weekend?
Tom: Not really, Sarah. I was thinking of just relaxing at home. Why?
Woman: Well, there's a new art exhibition opening at the City Gallery on Saturday. Would you like to come?
Tom: That sounds interesting. What time does it start?
Woman: It opens at 10 AM, but I think we should go around 2 PM to avoid the morning crowd.
Tom: Good idea. How much are the tickets?
Woman: It's free entry, but donations are welcome.
Tom: Perfect! Should we meet at the gallery or somewhere else first?
Woman: Let's meet at the coffee shop next to the gallery at 1:45 PM.
Tom: Sounds great! I'll see you then.`,
    questions: [
      {
        id: 1,
        question: 'What are the speakers discussing?',
        options: ['Weekend plans', 'Work schedule', 'Holiday trip', 'Shopping'],
        correct: 0,
      },
      {
        id: 2,
        question: 'Where is the art exhibition?',
        options: ['City Museum', 'City Gallery', 'Town Hall', 'Art School'],
        correct: 1,
      },
      {
        id: 3,
        question: 'What time does the exhibition open?',
        options: ['9 AM', '10 AM', '11 AM', '2 PM'],
        correct: 1,
      },
      {
        id: 4,
        question: 'Why do they plan to go at 2 PM?',
        options: [
          'It closes early',
          'To avoid the morning crowd',
          'They have other plans',
          'Tickets are cheaper',
        ],
        correct: 1,
      },
      {
        id: 5,
        question: 'Where will they meet?',
        options: [
          'At the gallery entrance',
          'At Tom\'s house',
          'At the coffee shop',
          'At the bus stop',
        ],
        correct: 2,
      },
    ],
  },
  {
    id: 2,
    title: 'University Lecture on Renewable Energy',
    section: 'Section 4',
    difficulty: 'Medium',
    transcript: `Good morning, everyone. Today we'll be discussing renewable energy sources and their impact on our environment. As you know, fossil fuels have been the primary source of energy for over a century, but they're not sustainable in the long term.

Solar energy is one of the most promising renewable sources. Modern solar panels can convert up to 22% of sunlight into electricity, and this efficiency continues to improve. Countries like Germany and Japan have invested heavily in solar infrastructure.

Wind energy is another important renewable source. Wind turbines can now generate electricity at costs comparable to conventional power plants. Offshore wind farms are particularly effective because ocean winds are stronger and more consistent than those on land.

Hydroelectric power has been used for decades and remains the largest source of renewable electricity globally. However, building new dams can have environmental impacts on local ecosystems.

The transition to renewable energy is not just an environmental necessity but also an economic opportunity. The renewable energy sector has created millions of jobs worldwide and this number is expected to grow significantly in the coming years.`,
    questions: [
      {
        id: 1,
        question: 'What is the main topic of the lecture?',
        options: [
          'Fossil fuels',
          'Renewable energy',
          'Environmental problems',
          'Job creation',
        ],
        correct: 1,
      },
      {
        id: 2,
        question: 'What percentage of sunlight can modern solar panels convert?',
        options: ['Up to 15%', 'Up to 18%', 'Up to 22%', 'Up to 25%'],
        correct: 2,
      },
      {
        id: 3,
        question: 'Why are offshore wind farms particularly effective?',
        options: [
          'They are cheaper',
          'Ocean winds are stronger and more consistent',
          'They take less space',
          'They require less maintenance',
        ],
        correct: 1,
      },
      {
        id: 4,
        question: 'What is mentioned as a concern about hydroelectric power?',
        options: [
          'It is too expensive',
          'It generates pollution',
          'Environmental impacts on ecosystems',
          'It is not efficient',
        ],
        correct: 2,
      },
      {
        id: 5,
        question: 'What benefit of renewable energy is mentioned besides environmental?',
        options: [
          'Lower taxes',
          'Job creation',
          'Better technology',
          'Improved health',
        ],
        correct: 1,
      },
    ],
  },
];

export default function ListeningPracticePage() {
  const [selectedAudio, setSelectedAudio] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [startTime] = useState(Date.now());

  const currentAudio = SAMPLE_AUDIOS[selectedAudio];

  const handleAnswerChange = (questionId: number, optionIndex: number) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const calculateScore = () => {
    let correct = 0;
    currentAudio.questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correct++;
      }
    });
    return correct;
  };

  const saveProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const correctAnswers = calculateScore();
      const totalQuestions = currentAudio.questions.length;
      const percentage = (correctAnswers / totalQuestions) * 100;
      
      // Convert percentage to IELTS band (approximate)
      let bandScore = 0;
      if (percentage >= 90) bandScore = 9.0;
      else if (percentage >= 80) bandScore = 8.0;
      else if (percentage >= 70) bandScore = 7.0;
      else if (percentage >= 60) bandScore = 6.0;
      else if (percentage >= 50) bandScore = 5.0;
      else if (percentage >= 40) bandScore = 4.0;
      else bandScore = 3.0;

      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      await fetch('http://localhost:5000/api/progress/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          module: 'listening',
          activityType: 'practice',
          score: bandScore,
          details: {
            questionsCorrect: correctAnswers,
            questionsTotal: totalQuestions,
            timeSpent,
            section: currentAudio.section,
          },
          feedback: `Completed ${currentAudio.title}. Score: ${correctAnswers}/${totalQuestions}`,
        }),
      });

      toast.success('✅ Progress saved!');
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const handleSubmit = async () => {
    const correctAnswers = calculateScore();
    const totalQuestions = currentAudio.questions.length;
    setScore(correctAnswers);
    setIsSubmitted(true);

    // Save progress to database
    await saveProgress();

    toast.success(`You got ${correctAnswers} out of ${totalQuestions} correct!`);
  };

  const handleReset = () => {
    setAnswers({});
    setIsSubmitted(false);
    setScore(null);
    setShowTranscript(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/dashboard/listening" className="text-emerald-600 hover:underline mb-4 inline-block">
        ← Back to Listening
      </Link>

      <h1 className="text-3xl font-bold mb-6">🎧 Listening Practice</h1>

      {/* Audio Selection */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {SAMPLE_AUDIOS.map((audio, index) => (
          <button
            key={audio.id}
            onClick={() => {
              setSelectedAudio(index);
              handleReset();
            }}
            disabled={isSubmitted}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selectedAudio === index
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🎵</span>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">
                  {audio.section}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    audio.difficulty === 'Easy'
                      ? 'bg-green-100 text-green-700'
                      : audio.difficulty === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {audio.difficulty}
                </span>
              </div>
            </div>
            <p className="font-semibold">{audio.title}</p>
            <p className="text-xs text-gray-500 mt-1">{audio.questions.length} questions</p>
          </button>
        ))}
      </div>

      {/* Results Display */}
      {isSubmitted && score !== null && (
        <Card className="mb-6 border-2 border-emerald-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-5xl mb-3">
                {score === currentAudio.questions.length ? '🎉' : score >= currentAudio.questions.length / 2 ? '✅' : '🎧'}
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Score: {score} / {currentAudio.questions.length}
              </h3>
              <p className="text-gray-600 mb-4">
                {score === currentAudio.questions.length
                  ? 'Perfect! Excellent listening skills!'
                  : score >= currentAudio.questions.length / 2
                  ? 'Good job! Keep practicing.'
                  : 'Keep practicing to improve your score.'}
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={handleReset}>Try Again</Button>
                <Button
                  onClick={() => setShowTranscript(!showTranscript)}
                  variant="outline"
                >
                  {showTranscript ? 'Hide' : 'Show'} Transcript
                </Button>
                <Button
                  onClick={() => {
                    if (selectedAudio < SAMPLE_AUDIOS.length - 1) {
                      setSelectedAudio(selectedAudio + 1);
                      handleReset();
                    }
                  }}
                  variant="outline"
                  disabled={selectedAudio === SAMPLE_AUDIOS.length - 1}
                >
                  Next Audio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transcript (shown after submission) */}
      {showTranscript && isSubmitted && (
        <Card className="mb-6 bg-gray-50">
          <CardHeader>
            <CardTitle>📝 Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              {currentAudio.transcript.split('\n').map((line, index) => (
                <p key={index} className="mb-2">
                  {line}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Audio Player Simulation */}
        <Card>
          <CardHeader>
            <CardTitle>{currentAudio.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-12 rounded-lg text-center mb-6">
              <div className="text-6xl mb-4">🎧</div>
              <p className="text-lg font-semibold mb-2">{currentAudio.section}</p>
              <p className="text-sm text-gray-600 mb-4">
                In a real test, you would listen to audio here
              </p>
              <div className="bg-white p-4 rounded-lg inline-block">
                <p className="text-xs text-gray-500 mb-2">For practice, read the transcript below:</p>
                <Button
                  onClick={() => setShowTranscript(!showTranscript)}
                  variant="outline"
                  size="sm"
                >
                  {showTranscript ? 'Hide' : 'Show'} Audio Text
                </Button>
              </div>
            </div>

            {showTranscript && !isSubmitted && (
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <p className="text-sm font-semibold mb-3 text-orange-600">
                  ⚠️ Read this carefully (simulating listening):
                </p>
                {currentAudio.transcript.split('\n').map((line, index) => (
                  <p key={index} className="mb-2 text-sm">
                    {line}
                  </p>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm">
                <strong>💡 Tip:</strong> In the actual IELTS test, you'll hear the audio only once or twice. 
                Take notes while listening!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 h-[600px] overflow-y-auto">
              {currentAudio.questions.map((question, qIndex) => (
                <div key={question.id} className="border-b pb-4">
                  <p className="font-semibold mb-3">
                    {qIndex + 1}. {question.question}
                  </p>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = answers[question.id] === optionIndex;
                      const isCorrect = optionIndex === question.correct;
                      const showResult = isSubmitted;

                      return (
                        <button
                          key={optionIndex}
                          onClick={() => !isSubmitted && handleAnswerChange(question.id, optionIndex)}
                          disabled={isSubmitted}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                            showResult
                              ? isCorrect
                                ? 'border-green-500 bg-green-50'
                                : isSelected
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200'
                              : isSelected
                              ? 'border-emerald-600 bg-emerald-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                                showResult
                                  ? isCorrect
                                    ? 'border-green-500 bg-green-500 text-white'
                                    : isSelected
                                    ? 'border-red-500 bg-red-500 text-white'
                                    : 'border-gray-300'
                                  : isSelected
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
                                  : 'border-gray-300'
                              }`}
                            >
                              {String.fromCharCode(65 + optionIndex)}
                            </span>
                            <span>{option}</span>
                            {showResult && isCorrect && <span className="ml-auto text-green-600">✓</span>}
                            {showResult && isSelected && !isCorrect && <span className="ml-auto text-red-600">✗</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {!isSubmitted && (
              <div className="mt-6">
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  className="w-full"
                  disabled={Object.keys(answers).length !== currentAudio.questions.length}
                >
                  Submit Answers ({Object.keys(answers).length}/{currentAudio.questions.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="mt-6 bg-blue-50">
        <CardContent className="p-6">
          <h3 className="font-bold mb-3">💡 Listening Tips:</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600">✓</span>
              <span>Read the questions before listening to know what to focus on</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600">✓</span>
              <span>Take notes while listening - you won't hear it again in the real test</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600">✓</span>
              <span>Pay attention to keywords and synonyms</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600">✓</span>
              <span>Your progress is automatically saved after submission!</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
