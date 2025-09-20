'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

type Testimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  testimonial: string;
  image: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Rohit Sharma',
    role: 'Fleet Manager',
    company: 'LogiTech Solutions',
    testimonial:
      'DriveSense has completely transformed how we monitor and manage our fleet. The real-time tracking and AI insights have saved us countless hours and reduced costs significantly.',
    image: 'https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg',
  },
  {
    id: 2,
    name: 'Anjali Mehta',
    role: 'Operations Head',
    company: 'CargoLink',
    testimonial:
      'The tamper-proof hardware and ULIP API integration are game-changers. DriveSense ensures reliability and seamless connectivity for our logistics network.',
    image: 'https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg',
  },
  {
    id: 3,
    name: 'Vikram Singh',
    role: 'IT Manager',
    company: 'Global Solutions Inc.',
    testimonial:
      'AI-driven insights from DriveSense have optimized our routes and reduced delays by 30%. Highly recommend it for any logistics team looking to innovate.',
    image: 'https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg',
  },
  {
    id: 4,
    name: 'Priya Patel',
    role: 'Supply Chain Director',
    company: 'FreshFarm Logistics',
    testimonial:
      'The mobile cold storage solutions provided by DriveSense have drastically reduced our perishable wastage. A must-have for the food supply chain industry.',
    image: 'https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg',
  },
  {
    id: 5,
    name: 'Amit Kumar',
    role: 'CEO',
    company: 'EcoTrans Solutions',
    testimonial:
      'DriveSense’s eco-friendly technology aligns perfectly with our sustainability goals. The ULIP API integration has made logistics management a breeze.',
    image: 'https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg',
  },
];

export function TestimonialSlider() {


  return (
    <section className="py-20 bg-zinc-950 text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-10">
          What Our <span className="text-cyan-400">Clients Say</span>
        </h2>
        <div className="relative">
            <div className="flex gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-4"
                >
                  <div className="bg-zinc-900 rounded-2xl shadow-md hover:shadow-cyan-500/10 transition-shadow duration-300 h-full p-6 flex flex-col justify-between text-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full mx-auto mb-4 border border-gray-600"
                    />
                    <blockquote className="text-gray-300 italic mb-4 text-sm leading-relaxed">
                      &ldquo;{testimonial.testimonial}&rdquo;
                    </blockquote>
                    <div>
                      <div className="font-semibold text-white text-base">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-zinc-800 hover:bg-zinc-700 border-none shadow-md"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
            <span className="sr-only">Previous slide</span>
          </button>
          <button
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-zinc-800 hover:bg-zinc-700 border-none shadow-md"
          >
            <ChevronRight className="h-5 w-5 text-white" />
            <span className="sr-only">Next slide</span>
          </button>
        </div>
    </section>
  );
}
