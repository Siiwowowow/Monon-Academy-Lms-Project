"use client";

import React from "react";
import { FaSearch, FaPlus, FaUsers } from "react-icons/fa";

const CommunityHeader = ({ onCreatePost, user }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Left: Logo / Title */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
            <FaUsers className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight hidden xs:block">
            Community
          </h1>
        </div>

        {/* Middle: Search Bar */}
        <div className="hidden md:block flex-1 max-w-md mx-2">
          <div className="relative group">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search community..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Right: Action Button */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onCreatePost}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-95 transition-transform"
          >
            <FaPlus className="w-4 h-4" />
            <span className="hidden xs:block">Create Post</span>
          </button>

          {/* Mobile Create Button */}
          <button
            onClick={onCreatePost}
            className="sm:hidden p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-transform"
            aria-label="Create Post"
          >
            <FaPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Search Below Header */}
      <div className="block md:hidden px-4 pb-3">
        <div className="relative group">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search community..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>
      </div>
    </header>
  );
};

export default CommunityHeader;
