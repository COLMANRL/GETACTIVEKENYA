import { useState } from 'react';
import { Mail } from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    subject: '',
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({ subject: '', name: '', email: '', message: '' });
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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

          {submitted ? (
            <div className="text-center p-6">
              <h3 className="text-xl font-medium text-green-600 mb-2">Thank You!</h3>
              <p className="text-gray-600">Your message has been sent successfully.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="How can we help you?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 h-32"
                  placeholder="Write your message here..."
                  required
                ></textarea>
              </div>
              {error && (
                <div className="md:col-span-2 text-red-500">{error}</div>
              )}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-6 rounded-md hover:opacity-90 transition-opacity ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
