// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signIn(email, password);
      // Navigate to the Dashboard after successful login
      navigate('/');
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };

  return (
    // MODIFIED: Better spacing for fixed navbar, brighter background
    <div className='max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-2xl'> 
      <h1 className='text-4xl font-extrabold mb-6 text-center text-gray-800'>Sign In</h1>
      {error && <p className='bg-red-100 text-red-700 p-3 mb-4 rounded-lg border border-red-300'>{error}</p>}

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label className='block mb-1 font-semibold text-gray-700'>Email Address</label>
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            // MODIFIED: Added focus ring, darker border, larger padding
            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150' 
            type='email' 
            required
          />
        </div>
        <div>
          <label className='block mb-1 font-semibold text-gray-700'>Password</label>
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            // MODIFIED: Added focus ring, darker border, larger padding
            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150' 
            type='password' 
            required
          />
        </div>
        <button 
          // MODIFIED: Stronger button style, larger padding, full width, shadow
          className='w-full bg-indigo-600 text-white p-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition duration-200 shadow-lg hover:shadow-xl' 
          type='submit'
        >
          Sign In
        </button>
      </form>
      <p className='text-center mt-6 text-gray-600'>
        Don't have an account? <Link to='/register' className='text-indigo-600 font-semibold hover:text-indigo-700 hover:underline'>Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;