import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface PointAction {
  id: string
  name: string
  points: number
  maxPerDay?: number
  currentCount?: number
  lastReset?: string
}

interface PointSystemContextType {
  totalPoints: number
  dailyActions: PointAction[]
  addPoints: (actionId: string, points: number) => void
  canPerformAction: (actionId: string) => boolean
  getActionCount: (actionId: string) => number
  resetDailyActions: () => void
  showPointMessage: (message: string) => void
  pointMessage: string
  clearPointMessage: () => void
}

const PointSystemContext = createContext<PointSystemContextType | undefined>(undefined)

const POINT_ACTIONS: PointAction[] = [
  { id: 'daily_checkin', name: '오늘 접속 (출석체크)', points: 10, maxPerDay: 1 },
  { id: 'weather_view', name: '날씨 카드 확인', points: 3, maxPerDay: 1 },
  { id: 'fortune_view', name: '운세 열람', points: 3, maxPerDay: 1 },
  { id: 'news_read', name: '뉴스 3건 이상 읽기', points: 5, maxPerDay: 1 },
  { id: 'community_like', name: '커뮤니티 글 좋아요', points: 1, maxPerDay: 5 },
  { id: 'visit_7days', name: '누적 방문 7일 달성', points: 50, maxPerDay: 1 }
]

export const PointSystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [totalPoints, setTotalPoints] = useState(0)
  const [dailyActions, setDailyActions] = useState<PointAction[]>(POINT_ACTIONS.map(action => ({
    ...action,
    currentCount: 0,
    lastReset: new Date().toDateString()
  })))
  const [pointMessage, setPointMessage] = useState('')

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const savedPoints = localStorage.getItem('totalPoints')
    const savedActions = localStorage.getItem('dailyActions')
    const lastReset = localStorage.getItem('lastPointReset')

    if (savedPoints) {
      setTotalPoints(parseInt(savedPoints, 10))
    }

    if (savedActions && lastReset) {
      const today = new Date().toDateString()
      if (lastReset === today) {
        // 오늘 데이터가 있으면 복원
        setDailyActions(JSON.parse(savedActions))
      } else {
        // 새로운 날이면 리셋
        resetDailyActions()
      }
    }
  }, [])

  // 포인트 추가
  const addPoints = (actionId: string, points: number) => {
    const action = POINT_ACTIONS.find(a => a.id === actionId)
    const actionName = action?.name || '알 수 없는 행동'
    
    setDailyActions(prev => {
      const updated = prev.map(action => {
        if (action.id === actionId) {
          return {
            ...action,
            currentCount: (action.currentCount || 0) + 1
          }
        }
        return action
      })
      
      // 로컬 스토리지에 저장
      localStorage.setItem('dailyActions', JSON.stringify(updated))
      return updated
    })

    setTotalPoints(prev => {
      const newTotal = prev + points
      localStorage.setItem('totalPoints', newTotal.toString())
      return newTotal
    })

    // 포인트 메시지 표시
    showPointMessage(`${actionName} 완료! +${points}P`)
  }

  // 행동 가능 여부 확인
  const canPerformAction = (actionId: string) => {
    const action = dailyActions.find(a => a.id === actionId)
    if (!action) return false
    
    const currentCount = action.currentCount || 0
    const maxPerDay = action.maxPerDay || 1
    
    return currentCount < maxPerDay
  }

  // 행동 횟수 조회
  const getActionCount = (actionId: string) => {
    const action = dailyActions.find(a => a.id === actionId)
    return action?.currentCount || 0
  }

  // 일일 행동 리셋
  const resetDailyActions = () => {
    const resetActions = POINT_ACTIONS.map(action => ({
      ...action,
      currentCount: 0,
      lastReset: new Date().toDateString()
    }))
    
    setDailyActions(resetActions)
    localStorage.setItem('dailyActions', JSON.stringify(resetActions))
    localStorage.setItem('lastPointReset', new Date().toDateString())
  }

  // 포인트 메시지 표시
  const showPointMessage = (message: string) => {
    setPointMessage(message)
    setTimeout(() => {
      setPointMessage('')
    }, 3000)
  }

  // 포인트 메시지 클리어
  const clearPointMessage = () => {
    setPointMessage('')
  }

  return (
    <PointSystemContext.Provider value={{
      totalPoints,
      dailyActions,
      addPoints,
      canPerformAction,
      getActionCount,
      resetDailyActions,
      showPointMessage,
      pointMessage,
      clearPointMessage
    }}>
      {children}
    </PointSystemContext.Provider>
  )
}

export const usePointSystem = () => {
  const context = useContext(PointSystemContext)
  if (context === undefined) {
    throw new Error('usePointSystem must be used within a PointSystemProvider')
  }
  return context
}
