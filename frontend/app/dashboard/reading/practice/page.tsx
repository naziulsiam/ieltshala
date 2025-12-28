'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

const SAMPLE_PASSAGES = [
  {
    id: 1,
    title: 'The History of Coffee',
    difficulty: 'Easy',
    passage: `Coffee is one of the world's most popular beverages. The coffee plant, from which the beans are harvested, originated in Ethiopia. According to legend, it was a goat herder named Kaldi who first discovered coffee's energizing effects when he noticed his goats becoming more lively after eating the berries from a certain tree.

From Ethiopia, coffee cultivation spread to Yemen, where Sufi monks used it to stay awake during long prayer sessions. By the 15th century, coffee had reached Persia, Egypt, and Turkey. Coffee houses, called "qahveh khaneh," began appearing in cities across the Middle East. These establishments became important social gathering places.

Coffee reached Europe in the 17th century and quickly became popular despite initial resistance from some religious groups. By the mid-17th century, there were over 300 coffee houses in London alone. Today, coffee is grown in over 70 countries, and millions of people around the world start their day with a cup of coffee.`,
    questions: [
      {
        id: 1,
        question: 'Where did the coffee plant originate?',
        options: ['Yemen', 'Ethiopia', 'Turkey', 'Persia'],
        correct: 1,
      },
      {
        id: 2,
        question: 'Who is said to have discovered coffee\'s energizing effects?',
        options: ['A Sufi monk', 'Kaldi', 'A Turkish merchant', 'A European trader'],
        correct: 1,
      },
      {
        id: 3,
        question: 'What were coffee houses in the Middle East called?',
        options: ['Cafeteria', 'Qahveh khaneh', 'Coffee shop', 'Cafe'],
        correct: 1,
      },
      {
        id: 4,
        question: 'When did coffee reach Europe?',
        options: ['15th century', '16th century', '17th century', '18th century'],
        correct: 2,
      },
      {
        id: 5,
        question: 'In how many countries is coffee grown today?',
        options: ['Over 50', 'Over 70', 'Over 100', 'Over 150'],
        correct: 1,
      },
    ],
  },
  {
    id: 2,
    title: 'Climate Change and Technology',
    difficulty: 'Medium',
    passage: `Climate change represents one of the most significant challenges facing humanity in the 21st century. Rising global temperatures, extreme weather events, and melting ice caps are just some of the visible effects of this phenomenon. However, technology is emerging as a powerful tool in the fight against climate change.

Renewable energy technologies, such as solar panels and wind turbines, have become increasingly efficient and cost-effective. In many regions, renewable energy is now cheaper than fossil fuels. Electric vehicles are becoming mainstream, with major car manufacturers committing to phase out petrol and diesel engines within the next two decades.

Artificial intelligence and big data analytics are being used to optimize energy consumption in buildings and cities. Smart grids can balance electricity supply and demand in real-time, reducing waste and improving efficiency. Carbon capture technology, though still in development, shows promise for removing CO2 directly from the atmosphere.

Despite these technological advances, experts emphasize that technology alone cannot solve the climate crisis. Changes in human behavior, government policies, and international cooperation are equally important. The transition to a sustainable future requires a combination of innovation and collective action.`,
    questions: [
      {
        id: 1,
        question: 'What is described as one of the most significant challenges in the 21st century?',
        options: ['Poverty', 'Climate change', 'Disease', 'War'],
        correct: 1,
      },
      {
        id: 2,
        question: 'How has the cost of renewable energy changed?',
        options: ['It has increased', 'It has remained the same', 'It has become cheaper', 'It varies by region'],
        correct: 2,
      },
      {
        id: 3,
        question: 'What do major car manufacturers plan to do with petrol and diesel engines?',
        options: ['Improve them', 'Phase them out', 'Export them', 'Reduce production'],
        correct: 1,
      },
      {
        id: 4,
        question: 'What can smart grids do?',
        options: ['Generate electricity', 'Balance supply and demand', 'Capture carbon', 'Power vehicles'],
        correct: 1,
      },
      {
        id: 5,
        question: 'According to the passage, can technology alone solve the climate crisis?',
        options: ['Yes, completely', 'No, other factors are needed', 'Only with AI', 'Not mentioned'],
        correct: 1,
      },
    ],
  },
  {
    id: 3,
    title: 'The Impact of Social Media',
    difficulty: 'Hard',
    passage: `Social media has fundamentally transformed the way humans communicate and interact. What began as simple platforms for connecting with friends has evolved into complex ecosystems that influence politics, commerce, and culture on a global scale. The implications of this transformation are both profound and multifaceted.

On the positive side, social media has democratized information and given voice to marginalized communities. Activists can organize movements, artists can reach global audiences, and individuals can maintain relationships across vast distances. During natural disasters and emergencies, social media platforms have proven invaluable for coordinating relief efforts and disseminating critical information.

However, these platforms also present significant challenges. The spread of misinformation and "fake news" has become a major concern, potentially influencing elections and public health crises. The algorithms that determine what content users see can create "echo chambers," where people are only exposed to viewpoints similar to their own. Mental health experts have raised concerns about social media's impact on well-being, particularly among young people, citing issues such as anxiety, depression, and addiction.

Privacy concerns are another critical issue. Social media companies collect vast amounts of data about their users, raising questions about consent, data security, and the potential for manipulation. The business model of many platforms relies on keeping users engaged as long as possible, sometimes at the expense of their well-being.

As society grapples with these challenges, researchers, policymakers, and technology companies are exploring solutions. These include improving digital literacy, developing better content moderation systems, and implementing stronger privacy protections. The future of social media will likely depend on finding a balance between innovation and responsibility.`,
    questions: [
      {
        id: 1,
        question: 'How has social media transformed according to the passage?',
        options: [
          'From simple platforms to complex ecosystems',
          'From paid to free services',
          'From text to video content',
          'From public to private networks',
        ],
        correct: 0,
      },
      {
        id: 2,
        question: 'What positive role has social media played during emergencies?',
        options: [
          'Entertainment',
          'Coordinating relief efforts',
          'Advertising',
          'Data collection',
        ],
        correct: 1,
      },
      {
        id: 3,
        question: 'What are "echo chambers" in the context of social media?',
        options: [
          'Audio recording features',
          'Spaces where people see only similar viewpoints',
          'Private messaging systems',
          'Video conferencing rooms',
        ],
        correct: 1,
      },
      {
        id: 4,
        question: 'What concerns have mental health experts raised?',
        options: [
          'Physical health issues',
          'Financial problems',
          'Anxiety, depression, and addiction',
          'Educational decline',
        ],
        correct: 2,
      },
      {
        id: 5,
        question: 'What does the business model of many platforms rely on?',
        options: [
          'Subscription fees',
          'Keeping users engaged',
          'Selling hardware',
          'Government funding',
        ],
        correct: 1,
      },
      {
        id: 6,
        question: 'What are proposed solutions mentioned in the passage?',
        options: [
          'Banning social media',
          'Digital literacy and privacy protections',
          'Reducing internet access',
          'Eliminating algorithms',
        ],
        correct: 1,
      },
    ],
  },
];

