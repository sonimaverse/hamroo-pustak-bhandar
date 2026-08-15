import React, { useEffect } from 'react';
import { Hero } from '../components/home/Hero';
import { FeaturedBooks } from '../components/home/FeaturedBooks';
import { PopularCategories } from '../components/home/PopularCategories';
import { NewArrivals } from '../components/home/NewArrivals';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { WholesaleCTA } from '../components/home/WholesaleCTA';

export const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Hamro Pustak Bhandar | Online Book Store in Nepal';
  }, []);

  return (
    <div className="space-y-12">
      <Hero />
      <PopularCategories />
      <FeaturedBooks />
      <NewArrivals />
      <WhyChooseUs />
      <WholesaleCTA />
    </div>
  );
};
