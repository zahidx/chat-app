import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { app } from './firebase'; // Import Firebase app
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore"; // Add serverTimestamp import

const auth = getAuth(app);
const db = getFirestore(app);

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    dob: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isClient, setIsClient] = useState(false); // State to check if it's client-side

  useEffect(() => {
    setIsClient(true); // Set client-side flag after mount
    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dob: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Store user details in Firestore, including timestamp
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob ? formData.dob.toISOString().split('T')[0] : null,
        uid: user.uid,
        createdAt: serverTimestamp(), // Add timestamp
      });

      // Show success toast
      toast.success('Account created successfully!', { position: "top-right", autoClose: 2000 });

      // Wait for the toast to disappear, then navigate to /chatroom
      setTimeout(() => {
        window.location.href = '/chatroom'; // Redirect to ChatRoom page
      }, 2600); // Wait 2.1 seconds to ensure toast has time to show

      // Reset form after successful signup
      setFormData({ name: '', email: '', phone: '', password: '', dob: null });

    } catch (err) {
      setError(err.message);
      toast.error('Signup failed. Try again.', { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null; // Ensure the component is rendered only on the client

  return (
    <>
      <div id='signup' className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0E1628] to-[#380643] p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          data-aos="fade-up"
          className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-6" data-aos="fade-down">Create an Account</h2>
          {error && <p className="text-red-400 text-center mb-4" data-aos="fade-right">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative" data-aos="fade-left">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent border border-white/30 rounded-lg px-10 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div className="relative" data-aos="fade-right">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border border-white/30 rounded-lg px-10 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div className="relative" data-aos="fade-left">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-transparent border border-white/30 rounded-lg px-10 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div className="relative" data-aos="fade-left">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent border border-white/30 rounded-lg px-10 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="relative" data-aos="fade-right">
              <DatePicker
                selected={formData.dob}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                placeholderText="📅 Select your date of birth"
                className="w-full bg-transparent border border-white/30 rounded-lg px-10 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition duration-300 disabled:opacity-50 flex items-center justify-center"
              disabled={loading}
              data-aos="zoom-in"
            >
              {loading ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5 mr-2"></span> : ''}
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          <p className="text-white/80 text-center mt-4" data-aos="fade-up">
            Already have an account?{' '}
            <Link href="#login" className="text-purple-400 hover:underline">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Toast container to show toasts globally */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </>
  );
}