export default function ReadingPracticePage() {
  const [selectedPassage, setSelectedPassage] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [startTime] = useState(Date.now());

  const currentPassage = SAMPLE_PASSAGES[selectedPassage];

  const handleAnswerChange = (questionId: number, optionIndex: number) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const calculateScore = () => {
    let correct = 0;
    currentPassage.questions.forEach((q) => {
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
      const totalQuestions = currentPassage.questions.length;
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
          module: 'reading',
          activityType: 'practice',
          score: bandScore,
          details: {
            questionsCorrect: correctAnswers,
            questionsTotal: totalQuestions,
            timeSpent,
            passageDifficulty: currentPassage.difficulty,
          },
          feedback: `Completed ${currentPassage.title}. Score: ${correctAnswers}/${totalQuestions}`,
        }),
      });

      toast.success('✅ Progress saved!');
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const handleSubmit = async () => {
    const correctAnswers = calculateScore();
    const totalQuestions = currentPassage.questions.length;
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
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/dashboard/reading" className="text-emerald-600 hover:underline mb-4 inline-block">
        ← Back to Reading
      </Link>

      <h1 className="text-3xl font-bold mb-6">📖 Reading Practice</h1>

      {/* Passage Selection */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {SAMPLE_PASSAGES.map((passage, index) => (
          <button
            key={passage.id}
            onClick={() => {
              setSelectedPassage(index);
              handleReset();
            }}
            disabled={isSubmitted}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selectedPassage === index
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📄</span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  passage.difficulty === 'Easy'
                    ? 'bg-green-100 text-green-700'
                    : passage.difficulty === 'Medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {passage.difficulty}
              </span>
            </div>
            <p className="font-semibold">{passage.title}</p>
            <p className="text-xs text-gray-500 mt-1">{passage.questions.length} questions</p>
          </button>
        ))}
      </div>

      {/* Results Display */}
      {isSubmitted && score !== null && (
        <Card className="mb-6 border-2 border-emerald-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-5xl mb-3">
                {score === currentPassage.questions.length ? '🎉' : score >= currentPassage.questions.length / 2 ? '✅' : '📚'}
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Score: {score} / {currentPassage.questions.length}
              </h3>
              <p className="text-gray-600 mb-4">
                {score === currentPassage.questions.length
                  ? 'Perfect! Excellent work!'
                  : score >= currentPassage.questions.length / 2
                  ? 'Good job! Keep practicing.'
                  : 'Keep practicing to improve your score.'}
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={handleReset}>Try Again</Button>
                <Button
                  onClick={() => {
                    if (selectedPassage < SAMPLE_PASSAGES.length - 1) {
                      setSelectedPassage(selectedPassage + 1);
                      handleReset();
                    }
                  }}
                  variant="outline"
                  disabled={selectedPassage === SAMPLE_PASSAGES.length - 1}
                >
                  Next Passage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Passage */}
        <Card>
          <CardHeader>
            <CardTitle>{currentPassage.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none h-[600px] overflow-y-auto bg-gray-50 p-6 rounded-lg">
              {currentPassage.passage.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
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
              {currentPassage.questions.map((question, qIndex) => (
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
                  disabled={Object.keys(answers).length !== currentPassage.questions.length}
                >
                  Submit Answers ({Object.keys(answers).length}/{currentPassage.questions.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="mt-6 bg-blue-50">
        <CardContent className="p-6">
          <h3 className="font-bold mb-3">💡 Reading Tips:</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600">✓</span>
              <span>Skim the passage first to get a general understanding</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600">✓</span>
              <span>Read the questions before reading in detail</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600">✓</span>
              <span>Look for keywords in both questions and passage</span>
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
