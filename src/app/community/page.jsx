"use client";

import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import CommunityHeader from "./CommunityHeader";
import CreatePostCard from "./CreatePostCard";
import CommunityTabs from "./CommunityTabs";
import PostCard from "./PostCard";
import CreatePostModal from "./CreatePostModal";

export default function CommunityPage() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isPosting, setIsPosting] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  // 👉 Fetch posts from API
  const fetchPosts = async (pageNumber = 1, showLoading = true) => {
    if (loading) return;
    setLoading(true);
    
    const loadingToast = showLoading ? toast.loading('Loading posts...') : null;
    
    try {
      const res = await axiosSecure.get(`/api/posts?page=${pageNumber}&limit=5`);
      const { posts: fetchedPosts, pagination } = res.data;

      // Add liked status for current user
      const postsWithLikeStatus = fetchedPosts.map(post => ({
        ...post,
        liked: post.likedBy?.includes(user?.email) || false
      }));

      if (pageNumber === 1) {
        setPosts(postsWithLikeStatus);
        if (showLoading) {
          toast.success('Posts loaded successfully!', { id: loadingToast });
        }
      } else {
        setPosts((prev) => [...prev, ...postsWithLikeStatus]);
        if (fetchedPosts.length > 0 && showLoading) {
          toast.success(`Loaded ${fetchedPosts.length} more posts`, { duration: 2000 });
        }
      }

      setHasNext(pagination.hasNext);
    } catch (error) {
      console.error("❌ Error fetching posts:", error);
      if (showLoading) {
        toast.error('Failed to load posts', { id: loadingToast });
      }
    } finally {
      setLoading(false);
    }
  };

  // 📡 Create or Update post
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPost.trim() && selectedImages.length === 0) {
      toast.error('Please add some content or image to post');
      return;
    }

    if (!user?.email) {
      toast.error('Please login to create a post');
      return;
    }

    setIsPosting(true);
    const postingToast = toast.loading(editingPost ? 'Updating post...' : 'Creating post...');

    try {
      const payload = {
        content: newPost.trim(),
        images: selectedImages,
        userId: user?._id || "guest",
        user: {
          _id: user?._id,
          name: user?.name || user?.displayName,
          photoURL: user?.photoURL,
          email: user?.email
        },
        userName: user?.name || user?.displayName || "User",
        userAvatar: user?.photoURL || "/default-avatar.png",
        userEmail: user?.email
      };

      if (editingPost) {
        // Update existing post
        const res = await axiosSecure.put(`/api/posts/${editingPost._id}`, payload);
        
        if (res.data.post) {
          setPosts(prevPosts => 
            prevPosts.map(post => 
              post._id === editingPost._id 
                ? { ...res.data.post, liked: post.liked } // Preserve like status
                : post
            )
          );
          
          setEditingPost(null);
          toast.success('Post updated successfully!', { id: postingToast });
        }
      } else {
        // Create new post
        const res = await axiosSecure.post("/api/posts", payload);
        
        if (res.data.post) {
          setPosts(prevPosts => [{ ...res.data.post, liked: false }, ...prevPosts]);
          toast.success('Post created successfully!', { id: postingToast });
        }
      }

      // Reset form
      resetForm();
      
    } catch (error) {
      console.error("❌ Error creating/updating post:", error);
      const errorMessage = error.response?.data?.error || 'Failed to process post';
      toast.error(errorMessage, { id: postingToast });
    } finally {
      setIsPosting(false);
    }
  };

  // ✏️ Edit post
  const handleEditPost = (post) => {
    if (!user?.email) {
      toast.error('Please login to edit posts');
      return;
    }

    if (post.userEmail !== user?.email) {
      toast.error('You can only edit your own posts');
      return;
    }

    setEditingPost(post);
    setNewPost(post.content || '');
    setSelectedImages(post.images || []);
    setIsCreatingPost(true);
  };

  // 🗑️ Delete post
  const handleDeletePost = async (postId, userEmail) => {
    if (!user?.email) {
      toast.error('Please login to delete posts');
      return;
    }

    if (userEmail !== user?.email) {
      toast.error('You can only delete your own posts');
      return;
    }

    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    const deleteToast = toast.loading('Deleting post...');

    try {
      const response = await axiosSecure.delete(`/api/posts/${postId}?userEmail=${encodeURIComponent(userEmail)}`);
      
      if (response.data.message === "Post deleted successfully") {
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
        toast.success('Post deleted successfully!', { id: deleteToast });
      }
    } catch (error) {
      console.error("❌ Error deleting post:", error);
      const errorMessage = error.response?.data?.error || 'Failed to delete post';
      toast.error(errorMessage, { id: deleteToast });
    }
  };

  // 👍 Like post - SIMPLIFIED VERSION
  const handleLike = async (postId) => {
    if (!user?.email) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      // Optimistic update
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? {
                ...post,
                likes: (post.likes || 0) + 1,
                liked: true
              }
            : post
        )
      );

      // API call
      await axiosSecure.put(`/api/posts/${postId}`, {
        action: "like",
        userEmail: user.email
      });

      toast.success('Liked! 💙');

    } catch (error) {
      console.error("❌ Error liking post:", error);
      
      // Revert optimistic update
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? {
                ...post,
                likes: Math.max(0, (post.likes || 0) - 1),
                liked: false
              }
            : post
        )
      );

      const errorMessage = error.response?.data?.error || 'Failed to like post';
      toast.error(errorMessage);
    }
  };

  // 👎 Unlike post - SIMPLIFIED VERSION
  const handleUnlike = async (postId) => {
    if (!user?.email) {
      toast.error('Please login to unlike posts');
      return;
    }

    try {
      // Optimistic update
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? {
                ...post,
                likes: Math.max(0, (post.likes || 0) - 1),
                liked: false
              }
            : post
        )
      );

      // API call
      await axiosSecure.put(`/api/posts/${postId}`, {
        action: "unlike",
        userEmail: user.email
      });

      toast.success('Unliked');

    } catch (error) {
      console.error("❌ Error unliking post:", error);
      
      // Revert optimistic update
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? {
                ...post,
                likes: (post.likes || 0) + 1,
                liked: true
              }
            : post
        )
      );

      const errorMessage = error.response?.data?.error || 'Failed to unlike post';
      toast.error(errorMessage);
    }
  };

  // 📷 Handle photo upload
  const handlePhotoClick = (file) => {
    if (!user?.email) {
      toast.error('Please login to add photos');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImages([e.target.result]);
      setIsCreatingPost(true);
      toast.success('Photo added!');
    };
    reader.onerror = () => {
      toast.error('Failed to load image');
    };
    reader.readAsDataURL(file);
  };

  // Reset form function
  const resetForm = () => {
    setNewPost("");
    setSelectedImages([]);
    setEditingPost(null);
    setIsCreatingPost(false);
  };

  // Reset form when closing modal
  const handleCloseModal = () => {
    if (newPost.trim() || selectedImages.length > 0) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        resetForm();
      }
    } else {
      resetForm();
    }
  };

  // 🚀 Load more on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
          document.documentElement.scrollHeight &&
        hasNext &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNext, loading]);

  // Fetch posts when page changes
  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-2xl mb-6">
            <CreatePostCard
              user={user}
              onPostClick={() => {
                if (!user?.email) {
                  toast.error('Please login to create a post');
                  return;
                }
                setIsCreatingPost(true);
              }}
              onPhotoClick={handlePhotoClick}
              onVideoClick={() => toast.error('Video upload coming soon! 🎥')}
              onFeelingClick={() => toast('Feeling selector coming soon! 😊')}
            />
          </div>

          <div className="w-full max-w-2xl mb-6">
            <CommunityTabs 
              activeTab={activeTab} 
              onTabChange={(tab) => {
                setActiveTab(tab);
                setPage(1);
                fetchPosts(1);
                toast.success(`Showing ${tab} posts`);
              }} 
            />
          </div>

          <div className="w-full max-w-2xl space-y-6">
            {posts.length === 0 && !loading && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg">No posts yet. Be the first to share! ✨</p>
                <button 
                  onClick={() => {
                    if (!user?.email) {
                      toast.error('Please login to create a post');
                      return;
                    }
                    setIsCreatingPost(true);
                  }}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  Create First Post
                </button>
              </div>
            )}

            {posts.map((post) => (
              <PostCard 
                key={post._id} 
                post={post} 
                currentUserEmail={user?.email}
                onLike={post.liked ? () => handleUnlike(post._id) : () => handleLike(post._id)}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            ))}

            {loading && (
              <div className="text-center text-gray-500 py-4">
                <div className="inline-flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Loading posts...</span>
                </div>
              </div>
            )}

            {!hasNext && posts.length > 0 && (
              <div className="text-center text-gray-400 py-4">
                🎉 You've reached the end of the feed.
              </div>
            )}
          </div>
        </div>
      </div>

      <CreatePostModal
        isOpen={isCreatingPost}
        onClose={handleCloseModal}
        user={user}
        newPost={newPost}
        setNewPost={setNewPost}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        handlePostSubmit={handlePostSubmit}
        isPosting={isPosting}
        isEditing={!!editingPost}
      />
    </div>
  );
}