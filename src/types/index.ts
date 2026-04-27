export interface Profile {
  id: string
  username: string
  role: 'student' | 'admin'
  created_at: string
}

export interface Region {
  id: string
  name: string
  description: string
  image_url: string
  highlights: string[]
  created_at: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  region_id: string | null
  difficulty: 'easy' | 'medium' | 'hard'
  created_by: string | null
  created_at: string
  regions?: Region
  question_count?: number
}

export interface QuizOption {
  id: string
  text: string
}

export interface Question {
  id: string
  quiz_id: string
  question_text: string
  options: QuizOption[]
  correct_answer: string
  order_index: number
  created_at: string
}

export interface Score {
  id: string
  user_id: string
  quiz_id: string
  score: number
  total_questions: number
  completed_at: string
  quizzes?: Quiz
  profiles?: Profile
}

export interface AuthUser {
  id: string
  email: string | undefined
  profile: Profile | null
}
