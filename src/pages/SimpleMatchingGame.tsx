import React, { useState } from 'react';

interface Card {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
}

const values = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊'];

function createCards(): Card[] {
  const pairs = values.flatMap((v, i) => [
    { id: i * 2, value: v, flipped: false, matched: false },
    { id: i * 2 + 1, value: v, flipped: false, matched: false }
  ]);
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
}

const SimpleMatchingGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>(createCards());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  const handleCardClick = (index: number) => {
    const card = cards[index];
    if (card.flipped || card.matched || flipped.length === 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    const newFlipped = [...flipped, index];
    setCards(newCards);
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [i1, i2] = newFlipped;
      if (newCards[i1].value === newCards[i2].value) {
        newCards[i1].matched = true;
        newCards[i2].matched = true;
        setCards(newCards);
        setMatches(m => m + 1);
        setFlipped([]);
      } else {
        setTimeout(() => {
          const temp = [...newCards];
          temp[i1].flipped = false;
          temp[i2].flipped = false;
          setCards(temp);
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setCards(createCards());
    setFlipped([]);
    setMatches(0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold mb-2">Matching Card Game</h1>
        <button onClick={resetGame} className="text-purple-600">Reset</button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            className={`aspect-square rounded-lg flex items-center justify-center text-3xl cursor-pointer ${
              card.flipped || card.matched ? 'bg-purple-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleCardClick(idx)}
          >
            {card.flipped || card.matched ? card.value : '?'}
          </div>
        ))}
      </div>
      {matches === values.length && (
        <div className="text-center mt-4 font-semibold text-green-600">
          You matched all cards!
        </div>
      )}
    </div>
  );
};

export default SimpleMatchingGame;
