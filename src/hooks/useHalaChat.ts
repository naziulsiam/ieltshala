import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { chatWithHala, quickHalaResponse, type ChatMessage } from '@/services/hala';

export interface HalaMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  context?: string;
}

export function useHalaChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<HalaMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load chat history from Supabase
  const loadHistory = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('hala_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (data?.messages) {
        const parsedMessages = data.messages as HalaMessage[];
        setMessages(parsedMessages);
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
    }
  }, [user]);

  // Save chat to Supabase
  const saveChat = useCallback(async (newMessages: HalaMessage[]) => {
    if (!user) return;

    try {
      const { data: existingChat } = await supabase
        .from('hala_conversations')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingChat) {
        await supabase
          .from('hala_conversations')
          .update({
            messages: newMessages,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingChat.id);
      } else {
        await supabase.from('hala_conversations').insert({
          user_id: user.id,
          messages: newMessages,
        });
      }
    } catch (err) {
      console.error('Error saving chat:', err);
    }
  }, [user]);

  // Send message to Hala
  const sendMessage = useCallback(async (
    content: string,
    context?: 'general' | 'speaking' | 'writing' | 'vocabulary' | 'listening' | 'reading'
  ) => {
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Add user message
      const userMessage: HalaMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toISOString(),
        context,
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      // Convert to format expected by API
      const apiMessages: ChatMessage[] = updatedMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      // Get AI response
      const response = await chatWithHala(apiMessages, context);

      // Add assistant message
      const assistantMessage: HalaMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        context,
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // Save to database
      await saveChat(finalMessages);

      return assistantMessage;
    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get response');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [messages, saveChat]);

  // Quick question (no history)
  const askQuick = useCallback(async (
    question: string,
    context?: string
  ): Promise<string> => {
    try {
      const response = await quickHalaResponse(question, context as HalaConversation['context']);
      return response;
    } catch (err) {
      console.error('Quick question error:', err);
      return 'Sorry, I could not process your question. Please try again.';
    }
  }, []);

  // Clear chat history
  const clearChat = useCallback(async () => {
    setMessages([]);
    if (user) {
      try {
        await supabase
          .from('hala_conversations')
          .delete()
          .eq('user_id', user.id);
      } catch (err) {
        console.error('Error clearing chat:', err);
      }
    }
  }, [user]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    askQuick,
    loadHistory,
    clearChat,
  };
}
