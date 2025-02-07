'use client';

import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../components/firebase'; // Adjust path if needed

const db = getFirestore(app);

export default function ChatRoom() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const userList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || 'No Name',
          image: doc.data().image || '/default-avatar.png',
          timestamp: doc.data().timestamp || 0, // Default to 0 if no timestamp
        }));

        // Sort by timestamp, if available, otherwise fallback to sorting by name
        setUsers(
          userList.sort((a, b) => {
            if (a.timestamp && b.timestamp) {
              return b.timestamp - a.timestamp; // Most recent first
            } else {
              return a.name.localeCompare(b.name); // Alphabetical order if timestamp is missing
            }
          })
        );
      } catch (err) {
        setError('Error fetching users');
        console.error(err);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0E1628] to-[#380643]">
      {/* Sidebar (30% width) */}
      <aside className="w-1/3 bg-[#1A1A2E] border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 text-white text-xl font-bold border-b border-gray-700">
          Chat Room
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-white text-center p-4">Loading...</p>
          ) : error ? (
            <p className="text-red-400 text-center p-4">{error}</p>
          ) : users.length === 0 ? (
            <p className="text-gray-300 text-center p-4">No users found.</p>
          ) : (
            <ul className="space-y-1">
              {users.map((user) => (
                <li
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center p-3 cursor-pointer transition-all ${
                    selectedUser?.id === user.id
                      ? 'bg-[#16213E] text-white'
                      : 'hover:bg-[#0F3460] text-gray-300'
                  }`}
                >
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-12 h-12 rounded-full border-2 border-white mr-3"
                  />
                  <span className="font-medium">{user.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Chat Window (70% width) */}
      <main className="w-2/3 flex flex-col bg-[#0F172A]">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-700 text-white flex items-center">
          {selectedUser ? (
            <>
              <img
                src={selectedUser.image}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full border-2 border-white mr-3"
              />
              <span className="text-lg font-semibold">{selectedUser.name}</span>
            </>
          ) : (
            <span className="text-gray-400">Select a user to start chat</span>
          )}
        </div>

        {/* Chat Messages (Placeholder) */}
        <div className="flex-1 flex items-center justify-center text-gray-400">
          {selectedUser ? 'Start messaging...' : 'No chat selected'}
        </div>

        {/* Message Input (Placeholder) */}
        {selectedUser && (
          <div className="p-4 border-t border-gray-700 flex">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 p-2 bg-gray-800 text-white rounded-lg outline-none"
            />
            <button className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Send
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
