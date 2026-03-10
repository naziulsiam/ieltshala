import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, Trash2, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHalaChat } from '@/hooks/useHalaChat';
import { cn } from '@/lib/utils';

interface HalaChatProps {
  isOpen: boolean;
  onClose: () => void;
  context?: 'general' | 'speaking' | 'writing' | 'vocabulary' | 'listening' | 'reading';
}

const contextLabels = {
  general: 'General IELTS Help',
  speaking: 'Speaking Practice',
  writing: 'Writing Help',
  vocabulary: 'Vocabulary',
  listening: 'Listening Tips',
  reading: 'Reading Strategies',
};

const quickQuestions = [
  'How do I improve my writing Task 2?',
  'What vocabulary should I learn for Band 7?',
  'How to reduce filler words in speaking?',
  'Tips for managing time in Reading?',
  'Common grammar mistakes to avoid?',
];

export function HalaChat({ isOpen, onClose, context = 'general' }: HalaChatProps) {
  const { messages, loading, error, sendMessage, clearChat } = useHalaChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const message = input.trim();
    setInput('');
    
    try {
      await sendMessage(message, context);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question, context);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-accent/10 to-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold">Hala AI</h3>
              <p className="text-xs text-muted-foreground">{contextLabels[context]}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Ask me anything about IELTS!</h4>
                <p className="text-sm text-muted-foreground">
                  I'm Hala, your AI IELTS tutor. I can help with writing, speaking, vocabulary, and more.
                </p>
              </div>
              
              {/* Quick Questions */}
              <div className="pt-4">
                <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQuickQuestion(q)}
                      className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-accent/20 transition-colors text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'flex-row-reverse' : ''
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gradient-to-br from-accent to-purple-500 text-white'
                  )}
                >
                  {message.role === 'user' ? 'You' : 'H'}
                </div>

                {/* Message */}
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-secondary text-foreground rounded-tl-sm'
                  )}
                >
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))
          )}

          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">H</span>
              </div>
              <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-card">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Hala anything..."
              className="flex-1 min-h-[44px] max-h-[120px] px-3 py-2.5 rounded-xl border bg-secondary/50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
              rows={1}
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              variant="coral"
              size="icon"
              className="shrink-0"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            Powered by AI • Responses are for practice only
          </p>
        </div>
      </div>
    </div>
  );
}
