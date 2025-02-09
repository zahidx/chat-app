'use client';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import ListUser from './ListUser';
import ChatPage from './ChatPage';
import SideMenu from './SideMenu';
import { motion, AnimatePresence } from 'framer-motion';  // Import framer-motion
import { ClimbingBoxLoader } from 'react-spinners';  // Import ClimbingBoxLoader

export default function ChatRoom() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Removed the useEffect for menu state initialization
  // You can still use it for persistence if needed, but it shouldn't auto-open on page load

  const toggleMenu = () => {
    setIsMenuOpen((prev) => {
      const newState = !prev;
      localStorage.setItem('isMenuOpen', newState.toString());
      return newState;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0E1628] to-[#380643]">
      
      {/* Top Navbar with Toggler */}
      <header className="min-w-[20px] min-h-[60px] p-4 flex items-center justify-between sm:px-6 fixed top-0 left-0 sm:ml-[200px] ml-[240px] sm:mt-3 z-50">
        <button 
          onClick={toggleMenu} 
          className="p-2 rounded-lg shadow-md"
          aria-label="Toggle Sidebar">
          <Menu size={24} className="text-white" />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 relative">
        
        {/* Sidebar - Overlay with animation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.aside
              initial={{ x: '-100%', opacity: 0 }}      // Start from the left side (hidden)
              animate={{ x: 0, opacity: 1 }}            // Slide in and fade in
              exit={{ x: '-100%', opacity: 0 }}         // Slide out and fade out
              transition={{ duration: 0.5 }}            // Smooth transition
              className="absolute inset-0 z-50 bg-[#1A1A2E] w-64 border-r border-gray-700 flex flex-col sm:block"
            >
              <SideMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile View: Show Only User List Initially */}
        <div className={`w-full sm:w-1/5 ${selectedUser ? 'hidden sm:block' : 'block'}`}>
          <ListUser onSelectUser={setSelectedUser} />
        </div>

        {/* Mobile View: Show Chat Only When User is Selected */}
        <div className={`w-full sm:w-2/3 ${selectedUser ? 'block' : 'hidden sm:block'}`}>
          {selectedUser ? (
            <ChatPage selectedUser={selectedUser} onBack={() => setSelectedUser(null)} />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              <ClimbingBoxLoader color="#E5970F" loading={true} size={40} />
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
