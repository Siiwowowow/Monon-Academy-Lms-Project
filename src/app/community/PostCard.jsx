"use client";

import React, { useState } from 'react';
import { FaThumbsUp, FaComment, FaShare, FaGlobe, FaEllipsisH, FaEdit, FaTrash, FaUser } from 'react-icons/fa';

const PostCard = ({ post, onLike, onDelete, onEdit, currentUser }) => {
  const [showMenu, setShowMenu] = useState(false);

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
    if (count === 1) return "h-64";
    if (count === 2) return "h-48";
    if (count === 3 && index === 0) return "h-48 row-span-2";
    if (count === 3) return "h-24";
    return "h-32";
  };

  // Get user data with fallbacks
  const getUserData = () => {
    if (post.user) {
      return {
        name: post.user.name || post.user.displayName || "User",
        avatar: post.user.photoURL || post.user.avatar || "/default-avatar.png",
        email: post.user.email,
        id: post.user._id
      };
    }
    
    return {
      name: post.userName || "User",
      avatar: post.userAvatar || "/default-avatar.png",
      email: post.userEmail,
      id: post.userId
    };
  };

  // Check if current user owns this post
  const isOwnPost = currentUser && (
    post.userId === currentUser._id || 
    post.user?._id === currentUser._id ||
    getUserData().id === currentUser._id
  );

  const userData = getUserData();
  const isLiked = currentUser && post.likedBy?.includes(currentUser._id);

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
        
        {/* Menu Button - Only show if user is logged in */}
        {currentUser && (
          <div className="relative flex-shrink-0">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
            >
              <FaEllipsisH className="w-4 h-4" />
            </button>
            
            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                {isOwnPost ? (
                  <>
                    <button
                      onClick={() => {
                        onEdit(post);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FaEdit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        onDelete(post._id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <FaTrash className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </>
                ) : (
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                    <FaUser className="w-3 h-3" />
                    <span>Report</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
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
          onClick={() => onLike(post._id)} 
          className={`flex items-center justify-center space-x-1 py-2 rounded-lg transition-colors ${
            isLiked ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FaThumbsUp className="w-3 h-3" /> 
          <span>{isLiked ? 'Liked' : 'Like'}</span>
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