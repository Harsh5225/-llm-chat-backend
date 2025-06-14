import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ;

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Send registration request
      await axios.post(
        `${API_URL}/api/users/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password
        }
      );
      
      // Redirect to login with success message
      navigate('/login', { 
        state: { message: 'Registration successful! Please log in.' } 
      });
    } catch (error) {
      setError(
        error.response?.data?.error || 
        'An error occurred during registration. Please try again.'
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
        Create your account
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        or{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          sign in to your existing account
        </Link>
      </p>
    </div>

    {error && (
      <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
        {error}
      </div>
    )}

    <form className="mt-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`mt-6 w-full py-2 px-4 rounded-md text-white text-sm font-medium ${
          loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  </div>
</div>

  );
};

export default Register;
    

