"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Rajesh Sharma",
    location: "Mumbai",
    rating: 5,
    text: "Excellent service! The home collection was very professional and reports were delivered within 24 hours. Highly recommended.",
    image: "https://images.pexels.com/photos/5214329/pexels-photo-5214329.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    id: 2,
    name: "Priya Mehta",
    location: "Pune",
    rating: 5,
    text: "The health package was comprehensive and affordable. Staff was very courteous and the facility is well-maintained.",
    image: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    id: 3,
    name: "Dr. Anil Kumar",
    location: "Delhi",
    rating: 5,
    text: "As a physician, I trust Scanova for my patients. Their NABL accreditation and accurate reports make them my go-to diagnostic center.",
    image: "https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  }
];

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-64 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Quote className="w-10 h-10 text-scanova-teal mx-auto mb-4" />
            <blockquote className="text-lg md:text-xl text-scanova-text-body mb-6 italic">
              "{testimonials[currentIndex].text}"
            </blockquote>
            
            <div className="flex items-center justify-center gap-4">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-left">
                <div className="font-semibold text-scanova-text-header">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-sm text-scanova-text-body">
                  {testimonials[currentIndex].location}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-1 mt-4">
              {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current mb-3" />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots indicator */}
      <div className="absolute -bottom-0 left-1/2 transform -translate-x-1/2 flex gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-scanova-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}