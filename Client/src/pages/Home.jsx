// src/pages/Home.jsx
import React from 'react';
import Navbar from '../components/CommonComponents/Navbar';
import Banner from '../components/HomePageComponents/Banner';
import HowItHelps from '../components/HomePageComponents/HowItHelps';
import WellnessJourney from '../components/HomePageComponents/WellnessJourney';
import Testimonials from '../components/HomePageComponents/Testimonials';
import WellnessCallToAction from '../components/HomePageComponents/WellnessCallToAction';
import Footer from '../components/CommonComponents/Footer';

const Home = () => {
  return (
    <>
      <Navbar />
      <Banner/>
      <HowItHelps/>
      <WellnessJourney/>
      <Testimonials/>
      <WellnessCallToAction/>
      <Footer/>
      
    </>
  );
};

export default Home;
