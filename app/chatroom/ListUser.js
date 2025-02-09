'use client';
import { useState, useEffect } from 'react';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { app } from '../components/firebase';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { HashLoader } from 'react-spinners';

const db = getFirestore(app);

export default function UsersList({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const userList = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || 'No Name',
          image: doc.data().profileImage || '/profiled.png',
          timestamp: doc.data().timestamp || 0,
        }));

        setUsers(userList);
        setFilteredUsers(userList);
        setLoading(false);
      },
      (err) => {
        setError('Error fetching users');
        console.error(err);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  const sortedUsers = [...filteredUsers].sort(
    (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
  );

  return (
    <div className="flex flex-col flex-1 p-3 sm:p-5 max-h-[100vh]">
      {/* Search Bar (Fixed) */}
      <div className="relative mb-3 w-2/3 sm:w-3/4 sticky top-0 bg-[#1A1A2E] z-10 p-2">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#1A1A2E] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0F3460]"
          aria-label="Search users"
        />
        {search ? (
          <X
            className="absolute right-3 top-2 text-gray-400 cursor-pointer"
            size={24}
            onClick={() => setSearch('')}
            aria-label="Clear search"
          />
        ) : (
          <Search className="absolute right-3 top-4 text-gray-400" size={24} />
        )}
      </div>

      {/* Scrollable User List */}
      <div className="overflow-y-auto flex-1 max-h-[90vh]">
        {loading ? (
          <div className="flex justify-center items-center text-white p-4">
            <HashLoader color="#0632d1" loading={loading} size={50} />
          </div>
        ) : error ? (
          <div className="text-red-400 text-center p-4">
            {error} <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : sortedUsers.length === 0 ? (
          <p className="text-gray-300 text-center p-4">No users found.</p>
        ) : (
          <ul className="space-y-4">
            {sortedUsers.map((user) => (
              <motion.li
                key={user.id}
                onClick={() => onSelectUser(user)}
                className="flex items-center p-3 cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#0F3460] text-gray-300 rounded-lg hover:shadow-lg"
                whileHover={{ scale: 1.0 }}
                role="listitem"
                aria-label={`Select user ${user.name}`}
              >
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-12 h-12 rounded-full border-2 border-white mr-3"
                  aria-hidden="true"
                />
                <div className="flex-1">
                  <span className="font-medium text-sm sm:text-base">{user.name}</span>
                  <span className="block text-xs text-gray-400">Active</span>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
