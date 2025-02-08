'use client';
import { useState, useEffect, useRef } from 'react';
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../components/firebase';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ArrowLeft, Send } from 'lucide-react';

const db = getFirestore(app);
const auth = getAuth(app);

export default function ChatPage({ selectedUser, onBack }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedUser && currentUserId) {
      const chatId = [currentUserId, selectedUser.id].sort().join("_");
      const messagesQuery = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('timestamp', 'asc')
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
  }, [selectedUser, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() === '') {
      toast.warn('Message cannot be empty!');
      return;
    }

    if (currentUserId && selectedUser) {
      try {
        const chatId = [currentUserId, selectedUser.id].sort().join("_");
        await addDoc(collection(db, 'chats', chatId, 'messages'), {
          text: message,
          senderId: currentUserId,
          receiverId: selectedUser.id,
          timestamp: serverTimestamp(),
        });

        setMessage('');
      } catch (err) {
        toast.error('Failed to send message');
        console.error(err);
      }
    }
  };

  return (
    <div className="w-full pt-1 flex flex-col h-screen bg-[#0F172A]">
      
      {/* Header with Back Button */}
      <div className="p-4 border-b border-gray-700 text-white flex items-center">
        <button
          onClick={onBack}
          className="text-white bg-gray-700 px-3 py-2 rounded-lg shadow-md flex items-center"
        >
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>
        <img
          src={selectedUser.image}
          alt={selectedUser.name}
          className="w-10 h-10 rounded-full border-2 border-white mx-4"
        />
        <span className="text-lg font-semibold truncate">{selectedUser.name}</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
        {messages.length === 0 ? (
          <span className="text-center text-gray-400">Start messaging...</span>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`flex ${
                msg.senderId === currentUserId ? 'justify-end' : 'justify-start'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Sender Message - Right Side */}
              {msg.senderId === currentUserId ? (
                <div className="max-w-[75%] md:max-w-[60%]">
                <div className="bg-blue-600 text-white p-3 rounded-lg">
                  <p className="break-words">{msg.text}</p>
                </div>
                <span className="block text-xs text-gray-300 mt-1 text-right mr-1">
                  {msg.timestamp?.toDate
                    ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                    : 'Sending...'}
                </span>
              </div>
              
              ) : (
                /* Receiver Message - Left Side */
                <div className="max-w-[75%] md:max-w-[60%]">
  <div className="bg-gray-800 text-white p-3 rounded-lg">
    <p className="break-words">{msg.text}</p>
  </div>
  <span className="block text-xs ml-[135] text-gray-300 mt-1 text-left">
    {msg.timestamp?.toDate
      ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      : 'Receiving...'}
  </span>
</div>

              )}
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700 flex items-center bg-[#0F172A] sticky bottom-0">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 bg-gray-800 text-white rounded-lg outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          onClick={handleSendMessage}
        >
          <Send size={18} className="mr-1" /> Send
        </button>
      </div>
    </div>
  );
}
