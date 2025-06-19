import React, { useState } from 'react';
import { motion } from 'framer-motion';

type IELTSScore = '6.0' | '6.5' | '7.0' | '7.5' | '8.0' | '8.5' | '9.0';
type StudyDuration = '1 month' | '2 months' | '3 months' | '6 months';

interface StudyPlan {
  duration: StudyDuration;
  reading: string[];
  writing: string[];
  listening: string[];
  speaking: string[];
  weeklyHours: number;
  recommendedResources: string[];
}

const StudyPlansPage: React.FC = () => {
  const [targetScore, setTargetScore] = useState<IELTSScore | null>(null);
  const [currentLevel, setCurrentLevel] = useState<IELTSScore | null>(null);
  const [studyDuration, setStudyDuration] = useState<StudyDuration | null>(null);
  const [showPlan, setShowPlan] = useState(false);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);

  const scoreOptions: IELTSScore[] = ['6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'];
  const durationOptions: StudyDuration[] = ['1 month', '2 months', '3 months', '6 months'];

  const generateStudyPlan = () => {
    if (!targetScore || !currentLevel || !studyDuration) return;

    const targetScoreNum = parseFloat(targetScore);
    const currentLevelNum = parseFloat(currentLevel);
    const scoreDifference = targetScoreNum - currentLevelNum;

    // Base weekly hours based on duration and score difference
    let baseHours = 10;
    if (scoreDifference > 1) baseHours = 15;
    if (scoreDifference > 1.5) baseHours = 20;

    // Adjust based on study duration
    let weeklyHours = baseHours;
    if (studyDuration === '1 month') weeklyHours = baseHours * 2;
    if (studyDuration === '6 months') weeklyHours = Math.max(5, baseHours * 0.7);

    const plan: StudyPlan = {
      duration: studyDuration,
      weeklyHours: Math.round(weeklyHours),
      reading: getReadingPlan(targetScoreNum),
      writing: getWritingPlan(targetScoreNum),
      listening: getListeningPlan(targetScoreNum),
      speaking: getSpeakingPlan(targetScoreNum),
      recommendedResources: getRecommendedResources(targetScoreNum)
    };

    setStudyPlan(plan);
    setShowPlan(true);
  };

  const getReadingPlan = (targetScore: number): string[] => {
    const basePlan = [
      "Practice reading passages daily",
      "Learn skimming and scanning techniques",
      "Build academic vocabulary"
    ];

    if (targetScore >= 7.0) {
      basePlan.push("Practice inference and author's opinion questions");
      basePlan.push("Master summarizing paragraphs");
    }

    if (targetScore >= 8.0) {
      basePlan.push("Develop critical analysis skills");
      basePlan.push("Practice speed reading with comprehension");
    }

    return basePlan;
  };

  const getWritingPlan = (targetScore: number): string[] => {
    const basePlan = [
      "Practice Task 1 (charts & graphs) weekly",
      "Write Task 2 essays twice weekly",
      "Learn essay structures and formats"
    ];

    if (targetScore >= 7.0) {
      basePlan.push("Master complex sentence structures");
      basePlan.push("Develop coherence and cohesion skills");
    }

    if (targetScore >= 8.0) {
      basePlan.push("Practice advanced vocabulary usage");
      basePlan.push("Get professional feedback on essays");
    }

    return basePlan;
  };

  const getListeningPlan = (targetScore: number): string[] => {
    const basePlan = [
      "Listen to IELTS practice tests regularly",
      "Practice note-taking while listening",
      "Develop prediction skills before listening"
    ];

    if (targetScore >= 7.0) {
      basePlan.push("Practice with different accents");
      basePlan.push("Listen to academic lectures and discussions");
    }

    if (targetScore >= 8.0) {
      basePlan.push("Practice with distractions present");
      basePlan.push("Develop detailed note-taking techniques");
    }

    return basePlan;
  };

  const getSpeakingPlan = (targetScore: number): string[] => {
    const basePlan = [
      "Practice speaking daily, even alone",
      "Record yourself and analyze your speech",
      "Learn common IELTS speaking topics"
    ];

    if (targetScore >= 7.0) {
      basePlan.push("Practice with a language partner weekly");
      basePlan.push("Work on fluency and natural speech");
    }

    if (targetScore >= 8.0) {
      basePlan.push("Learn idiomatic expressions");
      basePlan.push("Practice complex opinions and ideas");
    }

    return basePlan;
  };

  const getRecommendedResources = (targetScore: number): string[] => {
    const baseResources = [
      "IELTS Master practice tests",
      "Cambridge IELTS book series",
      "Official IELTS Practice Materials"
    ];

    if (targetScore >= 7.0) {
      baseResources.push("Academic Word List (AWL)");
      baseResources.push("TED Talks for listening practice");
    }

    if (targetScore >= 8.0) {
      baseResources.push("The Economist/Guardian articles for reading");
      baseResources.push("Advanced grammar resources");
    }

    return baseResources;
  };

  const renderStudyPlanTimeline = () => {
    if (!studyPlan) return null;
    
    let weeks: number;
    switch (studyPlan.duration) {
      case '1 month': weeks = 4; break;
      case '2 months': weeks = 8; break;
      case '3 months': weeks = 12; break;
      case '6 months': weeks = 24; break;
      default: weeks = 8;
    }

    const timeline = [];
    for (let i = 1; i <= weeks; i++) {
      const isEarlyPhase = i <= weeks * 0.3;
      const isMiddlePhase = i > weeks * 0.3 && i <= weeks * 0.7;
      const isLatePhase = i > weeks * 0.7;

      let focusAreas = [];
      
      if (isEarlyPhase) {
        focusAreas = [
          "Core vocabulary building",
          "Basic test strategies",
          "Foundational skills practice"
        ];
      } else if (isMiddlePhase) {
        focusAreas = [
          "Advanced vocabulary application",
          "Timed practice tests",
          "Feedback implementation"
        ];
      } else if (isLatePhase) {
        focusAreas = [
          "Full mock tests",
          "Targeted weakness practice",
          "Test day strategies"
        ];
      }

      timeline.push(
        <div 
          key={`week-${i}`}
          className="border-l-2 border-purple-400 pl-4 py-2"
        >
          <h4 className="font-semibold text-lg">Week {i}</h4>
          <ul className="ml-5 list-disc text-sm text-gray-600 dark:text-gray-300">
            {focusAreas.map((area, idx) => (
              <li key={idx}>{area}</li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div className="mt-8 pl-4 space-y-2">
        <h3 className="text-xl font-bold mb-4">Study Timeline</h3>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-4">
          {timeline}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">IELTS Study Plans</h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Create your personalized study plan based on your target score
          </p>
        </motion.div>

        {!showPlan ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="space-y-6">
              <div>
                <label htmlFor="targetScore" className="block text-lg font-medium text-gray-900 dark:text-white mb-2">
                  What is your target IELTS score?
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                  {scoreOptions.map(score => (
                    <button
                      key={`target-${score}`}
                      className={`py-2 px-3 rounded-lg text-center ${
                        targetScore === score
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => setTargetScore(score)}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="currentLevel" className="block text-lg font-medium text-gray-900 dark:text-white mb-2">
                  What is your current English level (estimated IELTS score)?
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                  {scoreOptions.map(score => (
                    <button
                      key={`current-${score}`}
                      className={`py-2 px-3 rounded-lg text-center ${
                        currentLevel === score
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => setCurrentLevel(score)}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="duration" className="block text-lg font-medium text-gray-900 dark:text-white mb-2">
                  How long do you plan to study for IELTS?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {durationOptions.map(duration => (
                    <button
                      key={duration}
                      className={`py-2 px-3 rounded-lg text-center ${
                        studyDuration === duration
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => setStudyDuration(duration)}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={generateStudyPlan}
                  disabled={!targetScore || !currentLevel || !studyDuration}
                  className={`w-full py-3 rounded-lg text-white text-lg font-medium 
                    ${
                      !targetScore || !currentLevel || !studyDuration
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                >
                  Generate Study Plan
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Your Personalized Study Plan</h2>
              <button
                onClick={() => setShowPlan(false)}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
              >
                ← Back
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Study Duration</h3>
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300">{studyPlan?.duration}</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Target Score</h3>
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300">{targetScore}</p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Weekly Hours</h3>
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300">{studyPlan?.weeklyHours} hours/week</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Reading Plan
                </h3>
                <ul className="ml-5 list-disc space-y-2 text-gray-600 dark:text-gray-300">
                  {studyPlan?.reading.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Writing Plan
                </h3>
                <ul className="ml-5 list-disc space-y-2 text-gray-600 dark:text-gray-300">
                  {studyPlan?.writing.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Listening Plan
                </h3>
                <ul className="ml-5 list-disc space-y-2 text-gray-600 dark:text-gray-300">
                  {studyPlan?.listening.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                  Speaking Plan
                </h3>
                <ul className="ml-5 list-disc space-y-2 text-gray-600 dark:text-gray-300">
                  {studyPlan?.speaking.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Recommended Resources
              </h3>
              <ul className="ml-5 list-disc space-y-2 text-gray-600 dark:text-gray-300">
                {studyPlan?.recommendedResources.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {renderStudyPlanTimeline()}

            <div className="mt-8 text-center">
              <button
                onClick={() => window.print()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                Print Study Plan
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudyPlansPage;