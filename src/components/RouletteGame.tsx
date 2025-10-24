import React, { useEffect, useRef, useState } from 'react';
import './RouletteGame.css';

interface Prize {
  name: string;
  color: string;
  probability: number;
}

const RouletteGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [remaining, setRemaining] = useState(3);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [resultPrize, setResultPrize] = useState<Prize | null>(null);

  const prizes: Prize[] = [
    { name: '1등: 스타벅스 기프티콘', color: '#ff6b6b', probability: 5 },
    { name: '꽝', color: '#95a5a6', probability: 25 },
    { name: '2등: 500 포인트', color: '#4ecdc4', probability: 15 },
    { name: '꽝', color: '#95a5a6', probability: 25 },
    { name: '3등: 100 포인트', color: '#f39c12', probability: 20 },
    { name: '4등: 쿠폰 5%', color: '#9b59b6', probability: 10 }
  ];

  useEffect(() => {
    drawRoulette();
  }, [currentRotation]);

  const drawRoulette = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 각 섹션 그리기
    const sectionAngle = (2 * Math.PI) / prizes.length;
    
    prizes.forEach((prize, index) => {
      const startAngle = index * sectionAngle + currentRotation;
      const endAngle = (index + 1) * sectionAngle + currentRotation;

      // 섹션 그리기
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 텍스트 그리기
      const textAngle = startAngle + sectionAngle / 2;
      const textX = centerX + Math.cos(textAngle) * (radius * 0.7);
      const textY = centerY + Math.sin(textAngle) * (radius * 0.7);

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(prize.name, 0, 0);
      ctx.restore();
    });
  };

  const selectPrize = (): number => {
    const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);
    let random = Math.random() * totalProbability;
    
    for (let i = 0; i < prizes.length; i++) {
      random -= prizes[i].probability;
      if (random <= 0) {
        return i;
      }
    }
    return 0;
  };

  const spin = () => {
    if (isSpinning || remaining <= 0) return;

    setIsSpinning(true);
    setRemaining(prev => prev - 1);

    const selectedIndex = selectPrize();
    const sectionAngle = 360 / prizes.length;
    const minRotation = 360 * 5;
    const targetAngle = selectedIndex * sectionAngle;
    const finalRotation = minRotation + (360 - targetAngle) + currentRotation;

    setCurrentRotation(finalRotation);
    setResultPrize(prizes[selectedIndex]);

    setTimeout(() => {
      setIsSpinning(false);
      setShowResult(true);
    }, 4000);
  };

  const closeResult = () => {
    setShowResult(false);
    setResultPrize(null);
  };

  return (
    <div className="roulette-game-container">
      <div className="game-header">
        <h1>🎡 행운의 룰렛</h1>
        <p className="subtitle">룰렛을 돌려 경품을 받아가세요!</p>
      </div>

      <div className="game-area">
        <div className="roulette-container">
          <div className="roulette-pin"></div>
          <div className="roulette-wheel">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="roulette-canvas"
            />
          </div>
          <div className="roulette-center">🎁</div>
        </div>
        
        <div className="spin-count">
          남은 기회: <span>{remaining}</span>회
        </div>
      </div>

      <button 
        className="start-button" 
        onClick={spin}
        disabled={isSpinning || remaining <= 0}
      >
        {isSpinning ? '돌아가는 중...' : '룰렛 돌리기'}
      </button>

      <div className="info-box">
        <p><strong>참여 방법</strong></p>
        <p>버튼을 눌러 룰렛을 돌리면 자동으로 경품이 추첨됩니다.</p>
        <p>하루 3회까지 참여 가능합니다.</p>
      </div>

      {showResult && resultPrize && (
        <div className="result-modal">
          <div className="result-content">
            <h2>축하합니다! 🎉</h2>
            <div className="prize-result">
              <div 
                className="prize-color" 
                style={{ backgroundColor: resultPrize.color }}
              ></div>
              <span>{resultPrize.name}</span>
            </div>
            <button className="close-button" onClick={closeResult}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouletteGame;