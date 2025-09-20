import React from 'react';
import HeroSection from '../components/HeroSection';
import KeyFeaturesSection from '../components/ProblemVisionSection';
import WhyChooseDriveSense from '../components/SolutionsSection';
import { TestimonialSlider } from '../components/ImpactSection';
import Header from '../components/layout/Header';

const Home = () => {
  return (
    <div className="">
      <Header/>
      <HeroSection/>
      <KeyFeaturesSection/>
      <WhyChooseDriveSense/>
      <TestimonialSlider/>
    </div>
  );
};

export default Home;
