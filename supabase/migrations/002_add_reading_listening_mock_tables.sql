-- Migration: Add Reading, Listening, Mock Tests, and Study Plans tables
-- Phase 2 Completion: AI-powered practice with real data

-- ============================================
-- READING PASSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS reading_passages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('heading', 'tfng', 'summary', 'mcq', 'short', 'diagram')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    topic_tag TEXT NOT NULL,
    word_count INTEGER NOT NULL DEFAULT 0,
    duration_min INTEGER NOT NULL DEFAULT 20,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- AI-generated content tracking
    ai_generated BOOLEAN DEFAULT false,
    ai_model TEXT,
    generation_prompt TEXT,
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for reading passages
CREATE INDEX IF NOT EXISTS idx_reading_passages_type ON reading_passages(type);
CREATE INDEX IF NOT EXISTS idx_reading_passages_difficulty ON reading_passages(difficulty);
CREATE INDEX IF NOT EXISTS idx_reading_passages_topic ON reading_passages(topic_tag);

-- ============================================
-- USER READING PROGRESS
-- ============================================
CREATE TABLE IF NOT EXISTS user_reading_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    passage_id UUID NOT NULL REFERENCES reading_passages(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in-progress', 'completed')),
    answers JSONB DEFAULT '[]'::jsonb,
    score INTEGER,
    band_score DECIMAL(3,1),
    time_spent_seconds INTEGER DEFAULT 0,
    highlights JSONB DEFAULT '[]'::jsonb,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, passage_id)
);

CREATE INDEX IF NOT EXISTS idx_user_reading_progress_user ON user_reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reading_progress_status ON user_reading_progress(status);

-- ============================================
-- LISTENING TESTS
-- ============================================
CREATE TABLE IF NOT EXISTS listening_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    section TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('form', 'map', 'matching', 'mcq', 'short')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    duration_min INTEGER NOT NULL DEFAULT 30,
    questions_count INTEGER NOT NULL DEFAULT 10,
    audio_url TEXT,
    transcript TEXT,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- AI-generated content
    ai_generated BOOLEAN DEFAULT false,
    ai_model TEXT,
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listening_tests_type ON listening_tests(type);
CREATE INDEX IF NOT EXISTS idx_listening_tests_difficulty ON listening_tests(difficulty);

-- ============================================
-- USER LISTENING PROGRESS
-- ============================================
CREATE TABLE IF NOT EXISTS user_listening_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES listening_tests(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in-progress', 'completed')),
    answers JSONB DEFAULT '[]'::jsonb,
    score INTEGER,
    band_score DECIMAL(3,1),
    time_spent_seconds INTEGER DEFAULT 0,
    bookmarks JSONB DEFAULT '[]'::jsonb,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, test_id)
);

CREATE INDEX IF NOT EXISTS idx_user_listening_progress_user ON user_listening_progress(user_id);

-- ============================================
-- MOCK TESTS
-- ============================================
CREATE TABLE IF NOT EXISTS mock_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('listening-mini', 'reading-mini', 'writing-mini', 'full-academic')),
    skill TEXT NOT NULL CHECK (skill IN ('Listening', 'Reading', 'Writing', 'All')),
    duration_min INTEGER NOT NULL,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER MOCK TEST RESULTS
-- ============================================
CREATE TABLE IF NOT EXISTS user_mock_test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mock_test_id UUID NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
    answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    overall_band DECIMAL(3,1),
    listening_band DECIMAL(3,1),
    reading_band DECIMAL(3,1),
    writing_band DECIMAL(3,1),
    speaking_band DECIMAL(3,1),
    score_percent INTEGER,
    correct_count INTEGER,
    wrong_count INTEGER,
    time_spent_seconds INTEGER,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_mock_results_user ON user_mock_test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_user_mock_results_completed ON user_mock_test_results(completed_at DESC);

-- ============================================
-- STUDY PLANS (AI-Generated)
-- ============================================
CREATE TABLE IF NOT EXISTS study_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_band DECIMAL(3,1) NOT NULL,
    current_band DECIMAL(3,1),
    duration_weeks INTEGER NOT NULL DEFAULT 4,
    focus_areas JSONB DEFAULT '[]'::jsonb, -- ['reading', 'listening', etc.]
    weekly_schedule JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    ai_generated BOOLEAN DEFAULT false,
    ai_recommendations JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_plans_user ON study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_active ON study_plans(is_active);

-- ============================================
-- USER ACTIVITIES (for weekly tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('reading', 'listening', 'writing', 'speaking', 'vocabulary', 'mock_test')),
    duration_min INTEGER NOT NULL DEFAULT 0,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_activities_user ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_date ON user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON user_activities(activity_type);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Reading passages: readable by all, writable by admin
ALTER TABLE reading_passages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reading passages are viewable by everyone" 
    ON reading_passages FOR SELECT USING (true);

