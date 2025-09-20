'use client';

import { motion } from 'framer-motion';
import { Monitor, Activity, BarChart } from 'lucide-react';

export default function KeyFeaturesSection() {
  const features = [
    {
      icon: <Monitor className="text-4xl text-cyan-400" />,
      title: 'Real-Time Monitoring',
      description:
        'Track your fleet’s location, speed, and performance in real-time with advanced GPS and IoT sensors. Monitor critical metrics like fuel usage, engine health, and maintenance schedules to stay ahead of potential issues.',
    },
    {
      icon: <Activity className="text-4xl text-emerald-400" />,
      title: 'Driver Behavior Analytics',
      description:
        'Gain insights into driver performance with detailed analytics on speed, braking patterns, and idle time. Identify unsafe practices, reduce accidents, and reward safe driving behaviors to foster a safety-first culture in your fleet.',
    },
    {
      icon: <BarChart className="text-4xl text-violet-400" />,
      title: 'Actionable Insights',
      description:
        'Utilize AI-powered data analysis to identify patterns, predict maintenance needs, and optimize routes. Our insights help you make informed decisions to reduce costs, improve efficiency, and achieve sustainable fleet operations.',
    },
  ];

  return (
    <section className="py-20 px-10 text-center bg-zinc-900 text-white">
      <motion.h2
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold mb-4"
      >
        Key Features of <span className="text-cyan-400">DriveSense</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto"
      >
        Discover the powerful features of DriveSense that redefine fleet safety, efficiency, and performance through cutting-edge technology.
      </motion.p>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
            className="bg-zinc-800 rounded-2xl shadow-lg p-8 hover:shadow-cyan-500/20 transition-shadow duration-300"
          >
            <div className="mb-6 flex justify-center">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-12">
        <button className="bg-cyan-500 text-white hover:bg-cyan-400 transition-colors duration-300 px-6 py-3 text-sm rounded-xl">
          Learn More About Features
        </button>
      </div>
    </section>
  );
}
