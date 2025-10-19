import React, { useState } from 'react';
import './FortuneChart.css';

interface FortuneChartProps {
  workScore: number;
  healthScore: number;
  relationshipScore: number;
  luckScore: number;
  overallScore: number;
}

const FortuneChart: React.FC<FortuneChartProps> = ({
  workScore,
  healthScore,
  relationshipScore,
  luckScore,
  overallScore
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

  // 각 점의 정보
  const pointData = [
    { label: '업무운', score: workScore, color: '#3b82f6' },
    { label: '건강운', score: healthScore, color: '#10b981' },
    { label: '인간관계', score: relationshipScore, color: '#f59e0b' },
    { label: '행운', score: luckScore, color: '#ef4444' },
    { label: '총운', score: overallScore, color: '#8b5cf6' }
  ];

  // 마우스 이벤트 핸들러
  const handleMouseEnter = (index: number, event: React.MouseEvent<SVGCircleElement>) => {
    setHoveredPoint(index);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const handlePointClick = (index: number) => {
    setSelectedPoint(selectedPoint === index ? null : index);
  };

  const closeModal = () => {
    setSelectedPoint(null);
  };

  // 5각형 차트의 좌표 계산 (100을 기준으로)
  const getPolygonPoints = () => {
    const centerX = 100;
    const centerY = 100;
    const radius = 80;
    
    // 각 점의 각도 (라디안)
    const angles = [
      -Math.PI / 2, // 위쪽 (업무운)
      -Math.PI / 2 + (2 * Math.PI / 5), // 오른쪽 위 (건강운)
      -Math.PI / 2 + (4 * Math.PI / 5), // 오른쪽 아래 (인간관계)
      -Math.PI / 2 + (6 * Math.PI / 5), // 왼쪽 아래 (행운)
      -Math.PI / 2 + (8 * Math.PI / 5)  // 왼쪽 위 (총운)
    ];
    
    const scores = [workScore, healthScore, relationshipScore, luckScore, overallScore];
    
    const points = scores.map((score, index) => {
      const scaledRadius = (score / 100) * radius;
      const x = centerX + scaledRadius * Math.cos(angles[index]);
      const y = centerY + scaledRadius * Math.sin(angles[index]);
      return `${x},${y}`;
    });
    
    return points.join(' ');
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return '#4ade80'; // 초록색 (매우 좋음)
    if (score >= 80) return '#22c55e'; // 초록색 (좋음)
    if (score >= 70) return '#eab308'; // 노란색 (보통)
    if (score >= 60) return '#f97316'; // 주황색 (주의)
    return '#ef4444'; // 빨간색 (나쁨)
  };

  const getScoreText = (score: number): string => {
    if (score >= 90) return '매우 좋음';
    if (score >= 80) return '좋음';
    if (score >= 70) return '보통';
    if (score >= 60) return '주의';
    return '나쁨';
  };

  const getScoreDescription = (score: number, label: string): string => {
    const descriptions = {
      '업무운': {
        high: '오늘은 업무에서 큰 성과를 낼 수 있는 날입니다. 중요한 결정을 내리거나 새로운 프로젝트를 시작하기에 좋은 시기입니다.',
        medium: '업무는 안정적으로 진행될 것 같습니다. 꾸준한 노력이 필요한 시기입니다.',
        low: '업무에서 주의가 필요한 날입니다. 신중하게 접근하고 충분한 검토를 거치는 것이 좋겠습니다.'
      },
      '건강운': {
        high: '몸과 마음이 모두 건강한 상태입니다. 새로운 운동을 시작하거나 건강한 습관을 만들기에 좋은 시기입니다.',
        medium: '전반적으로 건강한 상태를 유지하고 있습니다. 규칙적인 생활을 계속하세요.',
        low: '건강 관리에 더욱 신경 써야 할 시기입니다. 충분한 휴식과 규칙적인 생활을 권합니다.'
      },
      '인간관계': {
        high: '사람들과의 관계가 원활하고 새로운 인맥을 만들기에 좋은 날입니다. 소중한 사람들과의 시간을 가져보세요.',
        medium: '인간관계는 평범하게 유지될 것 같습니다. 기존 관계를 소중히 여기세요.',
        low: '인간관계에서 주의가 필요한 시기입니다. 말과 행동을 신중하게 하시기 바랍니다.'
      },
      '행운': {
        high: '운이 좋은 날입니다. 새로운 기회가 찾아올 수 있으니 주변을 둘러보세요.',
        medium: '평범한 운세입니다. 노력한 만큼의 결과를 얻을 수 있을 것입니다.',
        low: '운이 따라주지 않는 시기입니다. 인내심을 가지고 꾸준히 노력하세요.'
      },
      '총운': {
        high: '전반적으로 매우 좋은 운세입니다. 새로운 도전을 시작하기에 적합한 시기입니다.',
        medium: '안정적인 운세를 유지하고 있습니다. 현재 상황을 잘 관리하세요.',
        low: '전반적으로 주의가 필요한 시기입니다. 신중하게 행동하시기 바랍니다.'
      }
    };

    const category = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
    return descriptions[label as keyof typeof descriptions]?.[category] || '운세를 확인해주세요.';
  };

  const getScoreTips = (score: number, label: string): string => {
    const tips = {
      '업무운': {
        high: '중요한 미팅이나 프레젠테이션을 계획해보세요. 새로운 아이디어를 제안할 좋은 시기입니다.',
        medium: '기존 프로젝트에 집중하고 완성도를 높여보세요.',
        low: '급한 결정은 피하고 충분한 검토 후 행동하세요.'
      },
      '건강운': {
        high: '새로운 운동이나 건강한 취미를 시작해보세요.',
        medium: '규칙적인 운동과 충분한 수면을 유지하세요.',
        low: '과로를 피하고 충분한 휴식을 취하세요.'
      },
      '인간관계': {
        high: '새로운 사람들과의 만남을 계획해보세요.',
        medium: '기존 친구들과의 관계를 소중히 여기세요.',
        low: '말을 신중하게 하고 상대방의 입장을 고려하세요.'
      },
      '행운': {
        high: '새로운 기회를 놓치지 마세요. 적극적으로 도전해보세요.',
        medium: '꾸준한 노력이 좋은 결과를 가져올 것입니다.',
        low: '인내심을 가지고 꾸준히 노력하세요.'
      },
      '총운': {
        high: '새로운 도전을 시작하기에 좋은 시기입니다.',
        medium: '현재 상황을 잘 관리하고 발전시켜나가세요.',
        low: '신중하게 행동하고 급한 결정은 피하세요.'
      }
    };

    const category = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
    return tips[label as keyof typeof tips]?.[category] || '오늘도 화이팅하세요!';
  };

  return (
    <div className="fortune-chart">
      <div className="chart-header">
        <h3>📊 오늘의 운세 분석</h3>
        <div className="overall-score">
          <span className="score-number">{overallScore}</span>
          <span className="score-text">점</span>
          <span className={`score-status ${getScoreColor(overallScore)}`}>
            {getScoreText(overallScore)}
          </span>
        </div>
      </div>
      
      <div className="chart-container">
        <svg width="200" height="200" viewBox="0 0 200 200" className="chart-svg">
          {/* 배경 격자 */}
          <g className="grid-lines">
            {[20, 40, 60, 80].map((radius, index) => (
              <circle
                key={index}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="0.5"
                opacity="0.5"
              />
            ))}
          </g>
          
          {/* 축선 */}
          <g className="axis-lines">
            {[0, 72, 144, 216, 288].map((angle, index) => {
              const x1 = 100 + 80 * Math.cos((angle - 90) * Math.PI / 180);
              const y1 = 100 + 80 * Math.sin((angle - 90) * Math.PI / 180);
              return (
                <line
                  key={index}
                  x1="100"
                  y1="100"
                  x2={x1}
                  y2={y1}
                  stroke="#d1d5db"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              );
            })}
          </g>
          
          {/* 5각형 영역 */}
          <polygon
            points={getPolygonPoints()}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3b82f6"
            strokeWidth="2"
            className="fortune-area"
          />
          
          {/* 각 점 표시 */}
          {pointData.map((point, index) => {
            const angles = [
              -Math.PI / 2,
              -Math.PI / 2 + (2 * Math.PI / 5),
              -Math.PI / 2 + (4 * Math.PI / 5),
              -Math.PI / 2 + (6 * Math.PI / 5),
              -Math.PI / 2 + (8 * Math.PI / 5)
            ];
            const scaledRadius = (point.score / 100) * 80;
            const x = 100 + scaledRadius * Math.cos(angles[index]);
            const y = 100 + scaledRadius * Math.sin(angles[index]);
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="6"
                fill={getScoreColor(point.score)}
                stroke="#ffffff"
                strokeWidth="2"
                className={`score-point ${hoveredPoint === index ? 'hovered' : ''} ${selectedPoint === index ? 'selected' : ''}`}
                onMouseEnter={(e) => handleMouseEnter(index, e)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handlePointClick(index)}
                style={{ cursor: 'pointer' }}
              />
            );
          })}
        </svg>
        
        {/* 툴팁 */}
        {hoveredPoint !== null && (
          <div 
            className="chart-tooltip"
            style={{
              position: 'fixed',
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: 'translateX(-50%)',
              zIndex: 1000
            }}
          >
            <div className="tooltip-content">
              <div className="tooltip-label">{pointData[hoveredPoint].label}</div>
              <div className="tooltip-score">{pointData[hoveredPoint].score}점</div>
              <div className="tooltip-status">{getScoreText(pointData[hoveredPoint].score)}</div>
            </div>
          </div>
        )}
        
        {/* 범례 */}
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color work-color"></div>
            <span className="legend-label">업무운</span>
            <span className="legend-score">{workScore}점</span>
          </div>
          <div className="legend-item">
            <div className="legend-color health-color"></div>
            <span className="legend-label">건강운</span>
            <span className="legend-score">{healthScore}점</span>
          </div>
          <div className="legend-item">
            <div className="legend-color relationship-color"></div>
            <span className="legend-label">인간관계</span>
            <span className="legend-score">{relationshipScore}점</span>
          </div>
          <div className="legend-item">
            <div className="legend-color luck-color"></div>
            <span className="legend-label">행운</span>
            <span className="legend-score">{luckScore}점</span>
          </div>
        </div>
      </div>
      
      {/* 점수별 색상 설명 */}
      <div className="score-guide">
        <div className="guide-item">
          <div className="guide-color excellent"></div>
          <span>90점 이상 - 매우 좋음</span>
        </div>
        <div className="guide-item">
          <div className="guide-color good"></div>
          <span>80-89점 - 좋음</span>
        </div>
        <div className="guide-item">
          <div className="guide-color average"></div>
          <span>70-79점 - 보통</span>
        </div>
        <div className="guide-item">
          <div className="guide-color poor"></div>
          <span>60-69점 - 주의</span>
        </div>
        <div className="guide-item">
          <div className="guide-color bad"></div>
          <span>60점 미만 - 나쁨</span>
        </div>
      </div>
      
      {/* 상세 정보 모달 */}
      {selectedPoint !== null && (
        <div className="chart-modal-overlay" onClick={closeModal}>
          <div className="chart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{pointData[selectedPoint].label} 상세 분석</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-content">
              <div className="modal-score-display">
                <div className="modal-score-number">{pointData[selectedPoint].score}</div>
                <div className="modal-score-unit">점</div>
                <div className={`modal-score-status ${getScoreColor(pointData[selectedPoint].score).replace('#', '')}`}>
                  {getScoreText(pointData[selectedPoint].score)}
                </div>
              </div>
              <div className="modal-description">
                {getScoreDescription(pointData[selectedPoint].score, pointData[selectedPoint].label)}
              </div>
              <div className="modal-tips">
                <h4>💡 오늘의 조언</h4>
                <p>{getScoreTips(pointData[selectedPoint].score, pointData[selectedPoint].label)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FortuneChart;

