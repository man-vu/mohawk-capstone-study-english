import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  example: string;
  partOfSpeech: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  learned: boolean;
}

const VocabularyBuilderPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample data - in a real app, this would be fetched from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setWords([
        {
          id: '1',
          word: 'Articulate',
          definition: 'Having or showing the ability to speak fluently and coherently',
          example: 'She was articulate and well-informed about the issues',
          partOfSpeech: 'adjective',
          level: 'intermediate',
          learned: false
        },
        {
          id: '2',
          word: 'Benevolent',
          definition: 'Well meaning and kindly',
          example: 'A benevolent smile',
          partOfSpeech: 'adjective',
          level: 'advanced',
          learned: true
        },
        {
          id: '3',
          word: 'Concise',
          definition: 'Giving a lot of information clearly and in a few words',
          example: 'The report was concise and informative',
          partOfSpeech: 'adjective',
          level: 'intermediate',
          learned: false
        },
        {
          id: '4',
          word: 'Diligent',
          definition: 'Having or showing care and conscientiousness in one\'s work or duties',
          example: 'She was a diligent student',
          partOfSpeech: 'adjective',
          level: 'intermediate',
          learned: true
        },
        {
          id: '5',
          word: 'Eloquent',
          definition: 'Fluent or persuasive in speaking or writing',
          example: 'An eloquent speech',
          partOfSpeech: 'adjective',
          level: 'advanced',
          learned: false
        },
        {
          id: '6',
          word: 'Fundamental',
          definition: 'Forming a necessary base or core; of central importance',
          example: 'The fundamental principles of democracy',
          partOfSpeech: 'adjective',
          level: 'beginner',
          learned: true
        },
        {
          id: '7',
          word: 'Genuine',
          definition: 'Truly what something is said to be; authentic',
          example: 'Genuine leather',
          partOfSpeech: 'adjective',
          level: 'beginner',
          learned: false
        },
        {
          id: '8',
          word: 'Hypothetical',
          definition: 'Based on or serving as a hypothesis',
          example: 'Let\'s consider a hypothetical situation',
          partOfSpeech: 'adjective',
          level: 'advanced',
          learned: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleLearned = (id: string) => {
    setWords(words.map(word => 
      word.id === id ? { ...word, learned: !word.learned } : word
    ));
  };

  const filteredWords = words.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         word.definition.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'learned') return matchesSearch && word.learned;
    if (filter === 'not-learned') return matchesSearch && !word.learned;
    if (filter === 'beginner') return matchesSearch && word.level === 'beginner';
    if (filter === 'intermediate') return matchesSearch && word.level === 'intermediate';
    if (filter === 'advanced') return matchesSearch && word.level === 'advanced';
    
    return matchesSearch;
  });

  const levelColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Vocabulary Builder</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Expand your IELTS vocabulary with our curated word list
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
                  placeholder="Search vocabulary..."
                  className="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="w-full md:w-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Words</option>
                <option value="learned">Learned</option>
                <option value="not-learned">Not Learned</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWords.map(word => (
                <motion.div 
                  key={word.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{word.word}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-3">{word.partOfSpeech}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${levelColors[word.level]}`}>
                        {word.level.charAt(0).toUpperCase() + word.level.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-gray-800 dark:text-gray-200 mb-3">{word.definition}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm italic mb-4">"{word.example}"</p>
                    
                    <div className="flex justify-between items-center">
                      <button 
                        onClick={() => toggleLearned(word.id)}
                        className={`flex items-center text-sm font-medium px-3 py-1 rounded-full transition-colors ${
                          word.learned 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {word.learned ? (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Learned
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Mark as Learned
                          </>
                        )}
                      </button>
                      
                      <button className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredWords.length === 0 && (
              <div className="text-center py-20">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No words found</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VocabularyBuilderPage;