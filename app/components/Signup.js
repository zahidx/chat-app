import { useState, useEffect, useRef } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import DatePicker from 'react-datepicker';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { app, auth, db } from './firebase'; // Importing Firebase configuration
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';

const SignUp = () => {
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
  const [isClient, setIsClient] = useState(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const dobRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
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
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob ? formData.dob.toISOString().split('T')[0] : null,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });

      toast.success('Account created successfully!', { position: "top-right", autoClose: 2000 });

      setTimeout(() => {
        window.location.href = '/chatroom'; // Redirect after successful signup
      }, 2600);

      setFormData({ name: '', email: '', phone: '', password: '', dob: null });

    } catch (err) {
      setError(err.message);
      toast.error('Signup failed. Try again.', { position: "top-right" });
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
          <h2 className="text-2xl font-bold text-white text-center mb-6" data-aos="fade-down">Create an Account</h2>
          {error && <p className="text-red-400 text-center mb-4" data-aos="fade-right">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative" data-aos="fade-left">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
              <input
                ref={nameRef}
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
                ref={emailRef}
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
                ref={phoneRef}
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
                ref={passwordRef}
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
                ref={dobRef}
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

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </>
  );
};

export default SignUp;
