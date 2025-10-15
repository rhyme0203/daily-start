import { useState, useEffect } from 'react';
import { UserProfile } from '../types/user';

interface FortuneRecommendation {
  overall: string;
  work: string;
  health: string;
  relationship: string;
  luck: string;
  advice: string;
  luckyNumbers: number[];
  luckyColor: string;
  luckyTime: string;
}

interface FortuneRecommendationHook {
  fortune: FortuneRecommendation | null;
  loading: boolean;
  error: string | null;
  generateFortune: () => void;
}

export const useFortuneRecommendation = (userProfile: UserProfile | null): FortuneRecommendationHook => {
  const [fortune, setFortune] = useState<FortuneRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFortune = async () => {
    if (!userProfile) return;

    setLoading(true);
    setError(null);

    try {
      // 실제로는 OpenAI API를 사용하지만, 여기서는 직업 기반 모의 AI 운세 생성
      await new Promise(resolve => setTimeout(resolve, 1500)); // 로딩 시뮬레이션

      const occupationBasedFortune = generateOccupationBasedFortune(userProfile);
      setFortune(occupationBasedFortune);
    } catch (err) {
      setError('운세를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const generateOccupationBasedFortune = (profile: UserProfile): FortuneRecommendation => {
    const { occupation, gender, birthDate } = profile;
    const currentDate = new Date();
    const birthYear = new Date(birthDate).getFullYear();
    const age = currentDate.getFullYear() - birthYear;
    
    // 직업별 운세 템플릿
    const occupationTemplates = {
      '학생': {
        overall: '📚 새로운 지식이 당신을 기다리고 있어요!',
        work: '시험과 과제에서 좋은 결과가 있을 것 같습니다.',
        health: '공부 스트레스로 인한 피로감을 주의하세요.',
        relationship: '동급생들과의 관계가 돈독해질 수 있는 날입니다.',
        luck: '새로운 학습 방법을 발견할 수 있는 행운이 있어요!',
        advice: '꾸준한 학습보다는 효율적인 공부법을 찾아보세요.',
        luckyNumbers: [7, 14, 21, 28],
        luckyColor: '파란색',
        luckyTime: '오전 9-11시'
      },
      '직장인': {
        overall: '💼 업무에서 새로운 기회가 찾아올 것 같아요!',
        work: '동료들과의 협력이 더욱 중요해지는 하루입니다.',
        health: '장시간 업무로 인한 목과 어깨 통증을 주의하세요.',
        relationship: '상사와의 관계에서 긍정적인 변화가 있을 것 같습니다.',
        luck: '새로운 프로젝트나 승진 기회가 생길 수 있어요!',
        advice: '직장 내 네트워킹에 더욱 신경 쓰세요.',
        luckyNumbers: [3, 9, 15, 27],
        luckyColor: '검은색',
        luckyTime: '오후 2-4시'
      },
      '프리랜서': {
        overall: '🎨 창의적인 아이디어가 넘치는 하루입니다!',
        work: '새로운 클라이언트나 프로젝트 제안이 올 수 있어요.',
        health: '불규칙한 생활 패턴으로 인한 수면 부족을 주의하세요.',
        relationship: '고객과의 소통에서 좋은 결과가 있을 것 같습니다.',
        luck: '예상치 못한 수입이나 보너스가 생길 수 있어요!',
        advice: '포트폴리오 업데이트를 고려해보세요.',
        luckyNumbers: [5, 12, 18, 25],
        luckyColor: '보라색',
        luckyTime: '오후 7-9시'
      },
      '사업자': {
        overall: '💡 사업 확장의 좋은 기회가 찾아올 것 같아요!',
        work: '새로운 파트너십이나 투자 제안이 올 수 있습니다.',
        health: '스트레스 관리가 더욱 중요한 하루입니다.',
        relationship: '비즈니스 파트너와의 관계가 강화될 것 같습니다.',
        luck: '예상보다 좋은 매출이 있을 수 있어요!',
        advice: '장기적인 비전을 다시 한번 점검해보세요.',
        luckyNumbers: [8, 16, 24, 32],
        luckyColor: '금색',
        luckyTime: '오전 10-12시'
      },
      '공무원': {
        overall: '🏛️ 안정적인 하루, 새로운 업무에 도전해보세요!',
        work: '체계적인 업무 처리로 좋은 평가를 받을 수 있어요.',
        health: '규칙적인 생활 패턴을 유지하세요.',
        relationship: '동료들과의 팀워크가 빛나는 하루입니다.',
        luck: '새로운 업무 기회나 교육 과정 제안이 올 수 있어요!',
        advice: '공무원으로서의 전문성을 더욱 발전시켜보세요.',
        luckyNumbers: [2, 10, 18, 26],
        luckyColor: '청록색',
        luckyTime: '오후 1-3시'
      },
      '교사': {
        overall: '📖 학생들에게 긍정적인 영향을 미칠 수 있는 하루입니다!',
        work: '창의적인 수업 방법으로 학생들의 관심을 끌 수 있어요.',
        health: '목소리 관리를 잘 하세요.',
        relationship: '학생들과의 관계가 더욱 돈독해질 것 같습니다.',
        luck: '새로운 교육 자료나 방법을 발견할 수 있어요!',
        advice: '학생들의 개별적인 특성을 고려한 지도가 필요합니다.',
        luckyNumbers: [4, 11, 19, 30],
        luckyColor: '초록색',
        luckyTime: '오전 8-10시'
      },
      '의료진': {
        overall: '⚕️ 환자들에게 큰 도움이 될 수 있는 하루입니다!',
        work: '새로운 의학 지식이나 치료법을 학습할 기회가 있어요.',
        health: '자신의 건강도 소홀히 하지 마세요.',
        relationship: '동료 의료진들과의 협력이 중요한 하루입니다.',
        luck: '의학 분야에서의 새로운 발견이나 성과가 있을 수 있어요!',
        advice: '환자와의 소통에 더욱 신경 쓰세요.',
        luckyNumbers: [6, 13, 20, 31],
        luckyColor: '흰색',
        luckyTime: '오후 3-5시'
      },
      '엔지니어': {
        overall: '🔧 기술적 문제 해결에 뛰어난 능력을 발휘할 수 있어요!',
        work: '새로운 기술이나 도구를 배울 수 있는 기회가 있습니다.',
        health: '장시간 컴퓨터 사용으로 인한 눈의 피로를 주의하세요.',
        relationship: '동료들과의 기술적 토론이 유익할 것 같습니다.',
        luck: '혁신적인 아이디어나 솔루션을 찾을 수 있어요!',
        advice: '기술 트렌드를 놓치지 말고 지속적으로 학습하세요.',
        luckyNumbers: [1, 8, 15, 22],
        luckyColor: '회색',
        luckyTime: '오후 6-8시'
      },
      '디자이너': {
        overall: '🎨 창의적인 영감이 넘치는 하루입니다!',
        work: '새로운 디자인 트렌드나 기법을 적용해보세요.',
        health: '시각적 피로를 줄이기 위해 휴식을 취하세요.',
        relationship: '클라이언트와의 소통에서 좋은 결과가 있을 것 같습니다.',
        luck: '예상치 못한 디자인 영감이나 기회가 생길 수 있어요!',
        advice: '다양한 예술 작품을 감상하며 영감을 얻어보세요.',
        luckyNumbers: [9, 17, 23, 29],
        luckyColor: '분홍색',
        luckyTime: '오후 2-4시'
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
      // 개인화된 요소 추가
      advice: `${selectedFortune.advice} 특히 ${age}세 ${gender === 'male' ? '남성' : gender === 'female' ? '여성' : ''}으로서의 경험을 살려보세요.`
    };
  };

  // 사용자 프로필이 변경되면 자동으로 운세 생성
  useEffect(() => {
    if (userProfile && userProfile.occupation) {
      generateFortune();
    }
  }, [userProfile]);

  return {
    fortune,
    loading,
    error,
    generateFortune
  };
};
