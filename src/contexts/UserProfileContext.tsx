import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserProfile } from '../types/user'

interface UserProfileContextType {
  userProfile: UserProfile | null
  setUserProfile: (profile: UserProfile | null) => void
  isProfileComplete: boolean
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

interface UserProfileProviderProps {
  children: ReactNode
}

export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  // 로컬 스토리지에서 프로필 불러오기
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile')
    console.log('🔍 UserProfileContext - Loading from localStorage:', savedProfile)
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile)
        console.log('🔍 UserProfileContext - Parsed profile:', parsedProfile)
        setUserProfile(parsedProfile)
      } catch (error) {
        console.error('Failed to parse saved user profile:', error)
      }
    }
  }, [])

  // 프로필 저장
  const handleSetUserProfile = (profile: UserProfile | null) => {
    console.log('🔍 UserProfileContext - Saving profile:', profile)
    setUserProfile(profile)
    if (profile) {
      localStorage.setItem('userProfile', JSON.stringify(profile))
      console.log('🔍 UserProfileContext - Profile saved to localStorage')
    } else {
      localStorage.removeItem('userProfile')
      console.log('🔍 UserProfileContext - Profile removed from localStorage')
    }
  }

  const isProfileComplete = Boolean(userProfile !== null && 
    userProfile.birthDate && 
    userProfile.occupation && 
    userProfile.gender)

  return (
    <UserProfileContext.Provider 
      value={{ 
        userProfile, 
        setUserProfile: handleSetUserProfile, 
        isProfileComplete 
      }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext)
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider')
  }
  return context
}
