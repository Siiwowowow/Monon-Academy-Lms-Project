'use client';
import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import useAxiosSecure from '@/hooks/useAxiosSecure';

export default function SocialLogin() {
  const { signInWithGoogle } = useContext(AuthContext);
  const router = useRouter();
  const axiosSecure = useAxiosSecure();

  // 🧠 Function to save user info to DB
  const saveUserToDB = async (user) => {
    try {
      const userInfo = {
        name: user.displayName || user.name,
        email: user.email,
        photoURL: user.photoURL || null,
        provider: 'google',         // OAuth provider or 'credentials'
        role: 'student',            // User role
        status: 'active',           // active, banned, suspended
        isVerified: false,          // default false, can update after email verification
        preferences: {              // default preferences
          language: 'en',
          theme: 'light',
          notifications: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),      // for tracking profile updates
        lastLogin: new Date(),      // track last login time
        loginMethod: 'google',      // store how the user logged in this time
      };
  
      const res = await axiosSecure.post('/api/users', userInfo);
  
      if (res.status === 200 || res.status === 201) {
        toast.success(`Welcome ${userInfo.name}`);
      } else {
        toast.error('Failed to save user data');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Something went wrong saving user');
    }
  };
  

  // 🧭 Handle Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      await saveUserToDB(user);
      toast.success('Login successful');
      router.push('/');
    } catch (error) {
      console.error('Google login failed:', error.message);
      toast.error('Google login failed');
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      {/* Apple (optional) */}
      <button
        type="button"
        className="w-full flex items-center gap-2 justify-center bg-black py-2.5 rounded-full text-white font-medium hover:bg-gray-800 transition duration-200 mb-3"
      >
        <img
          className="h-4 w-4"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/appleLogo.png"
          alt="appleLogo"
        />
        Sign up with Apple
      </button>

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center gap-2 justify-center bg-white border border-gray-500/30 py-2.5 rounded-full text-gray-800 font-medium hover:bg-gray-50 transition duration-200"
      >
        <img
          className="h-4 w-4"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png"
          alt="googleFavicon"
        />
        Sign up with Google
      </button>
    </div>
  );
}
