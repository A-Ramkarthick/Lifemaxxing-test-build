-- LifeMaxxing Supabase Database Schema
-- Run these SQL commands in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  theme VARCHAR(10) DEFAULT 'dark', -- 'dark' or 'light'
  motion_reduced BOOLEAN DEFAULT FALSE,
  font_size_multiplier FLOAT DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create diary_logs table
CREATE TABLE public.diary_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  mood VARCHAR(50), -- 'happy', 'neutral', 'anxious', 'sad', 'energetic', 'calm'
  mood_score INTEGER, -- 1-10 scale
  tags TEXT[], -- Array of tags for categorization
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_history table
CREATE TABLE public.chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  agent_type VARCHAR(50) NOT NULL, -- 'fin_maxxer', 'habit_maxxer', etc.
  role VARCHAR(10) NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  context_data JSONB, -- Context sent to the agent (diary entries, goals, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create goals table
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- 'finance', 'health', 'career', etc.
  target_date DATE,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'archived'
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create goal_milestones table
CREATE TABLE public.goal_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create habits table
CREATE TABLE public.habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  frequency VARCHAR(20) DEFAULT 'daily', -- 'daily', 'weekly', 'monthly'
  target_count INTEGER DEFAULT 1, -- times per day/week/month
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'paused', 'completed'
  color VARCHAR(20), -- Agent color or custom
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create habit_logs table (tracking daily/weekly habit completion)
CREATE TABLE public.habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  count INTEGER DEFAULT 0, -- How many times completed
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create habit_streaks table
CREATE TABLE public.habit_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completed_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create relapse_logs table
CREATE TABLE public.relapse_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  context TEXT, -- What triggered the relapse
  severity VARCHAR(20), -- 'minor', 'moderate', 'severe'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  transaction_date DATE NOT NULL,
  payment_method VARCHAR(50), -- 'credit_card', 'debit_card', 'bank_transfer', etc.
  merchant VARCHAR(255),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spending_patterns table
CREATE TABLE public.spending_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  monthly_average DECIMAL(12, 2),
  trend VARCHAR(20), -- 'increasing', 'decreasing', 'stable'
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create uploads table (for PDFs, images, etc.)
CREATE TABLE public.uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50), -- 'pdf', 'image', etc.
  file_path TEXT NOT NULL, -- Path in Supabase Storage
  upload_type VARCHAR(50), -- 'bank_statement', 'profile_photo', 'screenshot', etc.
  associated_agent VARCHAR(50), -- Which agent this file is for
  metadata JSONB, -- Additional info (date extracted, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create progress_metrics table
CREATE TABLE public.progress_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  metric_type VARCHAR(50), -- 'habit_completion_rate', 'goal_progress', etc.
  category VARCHAR(50),
  value FLOAT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent_interactions table (for analytics)
CREATE TABLE public.agent_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  agent_type VARCHAR(50) NOT NULL,
  interaction_type VARCHAR(50), -- 'chat', 'advice_request', etc.
  duration_seconds INTEGER,
  satisfaction_rating INTEGER, -- 1-5
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consent_records table
CREATE TABLE public.consent_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  consent_type VARCHAR(100), -- 'photo_analysis', 'diary_analysis', etc.
  granted BOOLEAN NOT NULL,
  consent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked_date TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX idx_diary_logs_user_date ON public.diary_logs(user_id, date DESC);
CREATE INDEX idx_chat_history_user_agent ON public.chat_history(user_id, agent_type);
CREATE INDEX idx_goals_user_status ON public.goals(user_id, status);
CREATE INDEX idx_habits_user_status ON public.habits(user_id, status);
CREATE INDEX idx_habit_logs_habit_date ON public.habit_logs(habit_id, date DESC);
CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, transaction_date DESC);
CREATE INDEX idx_transactions_category ON public.transactions(user_id, category);
CREATE INDEX idx_uploads_user_type ON public.uploads(user_id, upload_type);
CREATE INDEX idx_progress_metrics_user_date ON public.progress_metrics(user_id, date DESC);

-- Set up Row-Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relapse_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spending_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own data
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Diary logs RLS
CREATE POLICY "Users can view own diary logs"
  ON public.diary_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create diary logs"
  ON public.diary_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diary logs"
  ON public.diary_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own diary logs"
  ON public.diary_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Chat history RLS
CREATE POLICY "Users can view own chat history"
  ON public.chat_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create chat messages"
  ON public.chat_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Goals RLS
CREATE POLICY "Users can view own goals"
  ON public.goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create goals"
  ON public.goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON public.goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON public.goals FOR DELETE
  USING (auth.uid() = user_id);

-- Habits RLS
CREATE POLICY "Users can view own habits"
  ON public.habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create habits"
  ON public.habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON public.habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON public.habits FOR DELETE
  USING (auth.uid() = user_id);

-- Habit logs RLS
CREATE POLICY "Users can view own habit logs"
  ON public.habit_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.habits WHERE habits.id = habit_logs.habit_id AND habits.user_id = auth.uid()));

CREATE POLICY "Users can create habit logs"
  ON public.habit_logs FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.habits WHERE habits.id = habit_logs.habit_id AND habits.user_id = auth.uid()));

-- Transactions RLS
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON public.transactions FOR DELETE
  USING (auth.uid() = user_id);

-- Uploads RLS
CREATE POLICY "Users can view own uploads"
  ON public.uploads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload files"
  ON public.uploads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('diary-images', 'diary-images', false),
  ('bank-statements', 'bank-statements', false),
  ('user-uploads', 'user-uploads', false),
  ('profile-photos', 'profile-photos', false)
ON CONFLICT DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Users can upload to their folder"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN ('diary-images', 'bank-statements', 'user-uploads', 'profile-photos')
    AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their uploads"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('diary-images', 'bank-statements', 'user-uploads', 'profile-photos')
    AND auth.uid()::text = (storage.foldername(name))[1]);
