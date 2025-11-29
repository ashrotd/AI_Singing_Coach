-- SQL Schema to run in Supabase SQL Editor

-- Enable UUID extension (for generating unique IDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE IF NOT EXISTS sessions (
  -- Primary key: unique identifier for each session
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- User identification
  user_id UUID,

  -- Audio file URL
  audio_url TEXT,

  -- Pitch analysis results stored as JSON
  pitch_data JSONB,

  -- AI-generated text
  feedback TEXT,

  -- Overall score (0-100)
  score INTEGER CHECK (score >= 0 AND score <= 100),

  -- Duration of the recording in seconds
  duration_seconds DECIMAL,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,

  -- Date for this progress entry
  date DATE NOT NULL,

  -- Aggregate statistics
  average_score DECIMAL,
  total_sessions INTEGER DEFAULT 0,
  total_practice_time INTEGER DEFAULT 0, -- in seconds

  -- Best performance that day
  best_score INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),

  -- Ensure one entry per user per day
  UNIQUE(user_id, date)
);


CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Exercise details
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT, 

  -- Instructions
  instructions TEXT,
  audio_example_url TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);


-- Speed up queries by user_id
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);

-- Speed up queries by date
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_progress_date ON progress(date);


-- Insert some sample exercises
INSERT INTO exercises (name, description, difficulty, category, instructions) VALUES
  (
    'Breathing Exercise - Hiss Technique',
    'Build diaphragm strength and breath control',
    'beginner',
    'breath_support',
    '1. Stand up straight\n2. Take a deep breath through your nose\n3. Exhale slowly making a "sssss" sound\n4. Try to sustain for 20 seconds\n5. Repeat 5 times'
  ),
  (
    'Pitch Matching - Single Notes',
    'Improve pitch accuracy by matching reference tones',
    'beginner',
    'pitch_accuracy',
    '1. Play a note on piano or use an app\n2. Sing "ah" to match the pitch\n3. Hold steady for 5 seconds\n4. Move to the next note\n5. Practice with C4, D4, E4, F4, G4'
  ),
  (
    'Sirens - Full Range',
    'Develop vocal range and smooth transitions',
    'intermediate',
    'range',
    '1. Start at your lowest comfortable note\n2. Sing "ooo" and glide up to your highest note\n3. Come back down smoothly\n4. Imagine a siren sound\n5. Repeat 3 times'
  )
ON CONFLICT DO NOTHING;


-- Update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on sessions table
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- View: Recent sessions with scores
CREATE OR REPLACE VIEW recent_sessions_view AS
SELECT
  id,
  user_id,
  score,
  duration_seconds,
  created_at,
  DATE(created_at) as session_date
FROM sessions
ORDER BY created_at DESC;

-- ============================================
-- SECURITY (Row Level Security)
-- ============================================
-- For now, we'll keep it simple. Add RLS when we add auth.

-- Enable RLS (we'll configure policies later when we add authentication)
-- ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify everything is set up correctly:

-- Check if tables exist:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check sample exercises:
-- SELECT * FROM exercises;

-- ============================================
-- SUCCESS!
-- ============================================
-- Your database is ready!
-- Next steps:
-- 1. Run this file in Supabase SQL Editor
-- 2. Verify tables were created
-- 3. Test with the backend API
