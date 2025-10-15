export interface UserProfile {
  birthDate: string // YYYY-MM-DD
  birthTime?: string // HH:MM (optional)
  occupation: string
  gender: 'male' | 'female' | 'other'
  name?: string
}

export interface ActivityRecommendation {
  title: string
  description: string
  category: 'work' | 'health' | 'social' | 'personal' | 'leisure'
  priority: 'high' | 'medium' | 'low'
  weatherSuitability: string[]
}
