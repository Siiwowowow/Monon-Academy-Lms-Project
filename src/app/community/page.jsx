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
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isPosting, setIsPosting] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Infinite scroll states
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // 👉 Fetch posts from API
  const fetchPosts = async (pageNumber = 1) => {
    if (loading) return;
    setLoading(true);
    
    const loadingToast = pageNumber === 1 ? toast.loading('Loading posts...') : null;
    
    try {
      const res = await axiosSecure.get(`/api/posts?page=${pageNumber}&limit=5`);
      const { posts: fetchedPosts, pagination } = res.data;

      if (pageNumber === 1) {
        setPosts(fetchedPosts);
        toast.success('Posts loaded successfully!', { id: loadingToast });
      } else {
        setPosts((prev) => [...prev, ...fetchedPosts]);
        if (fetchedPosts.length > 0) {
          toast.success(`Loaded ${fetchedPosts.length} more posts`, { duration: 2000 });
        }
      }

      setHasNext(pagination.hasNext);
    } catch (error) {
      console.error("❌ Error fetching posts:", error);
      toast.error('Failed to load posts', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  // 📡 Create new post
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    
    // Authentication check
    if (!isAuthenticated) {
      toast.error('Please sign in to create a post');
      return;
    }

    if (!newPost.trim() && selectedImages.length === 0) {
      toast.error('Please add some content or image to post');
      return;
    }

    setIsPosting(true);
    const postingToast = toast.loading('Creating post...');

    try {
      const payload = {
        content: newPost,
        images: selectedImages,
        userId: user._id,
        user: {
          _id: user._id,
          name: user.name || user.displayName,
          photoURL: user.photoURL,
          email: user.email
        },
        userName: user.name || user.displayName || "User",
        userAvatar: user.photoURL || "/default-avatar.png",
        createdAt: new Date().toISOString()
      };

      const res = await axiosSecure.post("/api/posts", payload);
      setPosts([res.data.post, ...posts]);
      setNewPost("");
      setSelectedImages([]);
      setIsCreatingPost(false);
      
      toast.success('Post created successfully!', { id: postingToast });
    } catch (error) {
      console.error("❌ Error creating post:", error);
      toast.error('Failed to create post', { id: postingToast });
    } finally {
      setIsPosting(false);
    }
  };

  // 📷 Handle photo upload from CreatePostCard
  const handlePhotoClick = (file) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to create a post');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImages([e.target.result]);
      toast.success('Photo added! Click "Create Post" to continue.');
    };
    reader.onerror = () => {
      toast.error('Failed to load image');
    };
    reader.readAsDataURL(file);
    setIsCreatingPost(true);
  };

  // 👍 Like post
  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to like posts');
      return;
    }

    try {
      // Optimistic update
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { 
            ...p, 
            likes: (p.likes || 0) + 1,
            likedBy: [...(p.likedBy || []), user._id]
          } : p
        )
      );

      await axiosSecure.put(`/api/posts/${postId}/like`, { userId: user._id });
      toast.success('Liked! 💙');
    } catch (error) {
      console.error("❌ Error liking post:", error);
      // Revert optimistic update
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { 
            ...p, 
            likes: (p.likes || 0) - 1,
            likedBy: (p.likedBy || []).filter(id => id !== user._id)
          } : p
        )
      );
      toast.error('Failed to like post');
    }
  };

  // 🗑️ Delete post
  const handleDeletePost = async (postId) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to delete posts');
      return;
    }

    const postToDelete = posts.find(p => p._id === postId);
    
    // Check if user owns the post
    if (postToDelete.userId !== user._id && postToDelete.user._id !== user._id) {
      toast.error('You can only delete your own posts');
      return;
    }

    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await axiosSecure.delete(`/api/posts/${postId}`);
      setPosts(posts.filter(p => p._id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error("❌ Error deleting post:", error);
      toast.error('Failed to delete post');
    }
  };

  // ✏️ Update post
  const handleUpdatePost = async (postId, updatedContent, updatedImages) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to update posts');
      return;
    }

    const postToUpdate = posts.find(p => p._id === postId);
    
    // Check if user owns the post
    if (postToUpdate.userId !== user._id && postToUpdate.user._id !== user._id) {
      toast.error('You can only edit your own posts');
      return;
    }

    try {
      const res = await axiosSecure.put(`/api/posts/${postId}`, {
        content: updatedContent,
        images: updatedImages
      });

      setPosts(posts.map(p => 
        p._id === postId ? { ...p, ...res.data.post } : p
      ));
      
      setEditingPost(null);
      toast.success('Post updated successfully');
    } catch (error) {
      console.error("❌ Error updating post:", error);
      toast.error('Failed to update post');
    }
  };

  // ➕ Start creating post (with auth check)
  const handleCreatePostClick = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to create a post');
      return;
    }
    setIsCreatingPost(true);
  };

  // ✏️ Start editing post
  const handleEditPost = (post) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to edit posts');
      return;
    }

    // Check if user owns the post
    if (post.userId !== user._id && post.user._id !== user._id) {
      toast.error('You can only edit your own posts');
      return;
    }

    setEditingPost(post);
    setNewPost(post.content);
    setSelectedImages(post.images || []);
    setIsCreatingPost(true);
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

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  // Reset form when closing modal
  useEffect(() => {
    if (!isCreatingPost) {
      setNewPost("");
      setSelectedImages([]);
      setEditingPost(null);
    }
  }, [isCreatingPost]);

  return (
    <div className="min-h-screen bg-gray-100">
      <CommunityHeader onCreatePost={handleCreatePostClick} />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center">
          {/* Show sign in prompt for guests */}
          {!isAuthenticated && !authLoading && (
            <div className="w-full max-w-2xl mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-yellow-800">Sign in required</h3>
                  <p className="text-yellow-700 text-sm">Please sign in to create posts and interact with the community</p>
                </div>
                <button 
                  onClick={() => toast.error('Please implement sign in functionality')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

          <div className="w-full max-w-2xl mb-6">
            <CreatePostCard
              user={user}
              onPostClick={handleCreatePostClick}
              onPhotoClick={handlePhotoClick}
              onVideoClick={() => {
                if (!isAuthenticated) {
                  toast.error('Please sign in to create posts');
                  return;
                }
                toast.error('Video upload coming soon! 🎥');
              }}
              onFeelingClick={() => {
                if (!isAuthenticated) {
                  toast.error('Please sign in to create posts');
                  return;
                }
                toast('Feeling selector coming soon! 😊');
              }}
            />
          </div>

          <div className="w-full max-w-2xl mb-6">
            <CommunityTabs activeTab={activeTab} onTabChange={(tab) => {
              setActiveTab(tab);
              toast.success(`Showing ${tab} posts`);
            }} />
          </div>

          <div className="w-full max-w-2xl space-y-6">
            {posts.length === 0 && !loading && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg">No posts yet. {isAuthenticated ? 'Be the first to share! ✨' : 'Sign in to be the first to share! ✨'}</p>
                {isAuthenticated && (
                  <button 
                    onClick={handleCreatePostClick}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Create First Post
                  </button>
                )}
              </div>
            )}

            {posts.map((post) => (
              <PostCard 
                key={post._id} 
                post={post} 
                onLike={handleLike}
                onDelete={handleDeletePost}
                onEdit={handleEditPost}
                currentUser={user}
              />
            ))}

            {loading && (
              <div className="text-center text-gray-500 py-4">
                <div className="inline-flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Loading more posts...</span>
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
        onClose={() => {
          if (newPost.trim() || selectedImages.length > 0) {
            if (confirm('You have unsaved changes. Are you sure you want to close?')) {
              setIsCreatingPost(false);
              setSelectedImages([]);
              setEditingPost(null);
              toast('Post draft discarded');
            }
          } else {
            setIsCreatingPost(false);
            setSelectedImages([]);
            setEditingPost(null);
          }
        }}
        user={user}
        newPost={newPost}
        setNewPost={setNewPost}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        handlePostSubmit={handlePostSubmit}
        isPosting={isPosting}
        isEditing={!!editingPost}
        editingPost={editingPost}
        onUpdatePost={handleUpdatePost}
      />
    </div>
  );
}