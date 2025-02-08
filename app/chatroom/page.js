'use client';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import ListUser from './ListUser';
import ChatPage from './ChatPage';
import SideMenu from './SideMenu';

export default function ChatRoom() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Default: Closed

  // Load menu state from localStorage
  useEffect(() => {
    const storedMenuState = localStorage.getItem('isMenuOpen');
    if (storedMenuState !== null) {
      setIsMenuOpen(storedMenuState === 'true'); // Convert string to boolean
    }
  }, []);

  // Save menu state to localStorage on change
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
      <header className="w-full p-4 flex items-center">
        <button 
          onClick={toggleMenu} 
          className="p-2 rounded-lg shadow-md">
          <Menu size={24} className="text-white" />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        
        {/* Sidebar - Collapsible */}
        <aside 
          className={`w-64 border-r border-gray-700 flex flex-col transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'block' : 'hidden'
          } sm:block`}>
          <SideMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
          <ListUser onSelectUser={setSelectedUser} />
        </aside>

        {/* Chat Window */}
        <div className="flex-1">
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
