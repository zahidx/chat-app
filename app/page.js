"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Login from "./components/Login";


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Show loader for 3 seconds
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-[#1A1A40] to-[#3A0CA3] text-white">
        {/* Advanced 3D Cube Loader */}
        <motion.div
          className="flex justify-center items-center space-x-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-xl"
            animate={{ rotateX: 360, rotateY: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl"
            animate={{ rotateX: 360, rotateY: -360 }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
              delay: 0.4,
            }}
          />
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-indigo-800 to-indigo-400 rounded-xl"
            animate={{ rotateX: -360, rotateY: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
              delay: 0.6,
            }}
          />
        </motion.div>
        <p className="text-lg font-semibold text-gray-300 mt-4"></p>
      </div>
    );
  }

  return (
    <main className="h-screen flex items-center justify-center bg-gradient-to-r from-[#1A1A40] to-[#3A0CA3] text-white overflow-hidden">
      {/* Full Width Title and Description at the Top */}
      <div className="w-full flex flex-col items-center justify-center text-center px-6 py-10 sm:py-20 absolute top-0 left-0 z-10">
        <motion.h1
          className="text-4xl sm:text-6xl font-extrabold mb-4 tracking-wide w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          WaveTalk
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl text-gray-200 mb-8 w-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          Chat, Share, and Stay Connected in Real Time with Secure Messaging.
        </motion.p>
      </div>

      {/* Main Section (Left and Right side) */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center sm:mt-40 px-4 sm:px-20">
        {/* Left Section - Why Choose WaveTalk */}
        <div className="w-full sm:w-7/12 flex flex-col items-center sm:items-center text-center sm:text-left px-4 py-6 mb-10 sm:mb-0">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
            Why Choose WaveTalk?
          </h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {[ 
              { title: "🔒 Secure Messaging", desc: "End-to-end encryption for privacy." },
              { title: "⚡ Real-Time Chat", desc: "Instant messaging with zero lag." },
              { title: "📷 Media Sharing", desc: "Easily share photos, videos, and files." },
              { title: "💬 Group Chats", desc: "Create and manage group conversations effortlessly." }, // New feature added
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white/20 backdrop-blur-md rounded-xl shadow-xl hover:bg-white/40 transition transform hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <h3 className="text-lg sm:text-xl font-bold">{feature.title}</h3>
                <p className="text-gray-300 text-sm sm:text-base">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <Login />

      </div>
    </main>
  );
}
