import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { app, auth, db } from './firebase'; // Import Firebase configuration
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import SModal from './SModal'; // Import SModal component

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    dob: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setIsClient(true);
    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });

      setUserId(user.uid);
      toast.success('Account created successfully!');
      setIsModalOpen(true);

      setFormData({ name: '', email: '', phone: '', password: '', dob: '' });
    } catch (err) {
      setError(err.message);
      toast.error('Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

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
          <h2 className="text-2xl font-bold text-white text-center mb-6" data-aos="fade-down">
            Create an Account
          </h2>
          
          {error && <p className="text-red-400 text-center mb-4" data-aos="fade-right">{error}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
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
  
            {/* Email */}
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
  
            {/* Phone Number */}
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
  
            {/* Password */}
            <div className="relative" data-aos="fade-left">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
              <input
                type={showPassword ? 'text' : 'password'}
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
  
            {/* Date of Birth */}
            <div className="bg-white/10 p-4 rounded-lg shadow-md" data-aos="fade-right">
              <p className="text-sm text-gray-300 mb-2">Date of Birth</p>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full bg-transparent border border-white/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
  
            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition duration-300 disabled:opacity-50 flex items-center justify-center"
              disabled={loading}
              data-aos="zoom-in"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        </motion.div>
      </div>
  
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
  
      {/* Success Modal */}
      <SModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} userId={userId} userInfo={formData} />
    </>
  );
}

export default SignUp;
