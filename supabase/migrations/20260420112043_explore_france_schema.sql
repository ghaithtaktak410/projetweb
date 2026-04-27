
/*
  # Explore France: Interactive Quiz & Travel Portal — Initial Schema

  ## Summary
  Creates all core tables for the Explore France application prototype.

  ## New Tables
  1. `profiles` — Extends Supabase auth.users with username and role (student | admin)
  2. `regions` — French geographic regions with name, description, image, and highlights
  3. `quizzes` — Quiz records tied to regions with difficulty levels
  4. `questions` — Individual quiz questions with JSONB options array and correct answer
  5. `scores` — Student quiz attempt records with score and completion timestamp

  ## Security
  - RLS enabled on all tables
  - Profiles: users read/update their own; admins read all
  - Regions/Quizzes/Questions: public read; admin write
  - Scores: users read/insert their own; admins read all

  ## Seed Data
  - 6 French regions with images and highlights
  - 3 quizzes with 3–4 questions each covering landmarks, cuisine, and history
*/

-- =========================================================
-- PROFILES
-- =========================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- =========================================================
-- REGIONS
-- =========================================================
CREATE TABLE IF NOT EXISTS regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  highlights TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read regions"
  ON regions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert regions"
  ON regions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update regions"
  ON regions FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete regions"
  ON regions FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =========================================================
-- QUIZZES
-- =========================================================
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  region_id UUID REFERENCES regions(id) ON DELETE SET NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read quizzes"
  ON quizzes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert quizzes"
  ON quizzes FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update quizzes"
  ON quizzes FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete quizzes"
  ON quizzes FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =========================================================
-- QUESTIONS
-- =========================================================
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_answer TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read questions"
  ON questions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert questions"
  ON questions FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update questions"
  ON questions FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete questions"
  ON questions FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =========================================================
-- SCORES
-- =========================================================
CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own scores"
  ON scores FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scores"
  ON scores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can read all scores"
  ON scores FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =========================================================
-- SEED: REGIONS
-- =========================================================
INSERT INTO regions (id, name, description, image_url, highlights) VALUES
(
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Île-de-France',
  'The heart of France, home to Paris — a city of art, fashion, and gastronomy that has captivated the world for centuries.',
  'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1280',
  ARRAY['Eiffel Tower', 'Louvre Museum', 'Palace of Versailles', 'Notre-Dame Cathedral', 'Musée d''Orsay']
),
(
  'a1b2c3d4-0002-0002-0002-000000000002',
  'Provence-Alpes-Côte d''Azur',
  'A sun-drenched paradise famous for lavender fields, olive groves, the French Riviera, and a rich Provençal culture.',
  'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=1280',
  ARRAY['Lavender Fields', 'Nice & Monaco', 'Aix-en-Provence', 'Gorges du Verdon', 'Camargue Wetlands']
),
(
  'a1b2c3d4-0003-0003-0003-000000000003',
  'Normandie',
  'A storied coastal region shaped by history, featuring dramatic chalk cliffs, D-Day beaches, and exquisite cuisine.',
  'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=1280',
  ARRAY['Mont-Saint-Michel', 'D-Day Beaches', 'Étretat Cliffs', 'Rouen Cathedral', 'Calvados Orchards']
),
(
  'a1b2c3d4-0004-0004-0004-000000000004',
  'Bretagne',
  'Wild and mystical, Brittany''s rugged Atlantic coastline is paired with Celtic traditions, megaliths, and fresh seafood.',
  'https://images.pexels.com/photos/2100804/pexels-photo-2100804.jpeg?auto=compress&cs=tinysrgb&w=1280',
  ARRAY['Saint-Malo', 'Carnac Megaliths', 'Quimper', 'Pont-Aven', 'Breton Crepes']
),
(
  'a1b2c3d4-0005-0005-0005-000000000005',
  'Grand Est (Alsace)',
  'Where French and German cultures beautifully blend, producing world-class wines, half-timbered villages, and Strasbourg.',
  'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=1280',
  ARRAY['Strasbourg Cathedral', 'Route des Vins', 'Colmar Old Town', 'Haut-Kœnigsbourg Castle', 'Alsatian Cuisine']
),
(
  'a1b2c3d4-0006-0006-0006-000000000006',
  'Val de Loire',
  'The Garden of France — a UNESCO-listed valley of magnificent Renaissance châteaux, vineyards, and gentle river landscapes.',
  'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg?auto=compress&cs=tinysrgb&w=1280',
  ARRAY['Château de Chambord', 'Château de Chenonceau', 'Château d''Amboise', 'Loire Wines', 'Troglodyte Villages']
)
ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- SEED: QUIZZES
-- =========================================================
INSERT INTO quizzes (id, title, description, region_id, difficulty) VALUES
(
  'b1b2c3d4-0001-0001-0001-000000000001',
  'French Landmarks',
  'Test your knowledge of France''s most iconic monuments and sites.',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'easy'
),
(
  'b1b2c3d4-0002-0002-0002-000000000002',
  'Cuisine & Wine',
  'How well do you know French gastronomy, cheese, and wine regions?',
  'a1b2c3d4-0002-0002-0002-000000000002',
  'medium'
),
(
  'b1b2c3d4-0003-0003-0003-000000000003',
  'French History',
  'A challenging journey through the key events that shaped France.',
  NULL,
  'hard'
)
ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- SEED: QUESTIONS
-- =========================================================
INSERT INTO questions (quiz_id, question_text, options, correct_answer, order_index) VALUES
-- Quiz 1: Landmarks
('b1b2c3d4-0001-0001-0001-000000000001',
 'What is the tallest iron tower in Paris, completed in 1889?',
 '[{"id":"a","text":"Arc de Triomphe"},{"id":"b","text":"Eiffel Tower"},{"id":"c","text":"Sacré-Cœur Basilica"},{"id":"d","text":"Notre-Dame Cathedral"}]',
 'b', 0),
