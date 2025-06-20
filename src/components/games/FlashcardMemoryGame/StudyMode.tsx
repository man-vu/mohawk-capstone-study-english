import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Button } from '../../ui/button';
import { Star, ArrowLeft, ArrowRight, Shuffle, Eye, Home } from 'lucide-react';

interface Flashcard {
  id: string;
  word: string;
  definition: string;
  example: string;
  memorized?: boolean;
}

interface Props {
  onBack: () => void;
}

const StudyMode: React.FC<Props> = ({ onBack }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const API_URL = import.meta.env.VITE_SERVER_ENDPOINT;

  useEffect(() => {
    fetch(`${API_URL}lexicon/words?limit=50`)
      .then(res => res.json())
      .then(data => {
        if (data.response) {
          const mapped = data.response.map((w: any, i: number) => ({
            id: String(w.WordId || i),
            word: w.Word,
            definition: w.Definition,
            example: w.Example || '',
            memorized: false
          }));
          setCards(mapped);
        }
      })
      .catch(() => {});
  }, [API_URL]);

  const next = () => {
    if (index < cards.length - 1) {
      setIndex(index + 1);
      setShowAnswer(false);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setShowAnswer(false);
    }
  };

  const shuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setIndex(0);
    setShowAnswer(false);
  };

  const toggleMemorized = () => {
    setCards(prev =>
      prev.map((c, i) =>
        i === index ? { ...c, memorized: !c.memorized } : c
      )
    );
  };

  if (cards.length === 0) {
    return <div className="text-center">Loading...</div>;
  }

  const card = cards[index];

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            {index + 1} / {cards.length}
          </div>
          {card.memorized && <Star className="w-4 h-4 text-yellow-500" />}
        </CardHeader>
        <CardContent className="p-6 text-center space-y-4">
          <h3 className="text-xl font-bold">{card.word}</h3>
          {showAnswer ? (
            <div>
              <p className="mb-2">{card.definition}</p>
              {card.example && (
                <p className="text-sm italic text-gray-500">"{card.example}"</p>
              )}
            </div>
          ) : (
            <Button variant="outline" onClick={() => setShowAnswer(true)}>
              <Eye className="w-4 h-4 mr-2" /> Show Answer
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={prev} disabled={index === 0}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <div className="flex gap-2">
          <Button
            variant={card.memorized ? 'default' : 'outline'}
            onClick={toggleMemorized}
          >
            <Star className="w-4 h-4 mr-2" />
            {card.memorized ? 'Unmark' : 'Mark'}
          </Button>
          <Button variant="outline" onClick={shuffle}>
            <Shuffle className="w-4 h-4 mr-2" /> Shuffle
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={next}
          disabled={index === cards.length - 1}
        >
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <div className="text-center">
        <Button variant="outline" onClick={onBack}>
          <Home className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    </div>
  );
};

export default StudyMode;
