import { useState, useCallback } from 'react';
import { evaluateWriting, suggestVocabularyUpgrades, generateModelAnswer, checkWordCount, type WritingFeedback } from '@/services/writing';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface WritingSubmission {
  id: string;
  topicId: string;
  essay: string;
  wordCount: number;
  feedback: WritingFeedback;
  createdAt: string;
}

export function useWritingEvaluation() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<WritingFeedback | null>(null);

  const submitEssay = useCallback(async (
    essay: string,
    topicId: string,
    taskType: 'task1' | 'task2',
    prompt: string
  ): Promise<WritingFeedback | null> => {
    if (!user) {
      setError('Not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Check word count first
      const wordCountCheck = checkWordCount(essay, taskType);
      if (!wordCountCheck.isSufficient) {
        setError(`Word count too low. ${wordCountCheck.feedback}`);
        setLoading(false);
        return null;
      }

      // Get AI evaluation
      const feedback = await evaluateWriting(essay, taskType, prompt);
      setCurrentFeedback(feedback);

      // Save to database
      await supabase.from('writing_submissions').insert({
        user_id: user.id,
        topic_id: topicId,
        essay,
        word_count: wordCountCheck.count,
        ai_feedback: feedback,
        overall_band: feedback.overallBand,
        task_response: feedback.taskResponse,
        coherence: feedback.coherence,
        lexical_resource: feedback.lexicalResource,
        grammar: feedback.grammar,
      });

      return feedback;
    } catch (err) {
      console.error('Writing submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to evaluate essay');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getVocabularySuggestions = useCallback(async (essay: string) => {
    try {
      return await suggestVocabularyUpgrades(essay);
    } catch (err) {
      console.error('Vocabulary suggestion error:', err);
      return [];
    }
  }, []);

  const getModelAnswer = useCallback(async (
    prompt: string,
    taskType: 'task1' | 'task2',
    targetBand: number = 7.5
  ) => {
    try {
      return await generateModelAnswer(prompt, taskType, targetBand);
    } catch (err) {
      console.error('Model answer error:', err);
      return null;
    }
  }, []);

  const clearFeedback = useCallback(() => {
    setCurrentFeedback(null);
    setError(null);
  }, []);

  return {
    submitEssay,
    getVocabularySuggestions,
    getModelAnswer,
    checkWordCount,
    loading,
    error,
    currentFeedback,
    clearFeedback,
  };
}
