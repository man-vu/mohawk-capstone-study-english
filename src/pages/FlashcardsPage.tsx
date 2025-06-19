import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  mastery: number; // 0-100
  lastReviewed: string | null;
}

const FlashcardsPage: React.FC = () => {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState<Flashcard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Define categories
  const categories = ['Vocabulary', 'Grammar', 'Idioms', 'Academic Writing', 'Speaking'];

  // Sample data - in a real app, this would be fetched from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFlashcards([
        {
          id: '1',
          front: 'What is the difference between "affect" and "effect"?',
          back: '"Affect" is typically a verb meaning "to influence." "Effect" is typically a noun meaning "result."',
          category: 'Grammar',
          mastery: 75,
          lastReviewed: '2023-04-12'
        },
        {
          id: '2',
          front: 'Ameliorate',
          back: 'To make something bad or unsatisfactory better.\n\nExample: The medicine ameliorated her symptoms.',
          category: 'Vocabulary',
          mastery: 45,
          lastReviewed: '2023-04-10'
        },
        {
          id: '3',
          front: 'Once in a blue moon',
          back: 'Very rarely.\n\nExample: I only visit my hometown once in a blue moon.',
          category: 'Idioms',
          mastery: 90,
          lastReviewed: '2023-04-08'
        },
        {
          id: '4',
          front: 'How to structure an argumentative essay introduction',
          back: '1. Hook to grab attention\n2. Background information\n3. Clear thesis statement that takes a position',
          category: 'Academic Writing',
          mastery: 60,
          lastReviewed: '2023-04-05'
        },
        {
          id: '5',
          front: 'Tips for IELTS Speaking Part 2',
          back: '1. Use the preparation time wisely\n2. Structure your answer with an intro, details, and conclusion\n3. Include specific examples\n4. Use a range of vocabulary and grammatical structures',
          category: 'Speaking',
          mastery: 30,
          lastReviewed: null
        },
        {
          id: '6',
          front: 'Ubiquitous',
          back: 'Present, appearing, or found everywhere.\n\nExample: Mobile phones are now ubiquitous in modern society.',
          category: 'Vocabulary',
          mastery: 20,
          lastReviewed: '2023-04-02'
        },
        {
          id: '7',
          front: 'When to use semicolons',
          back: 'Use semicolons to:\n1. Connect closely related independent clauses\n2. Separate items in a list that already contain commas',
          category: 'Grammar',
          mastery: 50,
          lastReviewed: '2023-03-30'
        },
        {
          id: '8',
          front: 'Hit the books',
          back: 'To study intensely.\n\nExample: I need to hit the books this weekend to prepare for my exam.',
          category: 'Idioms',
          mastery: 85,
          lastReviewed: '2023-03-28'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCards = flashcards.filter(card => {
    const matchesSearch = 
      card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.back.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (categoryFilter === 'all') return matchesSearch;
    return matchesSearch && card.category === categoryFilter;
  });

  const startReview = () => {
    if (filteredCards.length > 0) {
      // Sort by mastery level (lower first) and then by last reviewed (oldest first)
      const sortedCards = [...filteredCards].sort((a, b) => {
        if (a.mastery !== b.mastery) return a.mastery - b.mastery;
        
        if (!a.lastReviewed) return -1;
        if (!b.lastReviewed) return 1;
        
        return new Date(a.lastReviewed).getTime() - new Date(b.lastReviewed).getTime();
      });
      
      setActiveCard(sortedCards[0]);
      setShowAnswer(false);
    }
  };

  const updateMastery = (id: string, change: number) => {
    setFlashcards(cards => 
      cards.map(card => {
        if (card.id === id) {
          const newMastery = Math.min(100, Math.max(0, card.mastery + change));
          return {
            ...card,
            mastery: newMastery,
            lastReviewed: new Date().toISOString().split('T')[0]
          };
        }
        return card;
      })
    );
    
    // Move to next card
    const currentIndex = filteredCards.findIndex(card => card.id === activeCard?.id);
    if (currentIndex < filteredCards.length - 1) {
      setActiveCard(filteredCards[currentIndex + 1]);
      setShowAnswer(false);
    } else {
      // End of deck
      setActiveCard(null);
    }
  };

  const getMasteryColorClass = (mastery: number) => {
    if (mastery >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    if (mastery >= 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Flashcards</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review key concepts and vocabulary to improve your IELTS score
            </p>
          </div>
          {!user && (
            <div className="mt-4 md:mt-0 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Sign in to save your progress
              </p>
            </div>
          )}
        </div>

        {activeCard ? (
          <div className="mb-8">
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: showAnswer ? 180 : 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative h-[400px] w-full">
                <div 
                  className={`absolute inset-0 p-8 flex flex-col backface-hidden ${!showAnswer ? 'visible' : 'invisible'}`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 rounded-full">
                      {activeCard.category}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMasteryColorClass(activeCard.mastery)}`}>
                      Mastery: {activeCard.mastery}%
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-center text-center">
                    <h3 className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white">{activeCard.front}</h3>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setShowAnswer(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Show Answer
                    </button>
                  </div>
                </div>
                
                <div 
                  className={`absolute inset-0 p-8 flex flex-col backface-hidden transform rotate-y-180 ${showAnswer ? 'visible' : 'invisible'}`}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 rounded-full">
                      {activeCard.category}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-center overflow-auto">
                    <div className="max-w-full">
                      <p className="text-lg md:text-xl text-gray-800 dark:text-gray-200 whitespace-pre-line">
                        {activeCard.back}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    <button
                      onClick={() => updateMastery(activeCard.id, -10)}
                      className="bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Difficult
                    </button>
                    <button
                      onClick={() => updateMastery(activeCard.id, 10)}
                      className="bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Easy
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Card {filteredCards.findIndex(card => card.id === activeCard.id) + 1} of {filteredCards.length}
              </p>
              <button
                onClick={() => setActiveCard(null)}
                className="text-purple-600 dark:text-purple-400 font-medium"
              >
                Exit Review
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search flashcards..."
                      className="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="w-full md:w-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex gap-2 flex-wrap">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setCategoryFilter(category === categoryFilter ? 'all' : category)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                        category === categoryFilter
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={startReview}
                  disabled={filteredCards.length === 0 || loading}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 dark:disabled:bg-purple-900/30 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Review
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCards.map(card => (
                    <motion.div 
                      key={card.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 rounded-full">
                            {card.category}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMasteryColorClass(card.mastery)}`}>
                            Mastery: {card.mastery}%
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-2 mb-4 h-14">
                          {card.front}
                        </h3>
                        
                        <div className="flex justify-between items-center mt-4">
                          <button
                            onClick={() => {
                              setActiveCard(card);
                              setShowAnswer(false);
                            }}
                            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium text-sm"
                          >
                            Review Card
                          </button>
                          
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {card.lastReviewed ? `Last review: ${card.lastReviewed}` : 'Never reviewed'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {filteredCards.length === 0 && (
                  <div className="text-center py-20">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No flashcards found</h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
                  </div>
                )}
              </>
            )}
          </>
        )}

        <div className="mt-8 bg-purple-50 dark:bg-purple-900/10 rounded-lg p-6 border border-purple-100 dark:border-purple-900/30">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pro Tips for Effective Flashcard Study</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Study in short, frequent sessions (15-20 minutes) rather than long marathons</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Try to recall the answer before flipping the card</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Review cards you find difficult more frequently</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Use the flashcards in both directions—practice recalling the definition when given the word, and the word when given the definition</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default FlashcardsPage;