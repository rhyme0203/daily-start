import React from 'react';
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
          {[workScore, healthScore, relationshipScore, luckScore, overallScore].map((score, index) => {
            const angles = [
              -Math.PI / 2,
              -Math.PI / 2 + (2 * Math.PI / 5),
              -Math.PI / 2 + (4 * Math.PI / 5),
              -Math.PI / 2 + (6 * Math.PI / 5),
              -Math.PI / 2 + (8 * Math.PI / 5)
            ];
            const scaledRadius = (score / 100) * 80;
            const x = 100 + scaledRadius * Math.cos(angles[index]);
            const y = 100 + scaledRadius * Math.sin(angles[index]);
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={getScoreColor(score)}
                stroke="#ffffff"
                strokeWidth="2"
                className="score-point"
              />
            );
          })}
        </svg>
        
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
    </div>
  );
};

export default FortuneChart;
