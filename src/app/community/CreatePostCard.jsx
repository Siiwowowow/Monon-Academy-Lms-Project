"use client";

import React, { useRef } from 'react';
import { FaImage, FaVideo, FaSmile } from 'react-icons/fa';

const CreatePostCard = ({ user, onPostClick, onPhotoClick, onVideoClick, onFeelingClick }) => {
  const fileInputRef = useRef(null);

  const handlePhotoClick = () => fileInputRef.current?.click();
  const handleVideoClick = () => alert("Video upload feature coming soon!");
  const handleFeelingClick = () => alert("Feeling/emoji picker coming soon!");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && onPhotoClick) {
      onPhotoClick(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-center space-x-3">
        <img
          src={user?.photoURL || "/default-avatar.png"}
          alt="Your avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <button
          onClick={onPostClick}
          className="flex-1 text-left p-3 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
        >
          What's on your mind, {user?.displayName?.split(' ')[0] || 'User'}?
        </button>
      </div>

      <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
        <button onClick={handlePhotoClick} className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 font-medium transition-colors">
          <FaImage className="text-green-500 w-5 h-5" />
          <span>Photo</span>
        </button>
        <button onClick={handleVideoClick} className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 font-medium transition-colors">
          <FaVideo className="text-red-500 w-5 h-5" />
          <span>Video</span>
        </button>
        <button onClick={handleFeelingClick} className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 font-medium transition-colors">
          <FaSmile className="text-yellow-500 w-5 h-5" />
          <span>Feeling</span>
        </button>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
    </div>
  );
};

export default CreatePostCard;
