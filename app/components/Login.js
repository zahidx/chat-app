import { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';  // Import Font Awesome styles
import { id } from './../../node_modules/date-fns/locale/id';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('Both fields are required');
      return;
    }

    // Example authentication logic (replace with real logic)
    if (email === 'admin@example.com' && password === 'password') {
      alert('Login successful');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className=" ml-40 mt-24 flex justify-center items-center">
      <div className="p-8 rounded-xl  max-w-sm w-full ">
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
>
  Log In
</button>

        </form>
        
        <div className="text-center mt-6">
          <a href="#" className="text-sm text-green-400 hover:underline">Forgot Password?</a>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-50">Don't have an account? <a href="#signup" className=" font-semibold text-red-500 hover:underline">Sign up</a></p>
        </div>

        <div className="flex justify-center items-center gap-4 mt-3">
          <button className="p-3 w-24 bg-blue-700 rounded-xl">
            <i className="fab fa-google text-white"></i>
          </button>
          <button className="p-3 w-24 bg-green-700 rounded-xl">
            <i className="fas fa-phone text-white"></i>
          </button>
        </div>
      </div>


     
    </div>
  );
}
