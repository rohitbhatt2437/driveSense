'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react'; // Import icons from lucide-react

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex justify-between items-center py-4 px-10 bg-white shadow-md relative">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl font-bold"
      >
        <a href={'/'}>DriveSense</a>
      </motion.div>

      {/* Desktop Menu */}
      <motion.nav
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="hidden md:flex space-x-6"
      >
        <a href="/">Home</a>
        <a href="/about-us">About Us</a>
        <a href="/features">Features</a>
        <a href="/how-it-works">How it works</a>
        <a href="/pricing">Pricing</a>
      </motion.nav>

      {/* Mobile Hamburger button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="md:hidden"
      >
        <button onClick={toggleMenu}>
          {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </motion.div>

      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
          <div className="absolute top-0 right-0 w-3/4 sm:w-1/2 h-full bg-white shadow-lg z-30">
            <div className="p-6 flex justify-end">
              <button onClick={toggleMenu}>
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <nav className="space-y-4 text-center text-lg">
              <a href="/" className="block py-2">Home</a>
              <a href="/about-us" className="block py-2">About Us</a>
              <a href="/features" className="block py-2">Features</a>
              <a href="/how-it-works" className="block py-2">How it works</a>
              <a href="/pricing" className="block py-2">Pricing</a>
            </nav>
          </div>
        </div>
      )}

      {/* Get Started button (always visible) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <button>
          <a href={'/dashboard/form'}>Get Started</a>
        </button>
      </motion.div>
    </header>
  );
}
