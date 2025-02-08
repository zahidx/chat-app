"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Login from "./components/Login";
import SignUp from "./components/Signup";


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
    <div id="login" className="relative w-full">
  <div className="min-h-screen flex flex-col justify-center bg-gradient-to-r from-[#1A1A40] to-[#3A0CA3] text-white overflow-hidden px-4">
    
    {/* Full Width Title and Description */}
    <div className="w-full -mb-60 flex flex-col items-center text-center px-6 py-10 sm:py-20">
      <motion.h1
        className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-wide"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        WaveTalk
      </motion.h1>
      <motion.p
        className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
      >
        Chat, Share, and Stay Connected in Real Time with Secure Messaging.
      </motion.p>
    </div>

    {/* Main Content Section */}
    <div className="w-full flex flex-col-reverse sm:flex-row items-center justify-center gap-8 sm:gap-16 px-4 sm:px-10 md:px-20 py-10">
      
      {/* Left Section - Why Choose WaveTalk */}
      <div className="w-full sm:w-6/12 flex flex-col items-center sm:items-start text-center sm:text-left -mt-32 sm:mt-0">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-6">
          Why Choose WaveTalk?
        </h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            { title: "🔒 Secure Messaging", desc: "End-to-end encryption for privacy." },
            { title: "⚡ Real-Time Chat", desc: "Instant messaging with zero lag." },
            { title: "📷 Media Sharing", desc: "Easily share photos, videos, and files." },
            { title: "💬 Group Chats", desc: "Create and manage group conversations effortlessly." },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-5 sm:p-6 bg-white/20 backdrop-blur-md rounded-lg shadow-xl hover:bg-white/40 transition transform hover:scale-105"
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

      {/* Right Section - Login Form */}
      <div className="w-full sm:w-5/12 flex justify-center">
        <Login />
      </div>

    </div>

  </div>

  {/* Sign Up Section */}
  <SignUp />
</div>
  );
}