-- User reading progress: only own data
ALTER TABLE user_reading_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own reading progress" 
    ON user_reading_progress FOR ALL USING (auth.uid() = user_id);

-- Listening tests: readable by all
ALTER TABLE listening_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Listening tests are viewable by everyone" 
    ON listening_tests FOR SELECT USING (true);

-- User listening progress: only own data
ALTER TABLE user_listening_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own listening progress" 
    ON user_listening_progress FOR ALL USING (auth.uid() = user_id);

-- Mock tests: readable by all
ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mock tests are viewable by everyone" 
    ON mock_tests FOR SELECT USING (true);

-- User mock results: only own data
ALTER TABLE user_mock_test_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own mock results" 
    ON user_mock_test_results FOR ALL USING (auth.uid() = user_id);

-- Study plans: only own data
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own study plans" 
    ON study_plans FOR ALL USING (auth.uid() = user_id);

-- User activities: only own data
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own activities" 
    ON user_activities FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to get weekly activity summary
CREATE OR REPLACE FUNCTION get_weekly_activity_summary(p_user_id UUID)
RETURNS TABLE (day_name TEXT, total_minutes INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(created_at, 'Dy') as day_name,
        COALESCE(SUM(duration_min), 0)::INTEGER as total_minutes
    FROM user_activities
    WHERE user_id = p_user_id
        AND created_at >= date_trunc('week', NOW())
        AND created_at < date_trunc('week', NOW()) + INTERVAL '1 week'
    GROUP BY TO_CHAR(created_at, 'Dy'), DATE(created_at)
    ORDER BY DATE(created_at);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate user skill stats
CREATE OR REPLACE FUNCTION get_user_skill_stats(p_user_id UUID)
RETURNS TABLE (
    skill TEXT,
    tests_completed INTEGER,
    avg_band DECIMAL(3,1),
    total_time_min INTEGER
) AS $$
BEGIN
    RETURN QUERY
    -- Reading stats
    SELECT 
        'reading'::TEXT as skill,
        COUNT(*)::INTEGER as tests_completed,
        AVG(band_score)::DECIMAL(3,1) as avg_band,
        (SUM(time_spent_seconds) / 60)::INTEGER as total_time_min
    FROM user_reading_progress
    WHERE user_id = p_user_id AND status = 'completed'
    
    UNION ALL
    
    -- Listening stats
    SELECT 
        'listening'::TEXT as skill,
        COUNT(*)::INTEGER as tests_completed,
        AVG(band_score)::DECIMAL(3,1) as avg_band,
        (SUM(time_spent_seconds) / 60)::INTEGER as total_time_min
    FROM user_listening_progress
    WHERE user_id = p_user_id AND status = 'completed'
    
    UNION ALL
    
    -- Mock test stats
    SELECT 
        'mock'::TEXT as skill,
        COUNT(*)::INTEGER as tests_completed,
        AVG(overall_band)::DECIMAL(3,1) as avg_band,
        (SUM(time_spent_seconds) / 60)::INTEGER as total_time_min
    FROM user_mock_test_results
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEED DATA - Sample passages and tests
-- ============================================

-- Insert sample reading passages
INSERT INTO reading_passages (title, content, type, difficulty, topic_tag, word_count, questions) VALUES
(
    'The Rise of Urban Farming',
    'The rapid growth of urban populations worldwide has given rise to an innovative approach to food production known as urban farming. This practice, which involves cultivating crops and raising animals within city boundaries, has gained significant momentum in recent years as cities grapple with food security challenges.

Unlike traditional agriculture, urban farming utilizes unconventional spaces such as rooftops, abandoned lots, and vertical structures. Proponents argue that this approach reduces transportation costs and carbon emissions associated with moving food from rural areas to urban centers. Furthermore, it provides fresh produce to communities that might otherwise lack access to nutritious food options.

Critics, however, point out that urban farming cannot match the scale of conventional agriculture. The limited space available in cities means that production volumes remain relatively small compared to rural farms. Additionally, concerns about soil contamination in urban areas and the potential for conflicts with other land uses present ongoing challenges.

Despite these limitations, cities around the world are increasingly incorporating urban agriculture into their planning strategies. Singapore, for instance, aims to produce 30% of its nutritional needs domestically by 2030, with urban farms playing a central role in this ambition. Similarly, Detroit has transformed thousands of vacant lots into productive gardens, creating both food and employment opportunities for local residents.

The economic viability of urban farming varies significantly depending on the model employed. Community gardens, which rely largely on volunteer labor, operate at minimal cost but produce modest yields. In contrast, high-tech vertical farms using hydroponics and artificial lighting can achieve impressive productivity but require substantial capital investment.',
    'tfng', 'medium', '🌿 Environment', 285,
    '[
        {"num": 1, "question": "Urban farming has become more popular in recent years.", "answer": "True"},
        {"num": 2, "question": "Traditional agriculture uses the same spaces as urban farming.", "answer": "False"},
        {"num": 3, "question": "Urban farming eliminates all carbon emissions from food production.", "answer": "False"},
        {"num": 4, "question": "Singapore aims to produce 30% of its food locally by 2030.", "answer": "True"},
        {"num": 5, "question": "Detroit''s urban farming program has been unsuccessful.", "answer": "False"}
    ]'::jsonb
),
(
    'Ancient Mesopotamia: Cradle of Civilization',
    'Mesopotamia, located between the Tigris and Euphrates rivers in modern-day Iraq, is often called the cradle of civilization. This region gave birth to some of humanity''s earliest cities, writing systems, and legal codes approximately 5,000 years ago.

The Sumerians established the world''s first known cities, including Ur and Uruk, which housed tens of thousands of inhabitants. These urban centers required sophisticated administrative systems to manage resources, leading to the development of cuneiform writing. Initially used for record-keeping, cuneiform eventually enabled the creation of literature, including the Epic of Gilgamesh.

Agricultural innovation drove Mesopotamian prosperity. Farmers developed irrigation techniques that channeled river water to fields, dramatically increasing crop yields. This food surplus supported specialized workers such as craftsmen, priests, and administrators who did not need to produce their own food.

The Babylonian king Hammurabi later unified Mesopotamia and established one of history''s earliest comprehensive legal codes. The Code of Hammurabi prescribed specific punishments for various crimes, establishing the principle that laws should be written and publicly available rather than arbitrary.

Mesopotamian achievements in mathematics and astronomy also proved remarkably advanced. Their base-60 number system, which we still use for measuring time and angles, demonstrates the sophistication of their mathematical understanding. Astronomers tracked celestial bodies and could predict eclipses with considerable accuracy.',
    'heading', 'medium', '📜 History', 260,
    '[
        {"num": 1, "question": "Match headings to paragraphs", "type": "heading"}
    ]'::jsonb
)
ON CONFLICT DO NOTHING;

