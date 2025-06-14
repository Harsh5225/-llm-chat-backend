import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "https://llm-chat-backend-51h7.onrender.com";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for success message from registration
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/users/login`,
        formData
      );
      
      // Save user info and token to localStorage
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      
      // Set authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Call the onLogin function from props
      if (onLogin) {
        onLogin(response.data);
      }
      
      // Redirect to chat page
      navigate('/chat');
    } catch (error) {
      setError(
        error.response?.data?.error || 
        'An error occurred during login. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="w-full max-w-md bg-white rounded-lg shadow-md p-10">
    <div className="text-center">
      <img
        src="https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"
        alt="Logo"
        className="mx-auto h-16 w-16"
      />
      <h2 className="mt-6 text-2xl font-medium text-gray-900">
        Sign in
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        to continue to your account
      </p>
    </div>

    {message && (
      <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">
        {message}
      </div>
    )}

    {error && (
      <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
        {error}
      </div>
    )}

    <form className="mt-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <label htmlFor="remember-me" className="flex items-center text-sm text-gray-700">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
          />
          Remember me
        </label>
        <a href="#" className="text-sm text-blue-600 hover:underline">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`mt-6 w-full py-2 px-4 rounded-md text-white text-sm font-medium ${
          loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>

    <p className="mt-6 text-sm text-center text-gray-600">
      Don't have an account?{' '}
      <Link to="/register" className="text-blue-600 hover:underline">
        Create one
      </Link>
    </p>
  </div>
</div>

  );
};

export default Login;

   

