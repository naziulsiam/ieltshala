export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          target_band: number | null
          native_language: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          target_band?: number | null
          native_language?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          avatar_url?: string | null
          target_band?: number | null
          native_language?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      words: {
        Row: {
          id: string
          word: string
          phonetic: string | null
          part_of_speech: string | null
          level: string | null
          definition: string
          example: string | null
          bengali: string | null
          bengali_translit: string | null
          synonyms: string[] | null
          collocations: string[] | null
          category_id: string | null
          audio_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          word: string
          phonetic?: string | null
          part_of_speech?: string | null
          level?: string | null
          definition: string
          example?: string | null
          bengali?: string | null
          bengali_translit?: string | null
          synonyms?: string[] | null
          collocations?: string[] | null
          category_id?: string | null
          audio_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          word?: string
          phonetic?: string | null
          part_of_speech?: string | null
          level?: string | null
          definition?: string
          example?: string | null
          bengali?: string | null
          bengali_translit?: string | null
          synonyms?: string[] | null
          collocations?: string[] | null
          category_id?: string | null
          audio_url?: string | null
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          emoji: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          emoji?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          emoji?: string | null
          description?: string | null
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          word_id: string
          difficulty: string | null
          next_review: string | null
          interval_days: number | null
          ease_factor: number | null
          review_count: number | null
          is_bookmarked: boolean | null
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          word_id: string
          difficulty?: string | null
          next_review?: string | null
          interval_days?: number | null
          ease_factor?: number | null
          review_count?: number | null
          is_bookmarked?: boolean | null
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          word_id?: string
          difficulty?: string | null
          next_review?: string | null
          interval_days?: number | null
          ease_factor?: number | null
          review_count?: number | null
          is_bookmarked?: boolean | null
          note?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_stats: {
        Row: {
          id: string
          user_id: string
          daily_learned: string[] | null
          daily_date: string | null
          streak: number | null
          last_study_date: string | null
          total_words_learned: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          daily_learned?: string[] | null
          daily_date?: string | null
          streak?: number | null
          last_study_date?: string | null
          total_words_learned?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          daily_learned?: string[] | null
          daily_date?: string | null
          streak?: number | null
          last_study_date?: string | null
          total_words_learned?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      speaking_sessions: {
        Row: {
          id: string
          user_id: string
          topic_id: string | null
          mode: string | null
          audio_recording_url: string | null
          transcript: string | null
          ai_feedback: Json | null
          overall_band: number | null
          fluency_score: number | null
          pronunciation_score: number | null
          lexical_score: number | null
          grammar_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          topic_id?: string | null
          mode?: string | null
          audio_recording_url?: string | null
          transcript?: string | null
          ai_feedback?: Json | null
          overall_band?: number | null
          fluency_score?: number | null
          pronunciation_score?: number | null
          lexical_score?: number | null
          grammar_score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          topic_id?: string | null
          mode?: string | null
          audio_recording_url?: string | null
          transcript?: string | null
          ai_feedback?: Json | null
          overall_band?: number | null
          fluency_score?: number | null
          pronunciation_score?: number | null
          lexical_score?: number | null
          grammar_score?: number | null
          created_at?: string
        }
      }
      writing_submissions: {
        Row: {
          id: string
          user_id: string
          topic_id: string | null
          essay: string
          word_count: number | null
          ai_feedback: Json | null
          overall_band: number | null
          task_response: number | null
          coherence: number | null
          lexical_resource: number | null
          grammar: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          topic_id?: string | null
          essay: string
          word_count?: number | null
          ai_feedback?: Json | null
          overall_band?: number | null
          task_response?: number | null
          coherence?: number | null
          lexical_resource?: number | null
          grammar?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          topic_id?: string | null
          essay?: string
          word_count?: number | null
          ai_feedback?: Json | null
          overall_band?: number | null
          task_response?: number | null
          coherence?: number | null
          lexical_resource?: number | null
          grammar?: number | null
          created_at?: string
        }
      }
      hala_conversations: {
        Row: {
          id: string
          user_id: string
          messages: Json
          context: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          messages: Json
          context?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          messages?: Json
          context?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
