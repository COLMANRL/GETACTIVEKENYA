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
    <section className="hero-section relative pt-24 md:pt-32 pb-16 md:pb-24 px-4 overflow-hidden">
     {/* Background Gradient */}
     <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 z-0"></div>

     {/* Background Image and Blob Effects */}
     <div className="absolute inset-0 z-1">
       {/* Colorful blobs */}
       <div className="absolute -top-4 -left-4 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
       <div className="absolute -bottom-8 -right-4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
       <div className="absolute -bottom-8 left-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

       {/* Background image */}
       <div className="absolute inset-0 flex items-center justify-center">
         <img
           src="/wellness.png"
           alt="Mental wellness background"
           className="w-full h-full object-cover opacity-15"
         />
       </div>
     </div>

     {/* Content Layer */}
     <div className="container mx-auto relative z-10">
       <div className="max-w-2xl mx-auto text-center animate-on-scroll">
         <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
           Nurture Your Mind, <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">Transform Your Life</span>
         </h2>
         <p className="text-lg text-gray-700 mb-8">
           GetActiveKenya provides holistic wellness solutions focusing on mental health, physical wellbeing, and personal growth. Connect with qualified therapists and begin your journey to a balanced life.
         </p>
         <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center animate-on-scroll">
           <a href="#book" className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center justify-center">
             Book a Session <ChevronRight size={20} className="ml-2" />
           </a>
           <a href="#services" className="border-2 border-green-500 text-green-500 px-6 py-3 rounded-full font-medium hover:bg-green-50 transition-colors inline-flex items-center justify-center">
             Explore Services
           </a>
         </div>
       </div>
     </div>
   </section>
 );
};

export default HeroSection;
