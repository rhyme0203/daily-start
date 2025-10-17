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
  const [, setIsLoaded] = useState(false)

  // 로컬 스토리지에서 프로필 불러오기
  useEffect(() => {
    const loadProfile = () => {
      try {
        // localStorage에서 먼저 시도
        const savedProfile = localStorage.getItem('userProfile')
        console.log('🔍 UserProfileContext - Loading from localStorage:', savedProfile)
        
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile)
          console.log('🔍 UserProfileContext - Parsed profile:', parsedProfile)
          setUserProfile(parsedProfile)
          setIsLoaded(true)
          return
        }

        // localStorage에 없으면 sessionStorage에서 시도
        const sessionProfile = sessionStorage.getItem('userProfile')
        console.log('🔍 UserProfileContext - Loading from sessionStorage:', sessionProfile)
        
        if (sessionProfile) {
          const parsedProfile = JSON.parse(sessionProfile)
          console.log('🔍 UserProfileContext - Parsed session profile:', parsedProfile)
          setUserProfile(parsedProfile)
          // sessionStorage에서 찾았으면 localStorage에도 저장
          localStorage.setItem('userProfile', sessionProfile)
          setIsLoaded(true)
          return
        }

        // 둘 다 없으면 쿠키에서 시도
        const cookieProfile = getCookie('userProfile')
        console.log('🔍 UserProfileContext - Loading from cookie:', cookieProfile)
        
        if (cookieProfile) {
          const parsedProfile = JSON.parse(cookieProfile)
          console.log('🔍 UserProfileContext - Parsed cookie profile:', parsedProfile)
          setUserProfile(parsedProfile)
          // 쿠키에서 찾았으면 localStorage와 sessionStorage에도 저장
          localStorage.setItem('userProfile', cookieProfile)
          sessionStorage.setItem('userProfile', cookieProfile)
          setIsLoaded(true)
          return
        }

        setIsLoaded(true)
      } catch (error) {
        console.error('Failed to load user profile:', error)
        setIsLoaded(true)
      }
    }

    loadProfile()
  }, [])

  // 쿠키 헬퍼 함수들
  const setCookie = (name: string, value: string, days: number = 30) => {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  }

  const getCookie = (name: string): string | null => {
    const nameEQ = name + "="
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
  }

  // 프로필 저장 (여러 저장소에 백업)
  const handleSetUserProfile = (profile: UserProfile | null) => {
    console.log('🔍 UserProfileContext - Saving profile:', profile)
    setUserProfile(profile)
    
    if (profile) {
      const profileString = JSON.stringify(profile)
      
      try {
        // localStorage에 저장
        localStorage.setItem('userProfile', profileString)
        console.log('🔍 UserProfileContext - Profile saved to localStorage')
        
        // sessionStorage에도 백업 저장
        sessionStorage.setItem('userProfile', profileString)
        console.log('🔍 UserProfileContext - Profile saved to sessionStorage')
        
        // 쿠키에도 백업 저장 (30일)
        setCookie('userProfile', profileString, 30)
        console.log('🔍 UserProfileContext - Profile saved to cookie')
        
      } catch (error) {
        console.error('Failed to save profile:', error)
        // 저장 실패 시에도 상태는 업데이트
      }
    } else {
      // 프로필 삭제
      try {
        localStorage.removeItem('userProfile')
        sessionStorage.removeItem('userProfile')
        deleteCookie('userProfile')
        console.log('🔍 UserProfileContext - Profile removed from all storage')
      } catch (error) {
        console.error('Failed to remove profile:', error)
      }
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
