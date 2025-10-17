import { useState, useEffect } from 'react';
import { UserProfile } from '../types/user';

interface FortuneRecommendation {
  overall: string;
  overallScore: number;
  work: string;
  workScore: number;
  health: string;
  healthScore: number;
  relationship: string;
  relationshipScore: number;
  luck: string;
  luckScore: number;
  advice: string;
  luckyNumbers: number[];
  luckyColor: string;
  luckyTime: string;
  zodiacSign: string;
  dailyHoroscope: string;
  detailedAnalysis: string;
  compatibility: string;
  luckyDirection: string;
  unluckyDirection: string;
  bestActivity: string;
  avoidActivity: string;
  emotionalState: string;
  financialOutlook: string;
  careerProspects: string;
  loveLife: string;
  familyHarmony: string;
  socialLife: string;
  personalGrowth: string;
  spiritualGuidance: string;
}

interface FortuneRecommendationHook {
  fortune: FortuneRecommendation | null;
  loading: boolean;
  error: string | null;
  generateFortune: () => void;
  isNewDay: boolean;
}

export const useFortuneRecommendation = (userProfile: UserProfile | null): FortuneRecommendationHook => {
  const [fortune, setFortune] = useState<FortuneRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLastGeneratedDate] = useState<string | null>(null);

  // 디버깅을 위한 콘솔 로그
  console.log('🔍 useFortuneRecommendation Debug:', {
    userProfile,
    hasProfile: !!userProfile,
    profileOccupation: userProfile?.occupation,
    fortune,
    loading,
    error
  });

  const generateFortune = async () => {
    if (!userProfile) return;

    setLoading(true);
    setError(null);

    try {
      // 실제로는 OpenAI API를 사용하지만, 여기서는 직업 기반 모의 AI 운세 생성
      await new Promise(resolve => setTimeout(resolve, 2000)); // 로딩 시뮬레이션

      const occupationBasedFortune = generateOccupationBasedFortune(userProfile);
      setFortune(occupationBasedFortune);
      
      // 오늘 날짜 저장
      const today = new Date().toDateString();
      setLastGeneratedDate(today);
      localStorage.setItem('lastFortuneDate', today);
    } catch (err) {
      setError('운세를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const generateOccupationBasedFortune = (profile: UserProfile): FortuneRecommendation => {
    const { occupation, birthDate } = profile;
    const currentDate = new Date();
    // const birthYear = new Date(birthDate).getFullYear();
    const birthMonth = new Date(birthDate).getMonth() + 1;
    const birthDay = new Date(birthDate).getDate();
    
    // 매일 변경되는 운세를 위한 날짜 기반 시드
    const dateSeed = currentDate.getFullYear() * 10000 + (currentDate.getMonth() + 1) * 100 + currentDate.getDate();
    
    // 별자리 계산
    const zodiacSign = getZodiacSign(birthMonth, birthDay);
    
    // 각 운세 항목별 점수 (날짜 기반으로 일관성 있게 생성)
    const workScore = 60 + (dateSeed * 7 % 40);
    const healthScore = 55 + (dateSeed * 11 % 45);
    const relationshipScore = 65 + (dateSeed * 13 % 35);
    const luckScore = 50 + (dateSeed * 17 % 50);
    const overallScore = Math.round((workScore + healthScore + relationshipScore + luckScore) / 4);
    
    // 직업별 운세 템플릿 (더 풍부한 내용)
    const occupationTemplates = {
      '학생': {
        overall: '📚 새로운 지식의 문이 당신에게 열리고 있습니다. 오늘은 특히 창의적 사고와 논리적 분석이 조화를 이루는 특별한 날이에요. 공부에 대한 열정이 다시 타오르며, 어려웠던 과목에서도 새로운 깨달음을 얻을 수 있을 것입니다.',
        work: `학업에서 새로운 돌파구를 찾을 수 있는 날입니다. 특히 ${currentDate.getMonth() + 1}월은 당신에게 새로운 학습 방법이나 공부 기술을 발견할 수 있는 시기입니다. 그룹 스터디나 토론 수업에서 뛰어난 아이디어를 제시할 수 있어요.`,
        health: '장시간 앉아서 공부하는 것보다는 적절한 운동과 휴식이 필요합니다. 목과 어깨의 긴장을 풀어주는 스트레칭을 자주 해보세요. 눈의 피로도 주의해야 하며, 20-20-20 규칙(20분마다 20초간 20피트 떨어진 곳을 보기)을 실천해보세요.',
        relationship: '동급생들과의 관계에서 새로운 발전이 있을 것입니다. 특히 어려운 과목을 함께 공부하는 친구와 더 깊은 유대감을 형성할 수 있어요. 선배나 선생님과의 대화에서 중요한 조언을 들을 수 있습니다.',
        luck: '새로운 학습 도구나 참고서를 발견할 수 있는 행운이 있습니다. 도서관이나 서점에서 우연히 마주친 책이 당신의 학업에 큰 도움이 될 것입니다.',
        advice: '꾸준한 학습보다는 효율적인 공부법을 찾는 것이 중요합니다. 자신만의 학습 리듬을 만들어보세요.',
        luckyNumbers: [7, 14, 21, 28],
        luckyColor: '파란색',
        luckyTime: '오전 9-11시'
      },
      '직장인': {
        overall: '💼 업무에서 새로운 기회와 도전이 기다리고 있습니다. 오늘은 특히 팀워크와 개인의 전문성이 조화를 이루는 특별한 날이에요. 동료들과의 협력을 통해 예상보다 큰 성과를 낼 수 있을 것입니다.',
        work: '새로운 프로젝트나 업무 기회가 찾아올 가능성이 높습니다. 특히 오후 시간대에 중요한 미팅이나 제안이 있을 수 있어요. 당신의 전문성과 경험이 빛을 발할 수 있는 시기입니다.',
        health: '업무 스트레스로 인한 피로감이 누적될 수 있습니다. 규칙적인 운동과 충분한 수면이 필요해요. 목과 어깨의 긴장을 풀어주는 마사지나 스트레칭을 해보세요.',
        relationship: '상사와의 관계에서 긍정적인 변화가 있을 것입니다. 동료들과의 협력도 더욱 원활해질 것이며, 새로운 비즈니스 관계를 형성할 기회도 생길 수 있어요.',
        luck: '예상치 못한 업무 기회나 승진 소식이 들려올 수 있습니다. 네트워킹 이벤트에서 중요한 인맥을 만날 가능성도 높아요.',
        advice: '직장 내 네트워킹에 더욱 신경 쓰고, 새로운 기술이나 업무 방식을 학습해보세요.',
        luckyNumbers: [3, 9, 15, 27],
        luckyColor: '검은색',
        luckyTime: '오후 2-4시'
      },
      '프리랜서': {
        overall: '🎨 창의적인 영감이 넘치는 하루입니다. 오늘은 특히 당신의 독창성과 전문성이 클라이언트들에게 큰 인상을 줄 수 있는 특별한 날이에요. 새로운 프로젝트나 협업 제안이 올 가능성이 높습니다.',
        work: '새로운 클라이언트나 흥미로운 프로젝트 제안이 들어올 수 있습니다. 특히 창의적인 작업에서 뛰어난 결과를 낼 수 있을 것이며, 당신의 포트폴리오를 업그레이드할 좋은 기회입니다.',
        health: '불규칙한 생활 패턴으로 인한 수면 부족을 주의해야 합니다. 규칙적인 식사와 운동으로 건강을 관리하세요. 창작 활동으로 인한 시각적 피로도 주의가 필요해요.',
        relationship: '클라이언트와의 소통에서 좋은 결과를 얻을 수 있습니다. 동료 프리랜서들과의 네트워킹도 유익할 것이며, 새로운 협업 파트너를 만날 기회도 있어요.',
        luck: '예상치 못한 수입이나 보너스가 생길 수 있습니다. 새로운 기술을 배우거나 도구를 구입할 때 할인 혜택을 받을 가능성도 높아요.',
        advice: '포트폴리오를 정기적으로 업데이트하고, 새로운 기술 트렌드를 놓치지 마세요.',
        luckyNumbers: [5, 12, 18, 25],
        luckyColor: '보라색',
        luckyTime: '오후 7-9시'
      },
      '사업자': {
        overall: '💡 사업 확장의 좋은 기회가 찾아올 것입니다. 오늘은 특히 당신의 리더십과 비전이 팀원들에게 큰 영감을 줄 수 있는 특별한 날이에요. 새로운 파트너십이나 투자 기회가 생길 수 있습니다.',
        work: '새로운 비즈니스 기회나 파트너십 제안이 들어올 수 있습니다. 특히 오전 시간대에 중요한 미팅이나 협상이 있을 것이며, 당신의 사업 아이디어가 빛을 발할 수 있는 시기입니다.',
        health: '사업 운영으로 인한 스트레스 관리가 중요합니다. 규칙적인 운동과 충분한 휴식을 취하세요. 마음의 안정을 위해 명상이나 요가를 해보는 것도 좋습니다.',
        relationship: '비즈니스 파트너와의 관계가 더욱 강화될 것입니다. 팀원들과의 소통도 원활해질 것이며, 새로운 고객과의 관계 형성에도 좋은 시기입니다.',
        luck: '예상보다 좋은 매출이나 수익이 있을 수 있습니다. 새로운 시장 진출이나 제품 출시에서 성공적인 결과를 얻을 가능성이 높아요.',
        advice: '장기적인 비전을 다시 한번 점검하고, 팀원들과의 소통을 더욱 강화하세요.',
        luckyNumbers: [8, 16, 24, 32],
        luckyColor: '금색',
        luckyTime: '오전 10-12시'
      }
    };

    // 기본 운세 (직업이 목록에 없는 경우)
    const defaultFortune = {
      overall: '✨ 새로운 기회와 도전이 기다리는 하루입니다!',
      work: '현재 하고 있는 일에서 좋은 결과가 있을 것 같아요.',
      health: '건강한 생활 습관을 유지하세요.',
      relationship: '주변 사람들과의 관계가 발전할 수 있어요.',
      luck: '예상치 못한 좋은 일이 생길 수 있습니다!',
      advice: '긍정적인 마음가짐으로 하루를 시작하세요.',
      luckyNumbers: [7, 14, 21, 28],
      luckyColor: '파란색',
      luckyTime: '오전 9-11시'
    };

    const selectedFortune = occupationTemplates[occupation as keyof typeof occupationTemplates] || defaultFortune;

    return {
      ...selectedFortune,
      overallScore,
      workScore,
      healthScore,
      relationshipScore,
      luckScore,
      zodiacSign,
      dailyHoroscope: generateDailyHoroscope(zodiacSign, dateSeed),
      detailedAnalysis: generateDetailedAnalysis(profile, dateSeed),
      compatibility: generateCompatibility(zodiacSign, dateSeed),
      luckyDirection: getLuckyDirection(dateSeed),
      unluckyDirection: getUnluckyDirection(dateSeed),
      bestActivity: getBestActivity(occupation, dateSeed),
      avoidActivity: getAvoidActivity(dateSeed),
      emotionalState: getEmotionalState(dateSeed),
      financialOutlook: getFinancialOutlook(dateSeed),
      careerProspects: getCareerProspects(occupation, dateSeed),
      loveLife: getLoveLife(zodiacSign, dateSeed),
      familyHarmony: getFamilyHarmony(dateSeed),
      socialLife: getSocialLife(dateSeed),
      personalGrowth: getPersonalGrowth(dateSeed),
      spiritualGuidance: getSpiritualGuidance(dateSeed)
    };
  };

  // 별자리 계산 함수
  const getZodiacSign = (month: number, day: number): string => {
    const signs = [
      { name: '물병자리', start: [1, 20], end: [2, 18] },
      { name: '물고기자리', start: [2, 19], end: [3, 20] },
      { name: '양자리', start: [3, 21], end: [4, 19] },
      { name: '황소자리', start: [4, 20], end: [5, 20] },
      { name: '쌍둥이자리', start: [5, 21], end: [6, 20] },
      { name: '게자리', start: [6, 21], end: [7, 22] },
      { name: '사자자리', start: [7, 23], end: [8, 22] },
      { name: '처녀자리', start: [8, 23], end: [9, 22] },
      { name: '천칭자리', start: [9, 23], end: [10, 22] },
      { name: '전갈자리', start: [10, 23], end: [11, 21] },
      { name: '궁수자리', start: [11, 22], end: [12, 21] },
      { name: '염소자리', start: [12, 22], end: [1, 19] }
    ];

    for (const sign of signs) {
      if ((month === sign.start[0] && day >= sign.start[1]) || 
          (month === sign.end[0] && day <= sign.end[1])) {
        return sign.name;
      }
    }
    return '물병자리';
  };

  // 추가 운세 정보 생성 함수들
  const generateDailyHoroscope = (_zodiacSign: string, dateSeed: number): string => {
    const horoscopes = [
      '오늘은 새로운 시작에 좋은 날입니다.',
      '과거의 문제를 해결할 수 있는 기회가 찾아올 것입니다.',
      '창의적인 아이디어가 떠오를 수 있는 시기입니다.',
      '주변 사람들과의 소통이 더욱 중요해집니다.',
      '내면의 평화를 찾는 시간이 필요합니다.'
    ];
    return horoscopes[dateSeed % horoscopes.length];
  };

  const generateDetailedAnalysis = (profile: UserProfile, _dateSeed: number): string => {
    const { occupation, gender, birthDate } = profile;
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    
    return `${age}세 ${gender === 'male' ? '남성' : '여성'}으로서 ${occupation} 분야에서 활동하고 있는 당신에게 오늘은 특별한 의미가 있는 날입니다. 당신의 경험과 지혜가 빛을 발할 수 있는 시기이며, 새로운 도전을 받아들일 준비가 되어 있습니다.`;
  };

  const generateCompatibility = (_zodiacSign: string, dateSeed: number): string => {
    const compatibleSigns = ['물고기자리', '양자리', '황소자리', '쌍둥이자리'];
    return `오늘은 ${compatibleSigns[dateSeed % compatibleSigns.length]}와의 관계에서 긍정적인 에너지를 느낄 수 있을 것입니다.`;
  };

  const getLuckyDirection = (dateSeed: number): string => {
    const directions = ['동쪽', '서쪽', '남쪽', '북쪽', '동남쪽', '서남쪽', '동북쪽', '서북쪽'];
    return directions[dateSeed % directions.length];
  };

  const getUnluckyDirection = (dateSeed: number): string => {
    const directions = ['서쪽', '동쪽', '북쪽', '남쪽', '서북쪽', '동북쪽', '서남쪽', '동남쪽'];
    return directions[dateSeed % directions.length];
  };

  const getBestActivity = (_occupation: string, dateSeed: number): string => {
    const activities = [
      '독서와 학습',
      '운동과 스포츠',
      '예술과 창작',
      '명상과 휴식',
      '사람들과의 대화',
      '자연 속에서의 산책'
    ];
    return activities[dateSeed % activities.length];
  };

  const getAvoidActivity = (dateSeed: number): string => {
    const activities = [
      '무리한 운동',
      '과도한 업무',
      '긴장을 유발하는 활동',
      '새로운 투자',
      '중요한 결정',
      '충동적인 행동'
    ];
    return activities[dateSeed % activities.length];
  };

  const getEmotionalState = (dateSeed: number): string => {
    const states = [
      '평온하고 안정적',
      '에너지가 넘치고 활기참',
      '사색적이고 깊이 있음',
      '낙천적이고 긍정적',
      '신중하고 현명함',
      '창의적이고 영감이 넘침'
    ];
    return states[dateSeed % states.length];
  };

  const getFinancialOutlook = (dateSeed: number): string => {
    const outlooks = [
      '안정적인 수입 유지',
      '새로운 수입원 발견',
      '투자 기회 증가',
      '지출 관리 필요',
      '저축 증대 가능',
      '예상치 못한 수입'
    ];
    return outlooks[dateSeed % outlooks.length];
  };

  const getCareerProspects = (occupation: string, _dateSeed: number): string => {
    return `${occupation} 분야에서의 전문성이 더욱 인정받을 수 있는 시기입니다. 새로운 기회나 승진 가능성도 높아요.`;
  };

  const getLoveLife = (_zodiacSign: string, dateSeed: number): string => {
    const loveStates = [
      '새로운 만남의 기회',
      '기존 관계의 발전',
      '솔직한 대화의 시간',
      '로맨틱한 순간',
      '신뢰 관계 강화',
      '깊이 있는 이해'
    ];
    return loveStates[dateSeed % loveStates.length];
  };

  const getFamilyHarmony = (dateSeed: number): string => {
    const harmonies = [
      '가족과의 따뜻한 시간',
      '소통의 시간 증가',
      '서로를 이해하는 마음',
      '함께하는 즐거운 활동',
      '지지와 격려의 시간',
      '추억을 만드는 순간'
    ];
    return harmonies[dateSeed % harmonies.length];
  };

  const getSocialLife = (dateSeed: number): string => {
    const socialStates = [
      '새로운 인맥 형성',
      '기존 친구들과의 만남',
      '사회적 활동 증가',
      '네트워킹 기회',
      '공동체 참여',
      '봉사활동 기회'
    ];
    return socialStates[dateSeed % socialStates.length];
  };

  const getPersonalGrowth = (dateSeed: number): string => {
    const growths = [
      '새로운 기술 학습',
      '자기계발 시간',
      '목표 설정과 계획',
      '내면 성찰의 시간',
      '새로운 취미 발견',
      '개인적 도전'
    ];
    return growths[dateSeed % growths.length];
  };

  const getSpiritualGuidance = (dateSeed: number): string => {
    const guidances = [
      '내면의 평화를 찾으세요',
      '감사하는 마음을 가지세요',
      '자신을 믿고 용기를 내세요',
      '타인을 이해하고 배려하세요',
      '현재 순간을 소중히 여기세요',
      '긍정적인 에너지를 유지하세요'
    ];
    return guidances[dateSeed % guidances.length];
  };

  // 오늘 운세가 이미 생성되었는지 확인
  const isNewDay = () => {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('lastFortuneDate');
    return lastDate !== today;
  };

  // 사용자 프로필이 변경되거나 새로운 날이 되면 자동으로 운세 생성
  useEffect(() => {
    console.log('🔍 useFortuneRecommendation useEffect triggered:', {
      userProfile,
      hasOccupation: userProfile?.occupation,
      isNewDay: isNewDay(),
      currentFortune: fortune
    });
    
    if (userProfile && userProfile.occupation && userProfile.birthDate && userProfile.gender) {
      console.log('🔍 Profile is complete, checking if fortune needs generation');
      if (isNewDay() || !fortune) {
        console.log('🔍 Generating fortune...');
        generateFortune();
      } else {
        console.log('🔍 Fortune already exists for today');
      }
    } else {
      console.log('🔍 Profile incomplete or missing:', {
        hasProfile: !!userProfile,
        hasOccupation: !!userProfile?.occupation,
        hasBirthDate: !!userProfile?.birthDate,
        hasGender: !!userProfile?.gender
      });
    }
  }, [userProfile, fortune]);

  return {
    fortune,
    loading,
    error,
    generateFortune,
    isNewDay: isNewDay()
  };
};