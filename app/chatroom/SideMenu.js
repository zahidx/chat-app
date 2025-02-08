import { useState } from 'react';
import { FaTimes, FaHome, FaEnvelope, FaCog, FaSignOutAlt, FaUser, FaLock, FaMoon, FaSun } from 'react-icons/fa';

const SideMenu = ({ isOpen, toggleMenu }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark', !darkMode);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Side Menu */}
      <div
        className={`w-64 bg-[#1A1A2E] text-white fixed top-0 left-0 h-full transition-all duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } z-20`}
      >
        <div className="p-6 text-2xl font-semibold border-b border-gray-700 flex justify-between items-center">
          <span>Side Menu</span>
          {/* Close Button */}
          <button
            onClick={toggleMenu}
            className="text-white text-3xl hover:text-gray-400 transition duration-300"
          >
            <FaTimes />
          </button>
        </div>

        {/* Main Navigation Items */}
        <ul className="p-4 space-y-4">
          <li className="flex items-center cursor-pointer hover:bg-[#0F3460] p-2 rounded transition-all duration-200">
            <FaHome className="mr-2" />
            Home
          </li>
          <li className="flex items-center cursor-pointer hover:bg-[#0F3460] p-2 rounded transition-all duration-200">
            <FaEnvelope className="mr-2" />
            Messages
          </li>
          <li className="flex items-center cursor-pointer hover:bg-[#0F3460] p-2 rounded transition-all duration-200">
            <FaCog className="mr-2" />
            Settings
          </li>
          <li className="flex items-center cursor-pointer hover:bg-[#0F3460] p-2 rounded transition-all duration-200">
            <FaSignOutAlt className="mr-2" />
            Logout
          </li>
        </ul>

        {/* Divider */}
        <hr className="my-4 border-gray-600" />

        {/* Settings Section */}
        <ul className="p-4 space-y-4">
          {/* Dark Mode */}
          <li className="flex items-center cursor-pointer hover:bg-[#0F3460] p-2 rounded transition-all duration-200">
            <span className="mr-2">{darkMode ? <FaSun /> : <FaMoon />}</span>
            Dark Mode
            <label className="switch ml-auto">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
                className="opacity-0 w-0 h-0 absolute" // Hide the checkbox
              />
              <span className="slider"></span> {/* The visual slider */}
            </label>
          </li>

          {/* Personal Details */}
          <li
            className="flex items-center cursor-pointer hover:bg-[#0F3460] p-2 rounded transition-all duration-200"
            onClick={() => setShowDetails(!showDetails)}
          >
            <FaUser className="mr-2" />
            Personal Details
          </li>
          {showDetails && (
            <div className="p-2 text-sm text-gray-400 ml-8">
              <p>Name: John Doe</p>
              <p>Email: john.doe@example.com</p>
            </div>
          )}

          {/* Change Password */}
          <li
            className="flex items-center cursor-pointer hover:bg-[#0F3460] p-2 rounded transition-all duration-200"
            onClick={() => setShowPasswordChange(!showPasswordChange)}
          >
            <FaLock className="mr-2" />
            Change Password
          </li>
          {showPasswordChange && (
            <div className="p-2 text-sm text-gray-400 ml-8">
              <input
                type="password"
                placeholder="New Password"
                className="w-full p-2 rounded bg-[#0F3460] text-white mb-2"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-2 rounded bg-[#0F3460] text-white"
              />
            </div>
          )}
        </ul>
      </div>

      
    </>
  );
};

export default SideMenu;