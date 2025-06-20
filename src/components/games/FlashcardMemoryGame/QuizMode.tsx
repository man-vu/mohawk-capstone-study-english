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

const QuizMode: React.FC<Props> = ({ onBack }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const API_URL = import.meta.env.VITE_SERVER_ENDPOINT;

  useEffect(() => {
    fetch(`${API_URL}lexicon/words?limit=20`)
      .then(res => res.json())
      .then(data => {
        if (data.response) {
          const mapped = data.response.map((w: any, i: number) => ({
            id: String(w.WordId || i),
            word: w.Word,
            definition: w.Definition,
            example: w.Example || ''
          }));
          setCards(mapped.sort(() => Math.random() - 0.5));
        }
      })
      .catch(() => {});
  }, [API_URL]);

  useEffect(() => {
    if (cards.length === 0) return;
    const correct = cards[index];
    const others = cards
      .filter((_, i) => i !== index)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(c => c.word);
    const opts = [...others, correct.word].sort(() => Math.random() - 0.5);
    setOptions(opts);
  }, [cards, index]);

  const choose = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (opt === cards[index].word) setScore(s => s + 1);
    setTimeout(() => {
      if (index + 1 < cards.length) {
        setIndex(i => i + 1);
        setSelected(null);
      } else {
        setShowResults(true);
      }
    }, 1000);
  };

  if (cards.length === 0) return <div className="text-center">Loading...</div>;

  if (showResults) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold">Quiz Complete!</h2>
        <p>
          You scored {score} out of {cards.length}
        </p>
        <Button onClick={() => window.location.reload()}>Play Again</Button>
        <Button variant="outline" onClick={onBack} className="ml-2">
          <Home className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

  const card = cards[index];

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <Card>
        <CardHeader>{index + 1} / {cards.length}</CardHeader>
        <CardContent className="space-y-4">
          <p className="font-medium">{card.definition}</p>
          <div className="grid grid-cols-2 gap-2">
            {options.map(opt => (
              <Button
                key={opt}
                onClick={() => choose(opt)}
                variant={selected === opt ? (opt === card.word ? 'default' : 'destructive') : 'outline'}
              >
                {opt}
              </Button>
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

export default QuizMode;
