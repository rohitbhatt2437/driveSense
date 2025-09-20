'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Brain, Link2 } from 'lucide-react';

export default function WhyChooseDriveSense() {
  const features = [
    {
      icon: <ShieldCheck className="text-4xl text-cyan-400" />,
      title: 'Tamper-Proof Hardware',
      description:
        'Our rugged and tamper-resistant devices ensure uninterrupted data collection, providing you with reliable insights under any conditions.',
    },
    {
      icon: <Brain className="text-4xl text-emerald-400" />,
      title: 'AI-Driven Insights',
      description:
        'DriveSense leverages advanced AI algorithms to deliver predictive analytics, optimize fleet performance, and reduce operational costs.',
    },
    {
      icon: <Link2 className="text-4xl text-violet-400" />,
      title: 'ULIP API Integration',
      description:
        'Seamlessly integrates with India’s Unified Logistics Interface Platform (ULIP) for enhanced connectivity and streamlined operations.',
    },
  ];

  return (
    <section className="py-20 px-10 bg-zinc-950 text-white">
      <motion.h2
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-center mb-6"
      >
        Why Choose <span className="text-cyan-400">DriveSense?</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg text-center text-gray-300 max-w-3xl mx-auto mb-12"
      >
        Discover what makes DriveSense the trusted choice for businesses seeking smarter, safer, and more efficient fleet solutions.
      </motion.p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
            className="bg-zinc-900 rounded-2xl shadow-md hover:shadow-cyan-500/20 transition-shadow duration-300 p-8 text-center"
          >
            <div className="mb-6 flex justify-center">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
