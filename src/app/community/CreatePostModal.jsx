"use client";

import React, { useRef } from "react";
import { FaTimes, FaImage, FaSmile, FaGlobe, FaTrash, FaSpinner } from "react-icons/fa";
import toast from 'react-hot-toast';

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
}) => {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const totalAfterUpload = selectedImages.length + files.length;
      if (totalAfterUpload > 10) {
        toast.error(`Maximum 10 images allowed. You have ${selectedImages.length} already.`);
        return;
      }

      const newImages = [];
      let loadedCount = 0;

      files.forEach((file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`"${file.name}" is not a valid image file`);
          return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`"${file.name}" is too large. Max 5MB per image.`);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push(e.target.result);
          loadedCount++;
          
          if (loadedCount === files.length) {
            setSelectedImages((prev) => [...prev, ...newImages]);
            toast.success(`Added ${newImages.length} image${newImages.length > 1 ? 's' : ''}`);
          }
        };
        reader.onerror = () => {
          toast.error(`Failed to load "${file.name}"`);
          loadedCount++;
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (indexToRemove) => {
    setSelectedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    toast.success('Image removed');
  };

  const handleAddMoreImages = () => {
    fileInputRef.current?.click();
  };

  const getGridClass = (imageCount) => {
    if (imageCount === 1) return "grid-cols-1";
    if (imageCount === 2) return "grid-cols-2";
    if (imageCount === 3) return "grid-cols-2";
    if (imageCount === 4) return "grid-cols-2";
    return "grid-cols-3";
  };

  const handleRemoveAllImages = () => {
    if (selectedImages.length > 0) {
      setSelectedImages([]);
      toast.success('All images removed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div
        className="bg-white rounded-lg w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Create Post
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            disabled={isPosting}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form
          onSubmit={handlePostSubmit}
          className="flex-1 overflow-y-auto px-4 py-3"
        >
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={user?.photoURL || "/default-avatar.png"}
              alt="Your avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">{user?.name || user?.displayName || "User"}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <button
                  type="button"
                  className="flex items-center space-x-1 px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
                  disabled={isPosting}
                >
                  <FaGlobe className="w-3 h-3" />
                  <span>Public</span>
                </button>
              </div>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full h-32 p-2 border-none resize-none focus:outline-none text-base sm:text-lg"
            autoFocus
            disabled={isPosting}
          />

          {/* Multiple Images Display */}
          {selectedImages.length > 0 && (
            <div className="mt-4">
              <div
                className={`grid ${getGridClass(
                  selectedImages.length
                )} gap-2 sm:gap-3`}
              >
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-40 sm:h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                      disabled={isPosting}
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                    {selectedImages.length > 1 && (
                      <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                        {index + 1}
                      </div>
                    )}
                  </div>
                ))}

                {/* Add More Button */}
                {selectedImages.length < 10 && (
                  <button
                    type="button"
                    onClick={handleAddMoreImages}
                    className="border-2 border-dashed border-gray-300 rounded-lg h-40 sm:h-48 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    disabled={isPosting}
                  >
                    <FaImage className="text-gray-400 w-8 h-8 mb-2" />
                    <span className="text-gray-600 font-medium">Add More</span>
                    <span className="text-gray-400 text-xs mt-1">
                      {10 - selectedImages.length} remaining
                    </span>
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {selectedImages.length} image
                  {selectedImages.length !== 1 ? "s" : ""} selected
                </span>
                {selectedImages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleRemoveAllImages}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                    disabled={isPosting}
                  >
                    Remove all
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Add to Post */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg mt-4">
            <span className="text-sm font-medium text-gray-700">
              Add to your post
            </span>
            <div className="flex space-x-2">
              <label className={`cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors ${isPosting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <FaImage className="text-green-500 w-5 h-5" />
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  multiple
                  disabled={isPosting}
                />
              </label>
              <button
                type="button"
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${isPosting ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => toast('Emoji picker coming soon! 😊')}
                disabled={isPosting}
              >
                <FaSmile className="text-yellow-500 w-5 h-5" />
              </button>
            </div>
          </div>
        </form>

        {/* Sticky Footer */}
        <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0 z-10">
          <button
            type="submit"
            onClick={handlePostSubmit}
            disabled={(!newPost.trim() && selectedImages.length === 0) || isPosting}
            className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
              (newPost.trim() || selectedImages.length > 0) && !isPosting
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isPosting && <FaSpinner className="animate-spin w-4 h-4" />}
            <span>{isPosting ? 'Posting...' : 'Post'}</span>
            {selectedImages.length > 0 && !isPosting
              ? ` (${selectedImages.length} image${selectedImages.length !== 1 ? "s" : ""})`
              : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;