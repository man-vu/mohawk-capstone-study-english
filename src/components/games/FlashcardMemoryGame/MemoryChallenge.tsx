import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Button } from '../../ui/button';
import { Home } from 'lucide-react';

interface Flashcard {
  id: string;
  word: string;
  definition: string;
  example: string;
}

interface Props {
  onBack: () => void;
}

const DISPLAY_TIME = 2000; // ms
const QUESTION_TIME = 5; // seconds per question

const MemoryChallenge: React.FC<Props> = ({ onBack }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [stage, setStage] = useState<'memorize' | 'quiz' | 'complete'>('memorize');
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(QUESTION_TIME);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const API_URL = import.meta.env.VITE_SERVER_ENDPOINT;

  useEffect(() => {
    fetch(`${API_URL}lexicon/words?limit=10`)
      .then(res => res.json())
      .then(data => {
        if (data.response) {
          const mapped = data.response.map((w: any, i: number) => ({
            id: String(w.WordId || i),
            word: w.Word,
            definition: w.Definition,
            example: w.Example || ''
          }));
          setCards(mapped);
        }
      })
      .catch(() => {});
  }, [API_URL]);

  useEffect(() => {
    if (stage !== 'memorize') return;
    if (index < cards.length) {
      const t = setTimeout(() => setIndex(i => i + 1), DISPLAY_TIME);
      return () => clearTimeout(t);
    }
    if (cards.length > 0 && index >= cards.length) {
      setStage('quiz');
      setIndex(0);
    }
  }, [stage, index, cards]);

  useEffect(() => {
    if (stage !== 'quiz') return;
    if (cards.length === 0) return;
    const correct = cards[index];
    const others = cards
      .filter((_, i) => i !== index)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(c => c.word);
    setOptions([...others, correct.word].sort(() => Math.random() - 0.5));
    setTimer(QUESTION_TIME);
  }, [stage, index, cards]);

  useEffect(() => {
    if (stage !== 'quiz') return;
    if (timer <= 0) {
      nextQuestion();
      return;
    }
    const t = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [stage, timer]);

  const choose = (opt: string) => {
    if (opt === cards[index].word) setScore(s => s + 1);
    nextQuestion();
  };

  const nextQuestion = () => {
    if (index + 1 < cards.length) {
      setIndex(i => i + 1);
    } else {
      setStage('complete');
    }
  };

  if (cards.length === 0) return <div className="text-center">Loading...</div>;

  if (stage === 'complete') {
    return (
      <div className="max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold">Challenge Complete!</h2>
        <p>
          You recalled {score} out of {cards.length}
        </p>
        <Button onClick={() => window.location.reload()}>Play Again</Button>
        <Button variant="outline" onClick={onBack} className="ml-2">
          <Home className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

  if (stage === 'memorize') {
    const card = cards[Math.min(index, cards.length - 1)];
    return (
      <div className="max-w-xl mx-auto text-center space-y-4">
        <p className="text-sm text-gray-500">Memorize the cards...</p>
        <Card>
          <CardHeader>{index + 1} / {cards.length}</CardHeader>
          <CardContent className="space-y-2">
            <h3 className="font-bold text-lg">{card.word}</h3>
            <p>{card.definition}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // quiz stage
  const card = cards[index];
  return (
    <div className="max-w-xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          {index + 1} / {cards.length} - Time: {timer}s
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-medium">{card.definition}</p>
          <div className="grid grid-cols-2 gap-2">
            {options.map(opt => (
              <Button key={opt} onClick={() => choose(opt)}>{opt}</Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="text-center">
        <Button variant="outline" onClick={onBack}>
          <Home className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    </div>
  );
};

export default MemoryChallenge;
