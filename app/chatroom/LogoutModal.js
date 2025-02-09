"use client";

import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../components/firebase"; // Adjust path if needed
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FadeLoader } from "react-spinners"; // Import FadeLoader

const LogoutModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      toast.success("✅ Logged out successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });

      setTimeout(() => {
        router.push("/"); // Redirect home
        onClose(); // Close modal
      }, 2000);
    } catch (error) {
      toast.error("❌ Logout failed. Try again.");
      setLoading(false);
    }
  };

  if (!isOpen) return null; // Prevent rendering when not open

  return (
    <AnimatePresence>
      {/* Full-Screen Overlay */}
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose} // Close modal on clicking the backdrop
      />

      {/* Centered Modal with Slide-In and Slide-Out Animations */}
      <motion.div
        initial={{ opacity: 0, y: -100 }} // Start position from the top (slide-in)
        animate={{ opacity: 1, y: 0 }} // End position (modal in view)
        exit={{ opacity: 0, y: -100 }} // Exit position (slide out to the top)
        transition={{ duration: 0.5, ease: "easeOut" }} // Smooth transition
        className="fixed inset-0 flex items-center justify-center p-4 z-30"
      >
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl text-center max-w-xs w-full">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Are you sure you want to log out?
          </h2>

          {/* Buttons */}
          <div className="flex justify-between space-x-4">
            {/* Yes Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleLogout}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition duration-300 flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center -mt-11">
                  <FadeLoader
                    color="#ffffff"
                    loading={loading}
                    cssOverride={{
                      display: "inline-block",
                      marginRight: "28px",
                      height: "5px", // Reduce bar height
                      width: "20px", // Reduce bar width
                      scale: "0.5", // Shrink the whole loader
                    }}
                  />
                </span>
              ) : (
                "Yes, Logout"
              )}
            </motion.button>

            {/* Cancel Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition duration-300"
              disabled={loading}
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LogoutModal;
