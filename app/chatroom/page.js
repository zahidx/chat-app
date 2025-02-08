'use client';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import ListUser from './ListUser';
import ChatPage from './ChatPage';
import SideMenu from './SideMenu';

export default function ChatRoom() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Default: Closed

  useEffect(() => {
    const storedMenuState = localStorage.getItem('isMenuOpen');
    if (storedMenuState !== null) {
      setIsMenuOpen(storedMenuState === 'true');
    }
  }, []);

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
      <header className="w-full p-4 flex items-center justify-between sm:px-6">
        <button 
          onClick={toggleMenu} 
          className="p-2 rounded-lg shadow-md"
          aria-label="Toggle Sidebar">
          <Menu size={24} className="text-white" />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 relative sm:flex-row flex-col">
        
        {/* Sidebar - Overlay */}
        {isMenuOpen && (
          <aside className="absolute inset-0 z-50 bg-[#1A1A2E] w-64 border-r border-gray-700 flex flex-col transition-all duration-300 ease-in-out sm:block">
            <SideMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
          </aside>
        )}

        {/* List of Users (30%) */}
        <div className="sm:w-1/5 w-full p-4 border-r border-gray-700">
          <ListUser onSelectUser={setSelectedUser} />
        </div>

        {/* Chat Window (70%) */}
        <div className="sm:w-7/10 w-full p-4">
          {selectedUser ? (
            <ChatPage selectedUser={selectedUser} onBack={() => setSelectedUser(null)} />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              Select a user to start chatting
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
