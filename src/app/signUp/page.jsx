'use client'
import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import SocialLogin from '../shareComponent/SocialLogin/SocialLogin';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import useAxiosSecure from '@/hooks/useAxiosSecure';

export default function SignUp() {
  const { createUser, uploadProfile } = useContext(AuthContext); // 👈 use context
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const axiosSecure=useAxiosSecure()
  const profilePicture = watch('profilePicture');
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
  
    try {
      // ✅ Create account in Firebase
      const userCredential = await createUser(data.email, data.password);
  
      // ✅ Upload profile info (name + image URL)
      let photoURL = '';
      if (data.profilePicture && data.profilePicture[0]) {
        // For now, use local URL preview
        photoURL = URL.createObjectURL(data.profilePicture[0]);
      }
  
      await uploadProfile({
        displayName: data.fullName,
        photoURL: photoURL || ''
      });
  
      // ✅ Send data to your backend API
      const response = await axiosSecure.post('/api/users', {
        name: data.fullName,
        email: data.email,
        photoURL: photoURL || '',
        provider: 'credentials'
      });
  
      console.log('✅ Backend response:', response.data);
  
      reset();
      router.push('/'); // redirect after successful signup
    } catch (error) {
      console.error('❌ Sign up error:', error);
      setErrorMsg(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white text-gray-500 max-w-md w-full mx-auto p-6 md:p-8 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Create your account
        </h2>

        {errorMsg && (
          <p className="text-red-500 text-center mb-4">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Profile Picture Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                {profilePicture && profilePicture[0] ? (
                  <img 
                    src={URL.createObjectURL(profilePicture[0])} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xs text-center">Upload photo</span>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  {...register('profilePicture')}
                />
                <p className="text-xs text-gray-400 mt-1">JPEG, PNG (Max 5MB)</p>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-700 text-sm font-medium mb-2">
              Full Name *
            </label>
            <input
              id="fullName"
              className="w-full bg-transparent border border-gray-500/30 outline-none rounded-full py-2.5 px-4 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              type="text"
              placeholder="Enter your full name"
              {...register('fullName', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1 ml-4">{errors.fullName.message}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
              Email Address *
            </label>
            <input
              id="email"
              className="w-full bg-transparent border border-gray-500/30 outline-none rounded-full py-2.5 px-4 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              type="email"
              placeholder="Enter your email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
              })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-4">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                id="password"
                className="w-full bg-transparent border border-gray-500/30 outline-none rounded-full py-2.5 px-4 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 pr-10"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Must contain uppercase, lowercase, and number' }
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-4">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                className="w-full bg-transparent border border-gray-500/30 outline-none rounded-full py-2.5 px-4 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 pr-10"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition duration-200"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-4">{errors.confirmPassword.message}</p>}
          </div>

          {/* Terms */}
          <div className="mb-6">
            <label className="flex items-start">
              <input
                type="checkbox"
                {...register('terms', { required: 'You must accept the terms and conditions' })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
              />
              <span className="ml-2 text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-blue-600 underline">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 underline">Privacy Policy</a> *
              </span>
            </label>
            {errors.terms && <p className="text-red-500 text-xs mt-1 ml-4">{errors.terms.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mb-3 py-2.5 rounded-full text-white font-medium transition duration-200 shadow-lg shadow-indigo-500/25 ${loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'}`}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 underline font-medium">
            Log in
          </a>
        </p>

        <SocialLogin />
      </div>
    </div>
  );
}
