import React, { useState, useEffect } from 'react';

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Sample testimonials
  const testimonials = [
  //  {
    //  name: "Amina K.",
    //  text: "GetActiveKenya transformed my approach to mental wellness. The therapist I connected with understood my unique challenges and helped me develop practical coping strategies."
//    },
    {
      name: "David M.",
      text: "The holistic approach to wellness is what sets GetActiveKenya apart. I've seen improvements in both my mental state and physical wellbeing since starting my journey here."
    },
    {
      name: "Wanjiku N.",
      text: "Booking sessions is incredibly easy, and having the option for online therapy has made professional support accessible for me despite my busy schedule."
    }
  ];

  // Auto-rotate testimonials
    useEffect(() => {
      const interval = setInterval(() => {
        setActiveTestimonial(prev => (prev + 1) % testimonials.length);
      }, 5000);

      return () => clearInterval(interval);
    }, [testimonials.length]); // Include testimonials.length in the dependency array

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 animate-on-scroll opacity-0 transition-opacity duration-1000">
          <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Real stories from those who have experienced transformation through our services.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 shadow-md animate-on-scroll opacity-0 transition-opacity duration-1000">
          <div className="relative h-48">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 flex flex-col justify-center ${index === activeTestimonial ? 'opacity-100' : 'opacity-0'}`}
              >
                <p className="text-gray-700 italic mb-4 text-lg">"{testimonial.text}"</p>
                <p className="font-bold text-green-600">{testimonial.name}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full ${activeTestimonial === index ? 'bg-green-500' : 'bg-gray-300'} transition-colors`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
