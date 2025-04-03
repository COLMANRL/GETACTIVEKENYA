import React from 'react';
import { Shield, Calendar, User } from 'lucide-react';

const BookingSection = () => {
  return (
    <section id="book" className="py-16 px-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-gradient-to-br from-green-500 to-blue-500 p-8 text-white animate-on-scroll opacity-0 transition-opacity duration-1000">
              <h3 className="text-2xl font-bold mb-4">Begin Your Wellness Journey</h3>
              <p className="mb-6">
                Schedule a session with our qualified therapists and start your path to better mental health and overall wellness.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Shield size={20} className="mr-2" />
                  <span>Licensed Professional Therapists</span>
                </li>
                <li className="flex items-center">
                  <Calendar size={20} className="mr-2" />
                  <span>Flexible Scheduling Options</span>
                </li>
                <li className="flex items-center">
                  <User size={20} className="mr-2" />
                  <span>Online & In-Person Sessions</span>
                </li>
              </ul>
            </div>

            <div className="md:w-1/2 p-8 animate-on-scroll opacity-0 transition-opacity duration-1000 delay-300">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Type</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500">
                    <option>Mental Health Consultation</option>
                    <option>Skincare & Wellness</option>
                    <option>Holistic Wellness Package</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
                >
                  Book Appointment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
