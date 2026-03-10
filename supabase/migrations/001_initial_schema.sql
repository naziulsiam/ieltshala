-- Enable Row Level Security
alter table if exists public.profiles enable row level security;

-- Create tables

-- Profiles table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  target_band decimal(2,1) default 7.0,
  native_language text default 'Bengali',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Categories for vocabulary
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  emoji text,
  description text,
  created_at timestamptz default now()
);

-- Vocabulary words
create table if not exists public.words (
  id uuid primary key default gen_random_uuid(),
  word text not null,
  phonetic text,
  part_of_speech text,
  level text check (level in ('B1','B2','C1','C2')),
  definition text not null,
  example text,
  bengali text,
  bengali_translit text,
  synonyms text[],
  collocations text[],
  category_id uuid references public.categories(id),
  audio_url text,
  created_at timestamptz default now()
);

-- User progress for vocabulary (replaces localStorage)
create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  word_id uuid references public.words(id) on delete cascade not null,
  difficulty text check (difficulty in ('easy','learning','hard')),
  next_review timestamptz,
  interval_days int default 1,
  ease_factor decimal(3,2) default 2.5,
  review_count int default 0,
  is_bookmarked boolean default false,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, word_id)
);

-- User stats (streak, daily progress, etc.)
create table if not exists public.user_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null unique,
  daily_learned text[] default '{}',
  daily_date text default to_char(now(), 'YYYY-MM-DD'),
  streak int default 0,
  last_study_date timestamptz,
  total_words_learned int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Speaking practice sessions
create table if not exists public.speaking_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  topic_id text,
  mode text, -- 'ai-interview', 'quickfire', 'cuecard'
  audio_recording_url text,
  transcript text,
  ai_feedback jsonb,
  overall_band decimal(2,1),
  fluency_score decimal(2,1),
  pronunciation_score decimal(2,1),
  lexical_score decimal(2,1),
  grammar_score decimal(2,1),
  created_at timestamptz default now()
);

-- Writing practice submissions
create table if not exists public.writing_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  topic_id text,
  essay text not null,
  word_count int,
  ai_feedback jsonb,
  overall_band decimal(2,1),
  task_response decimal(2,1),
  coherence decimal(2,1),
  lexical_resource decimal(2,1),
  grammar decimal(2,1),
  created_at timestamptz default now()
);

-- Hala AI conversations
create table if not exists public.hala_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  messages jsonb not null default '[]',
  context text, -- 'general', 'speaking', 'writing', 'vocabulary'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security Policies

-- Profiles: Users can only read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Words: Everyone can read (public vocabulary)
create policy "Words are viewable by everyone"
  on public.words for select
  to authenticated, anon
  using (true);

-- Categories: Everyone can read
create policy "Categories are viewable by everyone"
  on public.categories for select
  to authenticated, anon
  using (true);

-- User Progress: Users can only access their own progress
create policy "Users can view own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete own progress"
  on public.user_progress for delete
  using (auth.uid() = user_id);

-- User Stats: Users can only access their own stats
create policy "Users can view own stats"
  on public.user_stats for select
  using (auth.uid() = user_id);

create policy "Users can insert own stats"
  on public.user_stats for insert
  with check (auth.uid() = user_id);

create policy "Users can update own stats"
  on public.user_stats for update
  using (auth.uid() = user_id);

-- Speaking Sessions: Users can only access their own sessions
create policy "Users can view own speaking sessions"
  on public.speaking_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own speaking sessions"
  on public.speaking_sessions for insert
  with check (auth.uid() = user_id);

-- Writing Submissions: Users can only access their own submissions
create policy "Users can view own writing submissions"
  on public.writing_submissions for select
  using (auth.uid() = user_id);

create policy "Users can insert own writing submissions"
  on public.writing_submissions for insert
  with check (auth.uid() = user_id);

-- Hala Conversations: Users can only access their own conversations
create policy "Users can view own conversations"
  on public.hala_conversations for select
  using (auth.uid() = user_id);

create policy "Users can insert own conversations"
  on public.hala_conversations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own conversations"
  on public.hala_conversations for update
  using (auth.uid() = user_id);

-- Functions and Triggers

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function update_updated_at_column();

create trigger update_user_progress_updated_at
  before update on public.user_progress
  for each row execute function update_updated_at_column();

create trigger update_user_stats_updated_at
  before update on public.user_stats
  for each row execute function update_updated_at_column();

create trigger update_hala_conversations_updated_at
  before update on public.hala_conversations
  for each row execute function update_updated_at_column();

-- Function to handle new user signup (creates profile and stats)
create or replace function handle_new_user()
returns trigger as $$
begin
  -- Create profile
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  
  -- Create user stats
  insert into public.user_stats (user_id, daily_date)
  values (
    new.id,
    to_char(now(), 'YYYY-MM-DD')
  );
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Insert default categories
insert into public.categories (name, emoji, description) values
  ('Education', '🎓', 'Academic study, university life, and learning'),
  ('Environment', '🌍', 'Climate change, pollution, and conservation'),
  ('Technology', '💻', 'Digital communication, AI, and innovation'),
  ('Health', '🏥', 'Medical treatment, mental health, and fitness'),
  ('Work', '💼', 'Employment, business, and professional skills'),
  ('Travel', '✈️', 'Tourism, transportation, and culture'),
  ('Government', '🏛️', 'Political systems and law'),
  ('Arts', '🎨', 'Visual arts, performing arts, and literature'),
  ('Urban Life', '🏙️', 'City planning and housing'),
  ('Family', '👨‍👩‍👧', 'Relationships and social issues'),
  ('Abstract', '🧠', 'Philosophy, ethics, and logic'),
  ('Science', '🔬', 'Biology, physics, and scientific method')
on conflict (name) do nothing;
