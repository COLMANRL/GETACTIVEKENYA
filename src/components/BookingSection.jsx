import React, { useState } from 'react';
import { Shield, Calendar, User, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import baseUrl from "../baseUrl";

const BookingSection = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    sessionType: 'Mental Health Consultation',
    preferredDate: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const response = await fetch(`${baseUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          sessionType: 'Mental Health Consultation',
          preferredDate: '',
          phone: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="book" className="py-16 px-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-gradient-to-br from-green-500 to-blue-500 p-8 text-white">
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

            <div className="md:w-1/2 p-8">
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-md flex items-center">
                  <CheckCircle className="text-green-600 mr-2" size={20} />
                  <span className="text-green-700">Booking request sent successfully! We'll contact you soon.</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-md flex items-center">
                  <AlertCircle className="text-red-600 mr-2" size={20} />
                  <span className="text-red-700">{errorMessage}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Type *</label>
                  <select
                    name="sessionType"
                    value={formData.sessionType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="Mental Health Consultation">Mental Health Consultation</option>
                    <option value="Skincare & Wellness">Skincare & Wellness</option>
                    <option value="Holistic Wellness Package">Holistic Wellness Package</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Any additional information or special requests..."
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin mr-2" size={20} />
                      Booking...
                    </>
                  ) : (
                    'Book Appointment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
