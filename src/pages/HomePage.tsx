import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Categories from '../components/Categories';
import Statistics from '../components/Statistics';
import QuizList from '../components/QuizList';
import Testimonials from '../components/Testimonials';

const HomePage: React.FC = () => (
  <>
  <Hero />
  <Features />
  <Categories />
  <Statistics />
  <QuizList />
  <Testimonials />
  </>
);

export default HomePage;