-- Insert sample listening tests
INSERT INTO listening_tests (title, section, type, difficulty, duration_min, questions_count, questions) VALUES
(
    'Library Registration', 
    'Section 1: Form Completion',
    'form',
    'easy',
    30, 10,
    '[
        {"num": 1, "question": "Name", "type": "form", "answer": "Sarah Johnson"},
        {"num": 2, "question": "Address", "type": "form", "answer": "42 Oak Road"},
        {"num": 3, "question": "Phone number", "type": "form", "answer": "07983 445 921"},
        {"num": 4, "question": "Membership type", "type": "form", "answer": "Premium"}
    ]'::jsonb
),
(
    'Campus Map Orientation',
    'Section 2: Map Labeling',
    'map',
    'medium',
    30, 10,
    '[
        {"num": 5, "question": "Library", "type": "map"},
        {"num": 6, "question": "Student Center", "type": "map"},
        {"num": 7, "question": "Science Building", "type": "map"}
    ]'::jsonb
)
ON CONFLICT DO NOTHING;

-- Insert mock tests
INSERT INTO mock_tests (title, type, skill, duration_min, questions, is_premium) VALUES
(
    'Listening Mini Mock',
    'listening-mini',
    'Listening',
    30,
    '[
        {"q": "The lecture is mainly about ___.", "options": ["marine ecosystems", "climate change impacts on coral reefs", "ocean conservation policies", "history of marine biology"], "correct": 1},
        {"q": "According to the speaker, the biggest threat to coral reefs is ___.", "options": ["overfishing", "water pollution", "rising ocean temperatures", "coastal development"], "correct": 2}
    ]'::jsonb,
    false
),
(
    'Reading Mini Mock',
    'reading-mini',
    'Reading',
    45,
    '[
        {"q": "The passage states that urban farming originated in ___.", "options": ["North America", "Ancient Mesopotamia", "Modern Japan", "Colonial Europe"], "correct": 1},
        {"q": "According to the text, vertical farming uses ___ less water than traditional farming.", "options": ["50%", "70%", "90%", "95%"], "correct": 2}
    ]'::jsonb,
    false
),
(
    'Full Academic Mock #1',
    'full-academic',
    'All',
    165,
    '[
        {"q": "Section 1: What time does the library close on weekdays?", "options": ["5:00 PM", "7:30 PM", "9:00 PM", "10:00 PM"], "correct": 2},
        {"q": "Reading: The passage suggests that AI will most impact ___.", "options": ["Agriculture", "Healthcare", "Transportation", "Education"], "correct": 1}
    ]'::jsonb,
    false
)
ON CONFLICT DO NOTHING;

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reading_passages_updated_at BEFORE UPDATE ON reading_passages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listening_tests_updated_at BEFORE UPDATE ON listening_tests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_reading_progress_updated_at BEFORE UPDATE ON user_reading_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_listening_progress_updated_at BEFORE UPDATE ON user_listening_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_plans_updated_at BEFORE UPDATE ON study_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
