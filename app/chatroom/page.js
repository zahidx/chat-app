'use client';
import SideMenu from './SideMenu';
import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { app } from '../components/firebase';
import { FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaBars } from 'react-icons/fa';

const db = getFirestore(app);

export default function ChatRoom() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const userList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'No Name',
            image: data.profileImage || '/profiled.png',
            timestamp: data.timestamp || 0,
          };
        });

        setUsers(userList.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)));
      } catch (err) {
        setError('Error fetching users');
        console.error(err);
      }
      setLoading(false);
    };
  
    fetchUsers();
  }, []);
  
  // Real-time messages
  useEffect(() => {
    if (selectedUser) {
      const messagesQuery = query(
        collection(db, 'chats', selectedUser.id, 'messages'),
        orderBy('timestamp')
      );
      const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
        const fetchedMessages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
      });

      return () => unsubscribe();
    }
  }, [selectedUser]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim() !== '') {
      try {
        await addDoc(collection(db, 'chats', selectedUser.id, 'messages'), {
          text: message,
          senderId: 'current-user-id',
          timestamp: new Date(),
        });

        toast.success('Message sent!');
        setMessage('');
      } catch (err) {
        toast.error('Failed to send message');
        console.error(err);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0E1628] to-[#380643]">
      
      {/* Sidebar: Show only on mobile if no user is selected */}
      <aside className={`w-full sm:w-1/5 bg-[#1A1A2E] border-r border-gray-700 flex flex-col ${selectedUser ? 'hidden sm:flex' : 'flex'}`}>
        <div className="p-4 text-white text-xl font-bold border-b border-gray-700 text-center">
          Chat Room
        </div>
        <div className="relative">
          <header className="bg-[#0E1628] text-white p-4 flex justify-between items-center">
            <button onClick={toggleMenu} className="text-white">
              <FaBars size={24} />
            </button>
          </header>

          {/* Side Menu */}
          <SideMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {loading ? (
            <div className="text-white text-center p-4">
              <FaSpinner className="animate-spin text-4xl mx-auto" />
            </div>
          ) : error ? (
            <p className="text-red-400 text-center p-4">{error}</p>
          ) : users.length === 0 ? (
            <p className="text-gray-300 text-center p-4">No users found.</p>
          ) : (
            <ul className="space-y-2">
              {users.map((user) => (
                <motion.li
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="flex items-center p-3 cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#0F3460] text-gray-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-12 h-12 rounded-full border-2 border-white mr-3"
                  />
                  <span className="font-medium">{user.name}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Chat Window */}
      {selectedUser && (
        <main className="w-full flex flex-col bg-[#0F172A] sm:flex">
          {/* Back Button (Only on Mobile) */}
          <div className="sm:hidden p-4">
            <button
              onClick={() => setSelectedUser(null)}
              className="text-white bg-gray-700 px-4 py-2 rounded-lg shadow-md transition-transform transform  focus:outline-none focus:ring-2 focus:ring-blue-500 "
            >
              ← Back
            </button>
          </div>

          {/* Chat Header */}
          <div className="p-4 border-b border-gray-700 text-white flex items-center">
            <img
              src={selectedUser.image}
              alt={selectedUser.name}
              className="w-10 h-10 rounded-full border-2 border-white mr-3"
            />
            <span className="text-lg font-semibold">{selectedUser.name}</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
            {messages.length === 0 ? (
              <span className="text-center text-gray-400">Start messaging...</span>
            ) : (
              messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`p-3 rounded-lg ${msg.senderId === 'current-user-id' ? 'bg-blue-600 self-end' : 'bg-gray-800 self-start'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-white">{msg.text}</p>
                </motion.div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-700 flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-2/5 p-2 bg-gray-800 text-white rounded-lg outline-none ml-auto"
              value={message}
              onChange={handleMessageChange}
            />
            <button
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-20"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </main>
      )}
    </div>
  );
}
