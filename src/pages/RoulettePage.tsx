import React from 'react';
import RouletteGame from '../components/RouletteGame';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RoulettePage: React.FC = () => {
  const handleProfileClick = () => {
    // 프로필 모달 열기 로직 (필요시 구현)
    console.log('프로필 클릭됨');
  };

  return (
    <div className="page-container">
      <Header onProfileClick={handleProfileClick} />
      <main className="main-content">
        <RouletteGame />
      </main>
      <Footer />
    </div>
  );
};

export default RoulettePage;