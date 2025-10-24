import React from 'react';
import RouletteGame from '../components/RouletteGame';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RoulettePage: React.FC = () => {
  return (
    <div className="page-container">
      <Header />
      <main className="main-content">
        <RouletteGame />
      </main>
      <Footer />
    </div>
  );
};

export default RoulettePage;