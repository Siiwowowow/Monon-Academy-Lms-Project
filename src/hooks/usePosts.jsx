import { useState, useEffect } from 'react';
import useAxiosSecure from './useAxiosSecure';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const axiosSecure = useAxiosSecure();

  const fetchPosts = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosSecure.get(`/api/posts?page=${page}&limit=${limit}`);
      setPosts(response.data.posts);
      setPagination(response.data.pagination);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData) => {
    try {
      const response = await axiosSecure.post('/api/posts', postData);
      // Add new post to the beginning of the list
      setPosts(prev => [response.data.post, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
      throw err;
    }
  };

  const likePost = async (postId) => {
    try {
      const response = await axiosSecure.put(`/api/posts/${postId}`, {
        action: 'like'
      });
      
      // Update the post in local state
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      ));
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to like post');
      throw err;
    }
  };

  const addComment = async (postId, commentData) => {
    try {
      const response = await axiosSecure.put(`/api/posts/${postId}`, {
        action: 'comment',
        ...commentData
      });
      
      // Update the post in local state
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, comments: response.data.post.comments }
          : post
      ));
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add comment');
      throw err;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    pagination,
    fetchPosts,
    createPost,
    likePost,
    addComment,
    refetch: fetchPosts
  };
};