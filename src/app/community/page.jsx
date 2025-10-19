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

  // Infinite scroll states
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

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
        userId: user?._id || "guest",
        user: {
          _id: user?._id,
          name: user?.name || user?.displayName,
          photoURL: user?.photoURL,
          email: user?.email
        },
        userName: user?.name || user?.displayName || "User",
        userAvatar: user?.photoURL || "/default-avatar.png",
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
    try {
      // Optimistic update
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { 
            ...p, 
            likes: (p.likes || 0) + 1,
            liked: true 
          } : p
        )
      );

      await axiosSecure.put(`/api/posts/${postId}`, { action: "like" });
      toast.success('Liked! 💙');
    } catch (error) {
      console.error("❌ Error liking post:", error);
      // Revert optimistic update
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { 
            ...p, 
            likes: (p.likes || 0) - 1,
            liked: false 
          } : p
        )
      );
      toast.error('Failed to like post');
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

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-100">
      <CommunityHeader onCreatePost={() => setIsCreatingPost(true)} />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-2xl mb-6">
            <CreatePostCard
              user={user}
              onPostClick={() => {
                setIsCreatingPost(true);
                toast('Share your thoughts with the community! 💭');
              }}
              onPhotoClick={handlePhotoClick}
              onVideoClick={() => toast.error('Video upload coming soon! 🎥')}
              onFeelingClick={() => toast('Feeling selector coming soon! 😊')}
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
                <p className="text-lg">No posts yet. Be the first to share! ✨</p>
                <button 
                  onClick={() => setIsCreatingPost(true)}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  Create First Post
                </button>
              </div>
            )}

            {posts.map((post) => (
              <PostCard key={post._id} post={post} onLike={handleLike} />
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
              toast('Post draft discarded');
            }
          } else {
            setIsCreatingPost(false);
            setSelectedImages([]);
          }
        }}
        user={user}
        newPost={newPost}
        setNewPost={setNewPost}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        handlePostSubmit={handlePostSubmit}
        isPosting={isPosting}
      />
    </div>
  );
}