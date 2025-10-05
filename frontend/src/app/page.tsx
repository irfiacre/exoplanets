'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8 max-w-4xl"
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-6xl font-bold text-gray-900 mb-4"
        >
          Hunting Exoplanets with AI
        </motion.h1>
        
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-2xl md:text-3xl font-semibold text-accent mb-12"
        >
          Exogent AI
        </motion.h2>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <div className="relative">
            <Image
              src="/logo.jpeg"
              alt="Exoplanets Logo"
              width={500}
              height={500}
              className="rounded-md shadow-2xl border-2 border-accent/20"
              priority
            />
            <div className="absolute inset-0 rounded-md bg-gradient-to-t from-accent/10 to-transparent"></div>
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Link href="/novice">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-accent hover:bg-accent/90 text-white font-semibold py-4 px-8 rounded-md text-xl shadow-lg transition-all duration-300 min-w-[280px] border border-accent/20"
            >
              I am new to exoplanets
            </motion.button>
          </Link>

          <Link href="/researcher">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white hover:bg-gray-50 text-accent font-semibold py-4 px-8 rounded-md text-xl shadow-lg transition-all duration-300 min-w-[280px] border-2 border-accent"
            >
              Activate Research Mode
            </motion.button>
          </Link>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute top-20 left-20 w-32 h-32 bg-accent/5 rounded-md rotate-12"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="absolute bottom-20 right-20 w-24 h-24 bg-accent/10 rounded-md -rotate-12"
        />
      </motion.div>
    </div>
  );
}
