// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signUp } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signUp(email, password);
      navigate('/');
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };

  return (
    // STYLED: Consistent container and spacing
    <div className='max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-2xl'>
      <h1 className='text-4xl font-extrabold mb-8 text-center text-gray-800'>Create Account</h1>
      {error && <p className='bg-red-100 text-red-700 p-3 mb-6 rounded-lg border border-red-300'>{error}</p>}

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label className='block mb-1 font-semibold text-gray-700'>Email Address</label>
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            // STYLED: Clean input with focus ring
            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150' 
            type='email' 
            required
          />
        </div>
        <div>
          <label className='block mb-1 font-semibold text-gray-700'>Password</label>
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            // STYLED: Clean input with focus ring
            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150' 
            type='password' 
            required
          />
        </div>
        <button 
          // STYLED: Primary, bold button with shadow (using indigo for consistent primary action color)
          className='w-full bg-indigo-600 text-white p-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition duration-200 shadow-lg hover:shadow-xl' 
          type='submit'
        >
          Sign Up
        </button>
      </form>
      <p className='text-center mt-6 text-gray-600'>
        Already have an account? <Link to='/login' className='text-indigo-600 font-semibold hover:text-indigo-700 hover:underline'>Sign In</Link>
      </p>
    </div>
  );
};

export default Register;