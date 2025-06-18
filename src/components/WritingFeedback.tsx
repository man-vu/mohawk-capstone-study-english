import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Target,
  BookOpen,
  Zap,
  Award,
  Star,
  BarChart3,
  MessageSquare,
  Lightbulb,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface WritingFeedbackProps {
  content: string;
  taskType: 'Academic Task 1' | 'Academic Task 2';
  wordCount: number;
  onClose: () => void;
  onRetry: () => void;
}

interface CriterionScore {
  score: number;
  maxScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

interface WritingAssessment {
  taskResponse: CriterionScore;
  coherenceCohesion: CriterionScore;
  lexicalResources: CriterionScore;
  grammaticalAccuracy: CriterionScore;
  overallBand: number;
  estimatedIELTSScore: number;
}

const WritingFeedback: React.FC<WritingFeedbackProps> = ({
  content,
  taskType,
  wordCount,
  onClose,
  onRetry
}) => {
  const [assessment, setAssessment] = useState<WritingAssessment | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  // Simulate AI analysis of the writing
  useEffect(() => {
    const analyzeWriting = () => {
      setIsAnalyzing(true);
      
      // Simulate analysis delay
      setTimeout(() => {
        const mockAssessment = generateMockAssessment(content, taskType, wordCount);
        setAssessment(mockAssessment);
        setIsAnalyzing(false);
      }, 3000);
    };

    analyzeWriting();
  }, [content, taskType, wordCount]);

  const generateMockAssessment = (text: string, type: string, words: number): WritingAssessment => {
    // Basic analysis based on word count and content characteristics
    const hasGoodLength = type.includes('Task 1') ? words >= 150 : words >= 250;
    const hasVariedVocabulary = new Set(text.toLowerCase().split(/\s+/)).size / words > 0.7;
    const hasComplexSentences = text.includes(',') && text.includes(';') || text.includes('however') || text.includes('therefore');
    const hasGoodStructure = text.includes('\n') || text.split('.').length > 3;

    // Task Response/Achievement
    const taskScore = hasGoodLength ? (type.includes('Task 1') ? 7 : 6.5) : 5.5;
    const taskResponse: CriterionScore = {
      score: taskScore,
      maxScore: 9,
      feedback: type.includes('Task 1') 
        ? "Your response addresses the task requirements and presents key features of the data. The overview is present but could be more comprehensive."
        : "Your response addresses the task and presents a clear position. Arguments are developed but need more specific examples and deeper analysis.",
      strengths: type.includes('Task 1')
        ? ["Clear identification of key trends", "Appropriate data description", "Logical organization of information"]
        : ["Clear thesis statement", "Relevant arguments presented", "Position is maintained throughout"],
      improvements: type.includes('Task 1')
        ? ["Include more specific data comparisons", "Strengthen the overview paragraph", "Add more precise language for data description"]
        : ["Provide more specific examples", "Develop counterarguments", "Strengthen conclusion with broader implications"]
    };

    // Coherence and Cohesion
    const cohesionScore = hasGoodStructure ? 6.5 : 5.5;
    const coherenceCohesion: CriterionScore = {
      score: cohesionScore,
      maxScore: 9,
      feedback: "Your writing shows good organization with clear paragraphing. Cohesive devices are used but could be more varied and sophisticated.",
      strengths: ["Clear paragraph structure", "Logical progression of ideas", "Basic cohesive devices used appropriately"],
      improvements: ["Use more sophisticated linking words", "Improve within-paragraph cohesion", "Ensure smoother transitions between ideas"]
    };

    // Lexical Resources
    const lexicalScore = hasVariedVocabulary ? 6 : 5.5;
    const lexicalResources: CriterionScore = {
      score: lexicalScore,
      maxScore: 9,
      feedback: "You demonstrate good vocabulary range with some less common words. Accuracy is generally good but there are some errors in word choice and collocation.",
      strengths: ["Good range of vocabulary", "Appropriate register maintained", "Some less common vocabulary attempted"],
      improvements: ["Use more precise vocabulary", "Work on collocations and word combinations", "Expand academic vocabulary range"]
    };

    // Grammatical Range and Accuracy
    const grammarScore = hasComplexSentences ? 6 : 5.5;
    const grammaticalAccuracy: CriterionScore = {
      score: grammarScore,
      maxScore: 9,
      feedback: "You use a mix of simple and complex sentence structures. Grammar is generally accurate but there are some errors that may impede communication.",
      strengths: ["Variety in sentence structures", "Good control of basic grammar", "Complex sentences attempted"],
      improvements: ["Reduce minor grammatical errors", "Use more sophisticated sentence structures", "Improve punctuation accuracy"]
    };

    const overallBand = Math.round(((taskScore + cohesionScore + lexicalScore + grammarScore) / 4) * 2) / 2;

    return {
      taskResponse,
      coherenceCohesion,
      lexicalResources,
      grammaticalAccuracy,
      overallBand,
      estimatedIELTSScore: overallBand
    };
  };

  const getBandColor = (score: number) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400';
    if (score >= 7) return 'text-blue-600 dark:text-blue-400';
    if (score >= 6) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 5) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getBandBackground = (score: number) => {
    if (score >= 8) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 7) return 'bg-blue-100 dark:bg-blue-900/20';
    if (score >= 6) return 'bg-yellow-100 dark:bg-yellow-900/20';
    if (score >= 5) return 'bg-orange-100 dark:bg-orange-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const getBandDescription = (score: number) => {
    if (score >= 8.5) return 'Excellent';
    if (score >= 7.5) return 'Very Good';
    if (score >= 6.5) return 'Good';
    if (score >= 5.5) return 'Competent';
    if (score >= 4.5) return 'Modest';
    return 'Limited';
  };

  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-6"
            >
              <RefreshCw className="w-16 h-16 text-purple-600" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Analyzing Your Writing
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Our AI is evaluating your response across all IELTS criteria...
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div>✓ Analyzing Task Response</div>
              <div>✓ Evaluating Coherence & Cohesion</div>
              <div>✓ Assessing Lexical Resources</div>
              <div>✓ Checking Grammar & Accuracy</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!assessment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">Writing Assessment Report</CardTitle>
                  <p className="text-purple-100">
                    {taskType} • {wordCount} words
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold mb-1">{assessment.estimatedIELTSScore}</div>
                  <div className="text-sm text-purple-100">Overall Band Score</div>
                  <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30">
                    {getBandDescription(assessment.estimatedIELTSScore)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              {/* Overall Performance Overview */}
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { name: 'Task Response', score: assessment.taskResponse.score, icon: Target },
                  { name: 'Coherence & Cohesion', score: assessment.coherenceCohesion.score, icon: BookOpen },
                  { name: 'Lexical Resources', score: assessment.lexicalResources.score, icon: Zap },
                  { name: 'Grammar & Accuracy', score: assessment.grammaticalAccuracy.score, icon: Award }
                ].map((criterion, index) => {
                  const Icon = criterion.icon;
                  return (
                    <Card key={index} className={`${getBandBackground(criterion.score)} border-0`}>
                      <CardContent className="p-4 text-center">
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${getBandColor(criterion.score)}`} />
                        <div className={`text-2xl font-bold ${getBandColor(criterion.score)}`}>
                          {criterion.score}
                        </div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {criterion.name}
                        </div>
                        <Progress 
                          value={(criterion.score / 9) * 100} 
                          className="mt-2 h-2"
                        />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Detailed Criterion Analysis */}
              <div className="space-y-6">
                {/* Task Response/Achievement */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      {taskType.includes('Task 1') ? 'Task Achievement' : 'Task Response'}
                      <Badge className={`ml-2 ${getBandBackground(assessment.taskResponse.score)} ${getBandColor(assessment.taskResponse.score)} border-0`}>
                        {assessment.taskResponse.score}/9
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      {assessment.taskResponse.feedback}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Strengths
                        </h4>
                        <ul className="space-y-1">
                          {assessment.taskResponse.strengths.map((strength, idx) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <div className="w-1 h-1 bg-green-500 rounded-full mt-2"></div>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Areas for Improvement
                        </h4>
                        <ul className="space-y-1">
                          {assessment.taskResponse.improvements.map((improvement, idx) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <div className="w-1 h-1 bg-orange-500 rounded-full mt-2"></div>
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Coherence and Cohesion */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      Coherence and Cohesion
                      <Badge className={`ml-2 ${getBandBackground(assessment.coherenceCohesion.score)} ${getBandColor(assessment.coherenceCohesion.score)} border-0`}>
                        {assessment.coherenceCohesion.score}/9
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      {assessment.coherenceCohesion.feedback}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Strengths
                        </h4>
                        <ul className="space-y-1">
                          {assessment.coherenceCohesion.strengths.map((strength, idx) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <div className="w-1 h-1 bg-green-500 rounded-full mt-2"></div>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Areas for Improvement
                        </h4>
                        <ul className="space-y-1">
                          {assessment.coherenceCohesion.improvements.map((improvement, idx) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <div className="w-1 h-1 bg-orange-500 rounded-full mt-2"></div>
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lexical Resources */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      Lexical Resources
                      <Badge className={`ml-2 ${getBandBackground(assessment.lexicalResources.score)} ${getBandColor(assessment.lexicalResources.score)} border-0`}>
                        {assessment.lexicalResources.score}/9
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      {assessment.lexicalResources.feedback}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Strengths
                        </h4>
                        <ul className="space-y-1">
                          {assessment.lexicalResources.strengths.map((strength, idx) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <div className="w-1 h-1 bg-green-500 rounded-full mt-2"></div>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Areas for Improvement
                        </h4>
                        <ul className="space-y-1">
                          {assessment.lexicalResources.improvements.map((improvement, idx) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <div className="w-1 h-1 bg-orange-500 rounded-full mt-2"></div>
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Grammatical Range and Accuracy */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-600" />
                      Grammatical Range and Accuracy
                      <Badge className={`ml-2 ${getBandBackground(assessment.grammaticalAccuracy.score)} ${getBandColor(assessment.grammaticalAccuracy.score)} border-0`}>
                        {assessment.grammaticalAccuracy.score}/9
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      {assessment.grammaticalAccuracy.feedback}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Strengths
                        </h4>
                        <ul className="space-y-1">
                          {assessment.grammaticalAccuracy.strengths.map((strength, idx) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <div className="w-1 h-1 bg-green-500 rounded-full mt-2"></div>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Areas for Improvement
                        </h4>
                        <ul className="space-y-1">
                          {assessment.grammaticalAccuracy.improvements.map((improvement, idx) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <div className="w-1 h-1 bg-orange-500 rounded-full mt-2"></div>
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <Lightbulb className="w-5 h-5" />
                    Next Steps & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Priority Areas to Focus On:
                      </h4>
                      <div className="space-y-2">
                        {assessment.estimatedIELTSScore < 6.5 && (
                          <div className="flex items-center gap-2 text-sm">
                            <ArrowRight className="w-4 h-4 text-orange-500" />
                            <span>Focus on meeting minimum word count requirements</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <ArrowRight className="w-4 h-4 text-blue-500" />
                          <span>Practice using varied cohesive devices</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <ArrowRight className="w-4 h-4 text-purple-500" />
                          <span>Expand academic vocabulary range</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <ArrowRight className="w-4 h-4 text-green-500" />
                          <span>Practice complex sentence structures</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Suggested Study Plan:
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-blue-500" />
                          <span>Review band descriptors for your target score</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-500" />
                          <span>Practice {taskType.toLowerCase()} weekly</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-green-500" />
                          <span>Focus on paragraph development</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>Read model answers at your target band level</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center pt-4">
                <Button onClick={onRetry} variant="outline" size="lg">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Another Task
                </Button>
                <Button onClick={onClose} size="lg">
                  Continue Learning
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default WritingFeedback;