import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import React Icons
import { FaGoogle, FaPhone } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError('Both fields are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Firebase authentication
      await signInWithEmailAndPassword(auth, email, password);

      // Show login success toast
      toast.success('Login successful!', { position: 'top-right', autoClose: 2000 });

      // Wait for the toast to disappear, then navigate to /chatroom
      setTimeout(() => {
        window.location.href = '/chatroom'; // Redirect to ChatRoom page
      }, 2600); // Wait 2.6 seconds to ensure toast has time to show
    } catch (err) {
      setError('Invalid credentials');
      toast.error('Login failed. Please check your credentials.', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-40 mt-24 flex justify-center items-center">
      <div className="p-8 rounded-xl max-w-sm w-full">
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              id="email"
              className="w-full bg-gray-800 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              aria-label="Email"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              id="password"
              className="w-full bg-gray-800 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              aria-label="Password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-700 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:from-purple-500 hover:to-pink-600 focus:ring-4 focus:ring-purple-500 focus:outline-none"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="#" className="text-sm text-green-400 hover:underline">Forgot Password?</a>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-50">Don't have an account? <a href="#signup" className="font-semibold text-red-500 hover:underline">Sign up</a></p>
        </div>

        <div className="flex justify-center items-center gap-4 mt-3">
  <button className="p-3 w-24 bg-blue-700 rounded-xl flex justify-center items-center">
    <FaGoogle className="text-white text-2xl" />
  </button>
  <button className="p-3 w-24 bg-green-700 rounded-xl flex justify-center items-center">
    <FaPhone className="text-white text-2xl" />
  </button>
</div>

      </div>

      {/* Toast container to show toasts globally */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}
