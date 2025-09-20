'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section
      className="relative bg-cover bg-center h-screen"
      style={{
        backgroundImage: `url('https://mehtatransportcorporations.com/wp-content/uploads/2023/11/Blog-EasyHaul-Modes-of-Transport-Title-1.png')`,
      }}
    >
      <div className="relative bg-[url(/transport.jpg)] bg-cover z-10 flex flex-col justify-center px-20 text-white h-full">
        <div className="w-[38rem]">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-7xl text-black font-bold"
          >
            Revolutionizing Fleet Safety with AI & IoT
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-black text-2xl"
          >
            DriveSense leverages cutting-edge AI and IoT to enhance fleet safety, improve efficiency, and reduce operational risks.
          </motion.p>

          <div className="mt-6 space-x-4 flex">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <a href='dashboard/driver-score'
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Get Started
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}


