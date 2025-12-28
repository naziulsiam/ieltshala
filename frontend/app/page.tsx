import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              I
            </div>
            <span className="text-2xl font-bold text-gray-900">
              IELTS<span className="text-primary-500">hala</span>
            </span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
            🇧🇩 Made for Bangladesh
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to <span className="text-primary-500">IELTShala</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Your AI-powered companion for IELTS success. Practice Speaking, Writing, Reading, and Listening with intelligent feedback in both English and Bangla.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register">
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                🚀 Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                Login
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Bilingual Support</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Everything You Need to Ace IELTS
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-primary-500 rounded-3xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-8">Join Thousands of Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-bold mb-2">10,000+</div>
              <div className="text-primary-100">Active Learners</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50,000+</div>
              <div className="text-primary-100">Practice Sessions</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">7.5+</div>
              <div className="text-primary-100">Average Band Score</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of students preparing for IELTS success</p>
          <Link href="/register">
            <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
              Start Learning Now - It's Free! 🎉
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-24">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center font-bold text-xl">
              I
            </div>
            <span className="text-2xl font-bold">
              IELTS<span className="text-primary-500">hala</span>
            </span>
          </div>
          <p className="text-gray-400 mb-4">AI-Powered IELTS Learning Platform for Bangladesh</p>
          <p className="text-sm text-gray-500">© 2025 IELTShala. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: '🎤',
    title: 'AI Speaking Practice',
    description: 'Get real-time feedback on fluency, pronunciation, and grammar with AI-powered voice analysis',
  },
  {
    icon: '✍️',
    title: 'Writing Evaluation',
    description: 'Instant band scores with detailed corrections, improvements, and model answers',
  },
  {
    icon: '📖',
    title: 'Reading & Listening',
    description: 'Practice with timed tests, detailed explanations, and progress tracking',
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    description: 'Monitor your improvement with comprehensive analytics and personalized insights',
  },
];
