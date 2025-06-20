import React from 'react';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Categories from '../components/home/Categories';
import Statistics from '../components/home/Statistics';
import QuizList from '../components/home/QuizList';
import Testimonials from '../components/home/Testimonials';

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
