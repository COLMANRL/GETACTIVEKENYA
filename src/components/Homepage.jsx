//import React, { useState, useEffect } from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import ServicesSection from './ServicesSection';
import BookingSection from './BookingSection';
import TestimonialsSection from './TestimonialsSection';
import BlogPreviewSection from './BlogPreviewSection';
import ContactSection from './ContactSection';
import Footer from './Footer';
import Chatbot from './Chatbot/Chatbot';



const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <Header />
      <HeroSection />
      <ServicesSection />
      <BlogPreviewSection />
      <BookingSection />
      <TestimonialsSection />
      <ContactSection />
      <Chatbot />
      <Footer />
    </div>
  );
};

export default HomePage;