('b1b2c3d4-0001-0001-0001-000000000001',
 'The Louvre Museum was originally built as what kind of building?',
 '[{"id":"a","text":"A church"},{"id":"b","text":"A fortress and royal palace"},{"id":"c","text":"A railway station"},{"id":"d","text":"A government ministry"}]',
 'b', 1),
('b1b2c3d4-0001-0001-0001-000000000001',
 'The Palace of Versailles was the royal residence of which French king who expanded it most?',
 '[{"id":"a","text":"Louis XII"},{"id":"b","text":"Charles X"},{"id":"c","text":"Louis XIV"},{"id":"d","text":"Napoleon I"}]',
 'c', 2),
('b1b2c3d4-0001-0001-0001-000000000001',
 'Which island-abbey off the Normandy coast is one of France''s most visited monuments?',
 '[{"id":"a","text":"Île de Ré"},{"id":"b","text":"Mont-Saint-Michel"},{"id":"c","text":"Belle-Île-en-Mer"},{"id":"d","text":"Île d''Oléron"}]',
 'b', 3),
-- Quiz 2: Cuisine
('b1b2c3d4-0002-0002-0002-000000000002',
 'Which French region is the legally protected home of Champagne sparkling wine?',
 '[{"id":"a","text":"Bordeaux"},{"id":"b","text":"Burgundy"},{"id":"c","text":"Champagne"},{"id":"d","text":"Alsace"}]',
 'c', 0),
('b1b2c3d4-0002-0002-0002-000000000002',
 'What is "Coq au Vin"?',
 '[{"id":"a","text":"Duck confit in orange sauce"},{"id":"b","text":"Chicken braised slowly in red wine"},{"id":"c","text":"Roast beef with Burgundy sauce"},{"id":"d","text":"Pork belly with mustard"}]',
 'b', 1),
('b1b2c3d4-0002-0002-0002-000000000002',
 'Brie, the soft cheese with a white rind, originates from which French region?',
 '[{"id":"a","text":"Normandy"},{"id":"b","text":"Provence"},{"id":"c","text":"Île-de-France"},{"id":"d","text":"Brittany"}]',
 'c', 2),
('b1b2c3d4-0002-0002-0002-000000000002',
 'What is a traditional Breton crêpe made with buckwheat flour called?',
 '[{"id":"a","text":"Crêpe Suzette"},{"id":"b","text":"Galette"},{"id":"c","text":"Gaufre"},{"id":"d","text":"Madeleine"}]',
 'b', 3),
-- Quiz 3: History
('b1b2c3d4-0003-0003-0003-000000000003',
 'In what year did the French Revolution begin with the storming of the Bastille?',
 '[{"id":"a","text":"1776"},{"id":"b","text":"1789"},{"id":"c","text":"1804"},{"id":"d","text":"1815"}]',
 'b', 0),
('b1b2c3d4-0003-0003-0003-000000000003',
 'Napoleon Bonaparte was exiled to which remote South Atlantic island after his final defeat at Waterloo?',
 '[{"id":"a","text":"Corsica"},{"id":"b","text":"Elba"},{"id":"c","text":"Saint Helena"},{"id":"d","text":"Madagascar"}]',
 'c', 1),
('b1b2c3d4-0003-0003-0003-000000000003',
 'France''s national day, Bastille Day, is celebrated on which date each year?',
 '[{"id":"a","text":"July 4th"},{"id":"b","text":"July 14th"},{"id":"c","text":"August 15th"},{"id":"d","text":"June 18th"}]',
 'b', 2),
('b1b2c3d4-0003-0003-0003-000000000003',
 'Which French general led the Free French Forces from London during World War II?',
 '[{"id":"a","text":"Philippe Pétain"},{"id":"b","text":"Ferdinand Foch"},{"id":"c","text":"Charles de Gaulle"},{"id":"d","text":"Jean Moulin"}]',
 'c', 3);
