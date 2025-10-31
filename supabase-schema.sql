-- HōMI Database Schema for Supabase
-- Run this in your Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Assessments table
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  income DECIMAL NOT NULL,
  savings DECIMAL NOT NULL,
  monthly_debt DECIMAL NOT NULL,
  credit_score_range TEXT,
  target_price DECIMAL NOT NULL,
  confidence INTEGER CHECK (confidence >= 1 AND confidence <= 10),
  job_stability TEXT,
  life_stability TEXT,
  location TEXT,
  timeline TEXT,
  total_score INTEGER,
  financial_score INTEGER,
  emotional_score INTEGER,
  timing_score INTEGER,
  decision TEXT CHECK (decision IN ('YES', 'NO', 'NOT YET')),
  message TEXT,
  recommendations JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Waitlist table
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  score INTEGER,
  source TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  event_type TEXT NOT NULL,
  properties JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_created_at ON assessments(created_at);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow public insert to waitlist
CREATE POLICY "Allow public waitlist signup" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow public read of waitlist count
CREATE POLICY "Allow public waitlist count" ON waitlist
  FOR SELECT
  TO anon
  USING (true);

-- Allow public insert to assessments
CREATE POLICY "Allow public assessment creation" ON assessments
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow public insert to events
CREATE POLICY "Allow public event creation" ON events
  FOR INSERT
  TO anon
  WITH CHECK (true);
