'use client'
import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
;
import { useRouter } from 'next/navigation';
import SocialLogin from '../shareComponent/SocialLogin/SocialLogin';
import { AuthContext } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const { signInUser } = useContext(AuthContext);  // 👈 get signInUser from context
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const result = await signInUser(data.email, data.password);
     toast.success('Login success:', result.user);
      router.push('/'); // redirect after login
    } catch (error) {
      console.error('❌ Login failed:', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white text-gray-600 max-w-md w-full mx-auto p-8 text-left rounded-2xl shadow-xl shadow-black/5 border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-500">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                className="w-full bg-gray-50 border border-gray-300 outline-none rounded-lg py-3 px-4 pl-10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-2 ml-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                className="w-full bg-gray-50 border border-gray-300 outline-none rounded-lg py-3 px-4 pl-10 pr-10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 transition duration-200" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition duration-200" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-2 ml-1">{errors.password.message}</p>
            )}
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Remember me</span>
            </label>
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition duration-200">
              Forgot password?
            </a>
          </div>

          {/* Sign in button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 py-3.5 rounded-lg text-white font-semibold hover:bg-indigo-700 transition duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
          >
            Sign in
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Social login */}
        <SocialLogin />

        {/* Sign up link */}
        <p className="text-center mt-8 text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signUp" className="text-indigo-600 hover:text-indigo-500 font-semibold transition duration-200">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
