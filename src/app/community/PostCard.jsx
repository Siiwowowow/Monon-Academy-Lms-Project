"use client";

import React from 'react';
import { FaThumbsUp, FaComment, FaShare, FaGlobe, FaEllipsisH } from 'react-icons/fa';

const PostCard = ({ post, onLike }) => {
  // Format timestamp
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - postTime) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return postTime.toLocaleDateString();
  };

  // Get optimized image grid layout
  const getImageGridClass = (count) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2 gap-1";
    if (count === 3) return "grid-cols-2 gap-1";
    if (count === 4) return "grid-cols-2 gap-1";
    return "grid-cols-3 gap-1";
  };

  // Get optimized image dimensions
  const getImageDimensions = (count, index) => {
    if (count === 1) return "h-64"; // Reduced from h-96
    if (count === 2) return "h-48"; // Reduced from h-64
    if (count === 3 && index === 0) return "h-48 row-span-2"; // Reduced
    if (count === 3) return "h-24"; // Reduced from h-32
    return "h-32"; // Reduced from h-48
  };

  // Get user data with fallbacks
  const getUserData = () => {
    // Handle different user data structures from API
    if (post.user) {
      return {
        name: post.user.name || post.user.displayName || "User",
        avatar: post.user.photoURL || post.user.avatar || "/default-avatar.png",
        email: post.user.email
      };
    }
    
    // Fallback for direct user data
    return {
      name: post.userName || "User",
      avatar: post.userAvatar || "/default-avatar.png",
      email: post.userEmail
    };
  };

  const userData = getUserData();

  return (
    <div className="bg-white rounded-lg border border-gray-200 w-full max-w-2xl mx-auto mb-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Compact Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <img
            src={userData.avatar}
            alt={userData.name}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">{userData.name}</h3>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <span>{formatTimeAgo(post.createdAt || post.timestamp)}</span>
              <span>•</span>
              <span className="flex items-center truncate">
                <FaGlobe className="w-3 h-3 mr-1 flex-shrink-0" /> 
                <span className="truncate">Public</span>
              </span>
            </div>
          </div>
        </div>
        
        <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors flex-shrink-0">
          <FaEllipsisH className="w-4 h-4" />
        </button>
      </div>

      {/* Compact Content */}
      {post.content && (
        <div className="px-3 py-2">
          <p className="text-sm text-gray-800 leading-relaxed line-clamp-4">{post.content}</p>
        </div>
      )}

      {/* Optimized Images Grid */}
      {post.images && post.images.length > 0 && (
        <div className={`p-2 grid ${getImageGridClass(post.images.length)}`}>
          {post.images.slice(0, 9).map((img, idx) => (
            <div 
              key={idx} 
              className={`relative overflow-hidden rounded-lg ${getImageDimensions(post.images.length, idx)}`}
            >
              <img 
                src={img} 
                alt={`post-${idx}`} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
              
              {/* Show count badge if more than 9 images */}
              {idx === 8 && post.images.length > 9 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    +{post.images.length - 9}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats Bar */}
      {(post.likes > 0 || post.comments > 0) && (
        <div className="px-3 py-1 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            {post.likes > 0 && (
              <span>{post.likes} like{post.likes !== 1 ? 's' : ''}</span>
            )}
            {post.comments > 0 && (
              <span>{post.comments} comment{post.comments !== 1 ? 's' : ''}</span>
            )}
          </div>
          {post.shares > 0 && (
            <span>{post.shares} share{post.shares !== 1 ? 's' : ''}</span>
          )}
        </div>
      )}

      {/* Compact Action Buttons */}
      <div className="px-2 py-1 border-t border-gray-100 grid grid-cols-3 text-xs">
        <button 
          onClick={() => onLike(post._id || post.id)} 
          className={`flex items-center justify-center space-x-1 py-2 rounded-lg transition-colors ${
            post.liked ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FaThumbsUp className="w-3 h-3" /> 
          <span>Like</span>
        </button>
        
        <button className="flex items-center justify-center space-x-1 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          <FaComment className="w-3 h-3" /> 
          <span>Comment</span>
        </button>
        
        <button className="flex items-center justify-center space-x-1 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          <FaShare className="w-3 h-3" /> 
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;