import React, { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

const BlogPreviewSection = () => {
  useEffect(() => {
    // Simple function to handle animations
    const animateElements = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');

      elements.forEach(element => {
        // Remove opacity-0 to make elements visible
        element.classList.remove('opacity-0');
      });
    };

    // Trigger animations after a short delay
    setTimeout(animateElements, 500);

    // Optional: Add scroll-based animation if needed
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');

      elements.forEach(element => {
        const position = element.getBoundingClientRect();

        // If element is in viewport
        if(position.top < window.innerHeight) {
          element.classList.remove('opacity-0');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Clean up event listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="animate-on-scroll opacity-0 transition-opacity duration-1000">
            <h2 className="text-3xl font-bold mb-2">Wellness Blog</h2>
            <p className="text-gray-600 max-w-xl">
              Explore our latest articles about mental health, self-care practices, and holistic wellness.
            </p>
          </div>
          <a
            href="/blog"
            className="mt-4 md:mt-0 text-blue-500 font-medium flex items-center hover:text-blue-600 transition-colors animate-on-scroll opacity-0 transition-opacity duration-1000 delay-300"
          >
            View all articles <ChevronRight size={20} className="ml-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Blog Post 1 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow animate-on-scroll opacity-0 transition-opacity duration-1000">
            <img
              src="/blog1.png"
              alt="Blog post thumbnail"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <span className="text-sm text-green-500 font-medium">Mental Health</span>
              <h3 className="text-xl font-bold my-2">Understanding Anxiety in Modern Kenya</h3>
              <p className="text-gray-600 mb-4">
                Exploring the unique challenges and solutions for anxiety in the context of Kenyan society.
              </p>
              <a href="#blog1" className="text-blue-500 font-medium flex items-center">
                Read more <ChevronRight size={16} className="ml-1" />
              </a>
            </div>
          </div>

          {/* Blog Post 2 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow animate-on-scroll opacity-0 transition-opacity duration-1000 delay-150">
            <img
              src="/blog2.png"
              alt="Blog post thumbnail"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <span className="text-sm text-blue-500 font-medium">Body Care</span>
              <h3 className="text-xl font-bold my-2">Natural Skincare for African Skin Types</h3>
              <p className="text-gray-600 mb-4">
                Tips for maintaining healthy, radiant skin using natural ingredients found in Kenya.
              </p>
              <a href="#blog2" className="text-blue-500 font-medium flex items-center">
                Read more <ChevronRight size={16} className="ml-1" />
              </a>
            </div>
          </div>

          {/* Blog Post 3 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow animate-on-scroll opacity-0 transition-opacity duration-1000 delay-300">
            <img
              src="/blog4.png"
              alt="Blog post thumbnail"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <span className="text-sm text-purple-500 font-medium">Holistic Wellness</span>
              <h3 className="text-xl font-bold my-2">The Mind-Body Connection in Wellness</h3>
              <p className="text-gray-600 mb-4">
                How mental health directly impacts physical wellbeing and practical ways to nurture both.
              </p>
              <a href="#blog3" className="text-blue-500 font-medium flex items-center">
                Read more <ChevronRight size={16} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
