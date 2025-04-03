import React, { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

const HeroSection = () => {
  // Animate on scroll effect
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn');
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0 animate-on-scroll opacity-0 transition-opacity duration-1000">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Nurture Your Mind, <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">Transform Your Life</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            GetActiveKenya provides holistic wellness solutions focusing on mental health, physical wellbeing, and personal growth. Connect with qualified therapists and begin your journey to a balanced life.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center justify-center">
              Book a Session <ChevronRight size={20} className="ml-2" />
            </button>
            <button className="border-2 border-green-500 text-green-500 px-6 py-3 rounded-full font-medium hover:bg-green-50 transition-colors">
              Explore Services
            </button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center animate-on-scroll opacity-0 transition-opacity duration-1000 delay-300">
          <div className="relative w-full max-w-md">
            <div className="absolute -top-4 -left-4 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 -right-4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            <img
              src="/api/placeholder/500/400"
              alt="Mental wellness illustration"
              className="relative rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
