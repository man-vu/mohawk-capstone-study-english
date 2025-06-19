import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Star, Clock, Users, BookOpen, Play, Award, Globe } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    avatar: string;
    rating: number;
    experience: string;
  };
  duration: string;
  students: number;
  rating: number;
  reviewCount: number;
  price: {
    current: number;
    original?: number;
  };
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  skills: string[];
  features: string[];
  thumbnail: string;
  isPopular?: boolean;
  isBestseller?: boolean;
}

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  const API_URL = import.meta.env.VITE_SERVER_ENDPOINT || '/api/';

  useEffect(() => {
    fetch(`${API_URL}courses`)
      .then(res => res.json())
      .then(data => setCourses(data.response || []))
      .catch(() => {});
  }, []);

  const categories = ['All', 'Complete Prep', 'Writing', 'Speaking', 'Reading', 'Listening'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = courses.filter(course => {
    const categoryMatch = selectedCategory === 'All' || course.category === selectedCategory;
    const levelMatch = selectedLevel === 'All' || course.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  const renderStars = (rating: number, count: number) => {
    return (
      <div className="flex items-center space-x-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {rating} ({count.toLocaleString()})
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            IELTS Courses
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Learn from expert instructors and achieve your target score
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-lg">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>50,000+ Students</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Expert Instructors</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Global Community</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-xl transition-all duration-300 group overflow-hidden">
              {/* Course Thumbnail */}
              <div className="relative overflow-hidden">
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDQwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xODcuNSAxMTIuNUwyMTIuNSA5N1YxMjhMMTg3LjUgMTEyLjVaIiBmaWxsPSIjOTMzM0VBIi8+CjwvU3ZnPgo="
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {course.isBestseller && (
                    <Badge className="bg-orange-500 text-white">Bestseller</Badge>
                  )}
                  {course.isPopular && (
                    <Badge className="bg-red-500 text-white">Popular</Badge>
                  )}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {course.level}
                  </Badge>
                  {renderStars(Math.floor(course.rating), course.reviewCount)}
                </div>
                <CardTitle className="text-lg leading-tight mb-2">
                  {course.title}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {course.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Instructor */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {course.instructor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {course.instructor.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {course.instructor.experience}
                    </p>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-3 gap-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">{course.duration}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Duration</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-300">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">{course.students.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Students</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-300">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm font-medium">{course.skills.length}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Skills</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {course.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {course.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{course.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-1">
                  {course.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      ${course.price.current}
                    </span>
                    {course.price.original && (
                      <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                        ${course.price.original}
                      </span>
                    )}
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters to see more courses
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your IELTS Journey?</h2>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of successful students who achieved their target scores
          </p>
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3"
          >
            Browse All Courses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;