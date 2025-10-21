"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaThumbsUp, FaComment, FaShare, FaGlobe, FaEllipsisH, FaEdit, FaTrash } from 'react-icons/fa';

const PostCard = ({ post, currentUserEmail, onLike, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // Get user data with fallbacks
  const getUserData = () => {
    if (post.user) {
      return {
        name: post.user.name || post.user.displayName || "User",
        avatar: post.user.photoURL || post.user.avatar || "/default-avatar.png",
        email: post.user.email || post.userEmail
      };
    }
    
    return {
      name: post.userName || "User",
      avatar: post.userAvatar || "/default-avatar.png",
      email: post.userEmail
    };
  };

  const userData = getUserData();
  const isCurrentUserPost = userData.email === currentUserEmail;

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(post);
    setShowMenu(false);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(post._id, userData.email);
    setShowMenu(false);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    onLike();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 w-full max-w-2xl mx-auto mb-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header with menu */}
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
              <span>{formatTimeAgo(post.createdAt)}</span>
              <span>•</span>
              <FaGlobe className="w-3 h-3" />
              <span>Public</span>
            </div>
          </div>
        </div>
        
        {/* Menu Button */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={handleMenuClick}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <FaEllipsisH className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              {isCurrentUserPost && (
                <>
                  <button
                    onClick={handleEditClick}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors"
                  >
                    <FaEdit className="w-3 h-3" />
                    <span>Edit Post</span>
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2 transition-colors"
                  >
                    <FaTrash className="w-3 h-3" />
                    <span>Delete Post</span>
                  </button>
                  <div className="border-t border-gray-200"></div>
                </>
              )}
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                Save Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <div className="px-3 py-2">
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>
      )}

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="p-2">
          <img 
            src={post.images[0]} 
            alt="Post" 
            className="w-full h-auto rounded-lg max-h-96 object-cover"
          />
        </div>
      )}

      {/* Stats */}
      {(post.likes > 0 || post.commentsCount > 0) && (
        <div className="px-3 py-1 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            {post.likes > 0 && (
              <span>{post.likes} like{post.likes !== 1 ? 's' : ''}</span>
            )}
            {post.commentsCount > 0 && (
              <span>{post.commentsCount} comment{post.commentsCount !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-2 py-1 border-t border-gray-100 grid grid-cols-3 text-xs">
        <button 
          onClick={handleLikeClick}
          className={`flex items-center justify-center space-x-1 py-2 rounded-lg transition-colors ${
            post.liked 
              ? 'text-blue-600 bg-blue-50 font-semibold' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FaThumbsUp className={`w-3 h-3 ${post.liked ? 'text-blue-600' : ''}`} /> 
          <span className={post.liked ? 'text-blue-600 font-semibold' : ''}>
            {post.liked ? 'Liked' : 'Like'}
          </span>
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