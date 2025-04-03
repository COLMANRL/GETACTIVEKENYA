import React from 'react';
import { Mail } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-on-scroll opacity-0 transition-opacity duration-1000">
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Have questions about our services? Contact us for more information.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 shadow-md animate-on-scroll opacity-0 transition-opacity duration-1000">
          <div className="flex items-center justify-center mb-6">
            <Mail size={24} className="text-green-500 mr-2" />
            <span className="text-gray-700">info@getactivekenya.com</span>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="How can we help you?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="Full name"
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 h-32"
                placeholder="Write your message here..."
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-6 rounded-md hover:opacity-90 transition-opacity"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
