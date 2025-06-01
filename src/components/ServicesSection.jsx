import React from 'react';
import { Heart, User, Calendar, ChevronRight } from 'lucide-react';

const ServicesSection = () => {
  return (
    <section id="services" className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-on-scroll opacity-0 transition-opacity duration-1000">
          <h2 className="text-3xl font-bold mb-4">Our Holistic Wellness Services</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Comprehensive approaches to elevate your mental, emotional, and physical wellbeing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mental Health Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow animate-on-scroll opacity-0 transition-opacity duration-1000">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Heart size={24} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Mental Wellness</h3>
              <p className="text-gray-600 mb-4">
                Individual and group therapy sessions with licensed professionals specializing in anxiety, depression, trauma, and more.
              </p>
              <a href="#book" className="text-green-500 font-medium flex items-center">
                Book now <ChevronRight size={16} className="ml-1" />
              </a>
            </div>
          </div>

          {/* Body Wellness Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow animate-on-scroll opacity-0 transition-opacity duration-1000 delay-150">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <User size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Body Care</h3>
              <p className="text-gray-600 mb-4">
                Holistic approaches to skincare, nutrition, and physical wellness that complement mental health practices.
              </p>
              <a href="#" className="text-blue-500 font-medium flex items-center">
                Coming soon <ChevronRight size={16} className="ml-1" />
              </a>
            </div>
          </div>

          {/* Booking Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow animate-on-scroll opacity-0 transition-opacity duration-1000 delay-300">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Calendar size={24} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Therapy Sessions</h3>
              <p className="text-gray-600 mb-4">
                Book personalized one-on-one sessions with our qualified therapists, available both online and in-person.
              </p>
              <a href="#book" className="text-purple-500 font-medium flex items-center">
                Book now <ChevronRight size={16} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
