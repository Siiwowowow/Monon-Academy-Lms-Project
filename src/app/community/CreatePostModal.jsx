"use client";

import React from 'react';
import { FaTimes, FaImage, FaSmile, FaMapMarkerAlt, FaUserTag } from 'react-icons/fa';

const CreatePostModal = ({
  isOpen,
  onClose,
  user,
  newPost,
  setNewPost,
  selectedImages,
  setSelectedImages,
  handlePostSubmit,
  isPosting,
  isEditing = false
}) => {
  if (!isOpen) return null;

  const handleRemoveImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImages([...selectedImages, e.target.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Check if post button should be enabled
  const isPostButtonEnabled = newPost.trim().length > 0 || selectedImages.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Post' : 'Create Post'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isPosting}
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <img
              src={user?.photoURL || "/default-avatar.png"}
              alt={user?.name || "User"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">
                {user?.name || user?.displayName || "User"}
              </h3>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <span className="px-2 py-1 bg-gray-100 rounded-full">Public</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder={`What's on your mind, ${user?.name?.split(' ')[0] || 'there'}?`}
              className="w-full h-32 resize-none border-none focus:outline-none text-gray-900 placeholder-gray-500 text-lg"
              disabled={isPosting}
            />

            {/* Selected Images */}
            {selectedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {selectedImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Selected ${index}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={isPosting}
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add to your post */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Add to your post</span>
            <div className="flex items-center space-x-2">
              <label className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isPosting}
                />
                <FaImage className="w-5 h-5" />
              </label>
              <button 
                className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors"
                disabled={isPosting}
              >
                <FaUserTag className="w-5 h-5" />
              </button>
              <button 
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                disabled={isPosting}
              >
                <FaSmile className="w-5 h-5" />
              </button>
              <button 
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                disabled={isPosting}
              >
                <FaMapMarkerAlt className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handlePostSubmit}
            disabled={isPosting || !isPostButtonEnabled}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isPosting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? 'Updating...' : 'Posting...'}
              </>
            ) : (
              isEditing ? 'Update Post' : 'Post'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;