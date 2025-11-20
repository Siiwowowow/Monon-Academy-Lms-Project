'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, MessageCircle, Send, User as UserIcon, Image as ImageIcon, 
  X, Loader2, Trash2, Edit2, CornerDownRight, MoreHorizontal,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import useAuth from '@/hooks/useAuth';

export default function CommunityPage() {
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // --- States for new features ---
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [visibleCommentPosts, setVisibleCommentPosts] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [commentInputs, setCommentInputs] = useState({});

  // --- Image Modal States ---
  const [imageModal, setImageModal] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0,
    zoom: 1
  });

  const fileInputRef = useRef(null);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/community');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchPosts();
    }
  }, [authLoading]);

  // Multiple image handler
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    const validFiles = files.slice(0, 10 - selectedImages.length);
    
    validFiles.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`${file.name} is too large (Max 2MB)`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: reader.result
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId) => {
    setSelectedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const clearAllImages = () => {
    setSelectedImages([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Image Modal Functions ---
  const openImageModal = (images, startIndex = 0) => {
    setImageModal({
      isOpen: true,
      images: images,
      currentIndex: startIndex,
      zoom: 1
    });
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setImageModal({
      isOpen: false,
      images: [],
      currentIndex: 0,
      zoom: 1
    });
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    setImageModal(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length,
      zoom: 1 // Reset zoom when changing image
    }));
  };

  const prevImage = () => {
    setImageModal(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length,
      zoom: 1 // Reset zoom when changing image
    }));
  };

  const zoomIn = () => {
    setImageModal(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom + 0.5, 3)
    }));
  };

  const zoomOut = () => {
    setImageModal(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom - 0.5, 1)
    }));
  };

  // Keyboard navigation for image modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!imageModal.isOpen) return;
      
      switch(e.key) {
        case 'Escape':
          closeImageModal();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [imageModal.isOpen]);

  // Enhanced action handlers with immediate login prompt
  const requireLogin = (action = "do this") => {
    if (!user) {
      toast.error(`Please login to ${action}`);
      return false;
    }
    return true;
  };

  // --- Enhanced Delete Method ---
  const handleDeletePost = async (postId) => {
    if (!requireLogin("delete posts")) return;

    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/community?postId=${postId}&email=${user.email}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        setPosts(posts.filter(p => p._id !== postId));
        toast.success("Post deleted successfully");
      } else {
        toast.error(data.error || "Failed to delete post");
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Error deleting post");
    }
  };

  // --- Start editing post ---
  const startEditing = (post) => {
    if (!requireLogin("edit posts")) return;
    setEditingPostId(post._id);
    setEditContent(post.content);
  };

  // --- Enhanced Update Method ---
  const handleUpdatePost = async (postId) => {
    if (!requireLogin("edit posts")) return;

    if (!editContent.trim()) {
      toast.error("Content cannot be empty");
      return;
    }

    try {
      const res = await fetch('/api/community', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          action: 'update_post',
          payload: { 
            content: editContent, 
            user: { email: user.email } 
          }
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPosts(posts.map(p => p._id === postId ? { ...p, content: editContent } : p));
        setEditingPostId(null);
        toast.success("Post updated successfully");
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error("Update failed");
    }
  };

  // --- Enhanced Post Submit with Multiple Images ---
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!requireLogin("create posts")) return;
    
    if (!newPostContent.trim() && selectedImages.length === 0) {
      toast.error("Write something or add images!");
      return;
    }

    setSubmitting(true);
    try {
      // Convert multiple images to array
      const imagesArray = selectedImages.map(img => img.url);

      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPostContent,
          images: imagesArray,
          user: {
            name: user.displayName || user.name || 'User',
            email: user.email,
            image: user.photoURL || user.image,
            role: user.role || 'student'
          }
        }),
      });

      if (res.ok) {
        setNewPostContent('');
        setSelectedImages([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchPosts();
        toast.success("Posted successfully!");
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to post");
      }
    } catch (error) {
      console.error('Post error:', error);
      toast.error("Failed to post");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Enhanced Like Handler ---
  const handleLike = async (postId, currentLikes = []) => {
    if (!requireLogin("like posts")) return;

    const isLiked = currentLikes.includes(user.email);
    
    // Optimistic Update
    setPosts(prev => prev.map(p => p._id === postId ? {
      ...p, 
      likes: isLiked ? p.likes.filter(e => e !== user.email) : [...p.likes, user.email]
    } : p));

    try {
      const res = await fetch('/api/community', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          postId, 
          action: 'like', 
          payload: { email: user.email } 
        })
      });

      if (!res.ok) {
        // Revert optimistic update on error
        setPosts(prev => prev.map(p => p._id === postId ? {
          ...p, 
          likes: isLiked ? [...p.likes, user.email] : p.likes.filter(e => e !== user.email)
        } : p));
      }
    } catch (error) {
      console.error('Like error:', error);
      // Revert optimistic update on error
      setPosts(prev => prev.map(p => p._id === postId ? {
        ...p, 
        likes: isLiked ? [...p.likes, user.email] : p.likes.filter(e => e !== user.email)
      } : p));
    }
  };

  // --- Comment section toggle ---
  const toggleComments = (postId) => {
    if (!requireLogin("comment")) return;
    setVisibleCommentPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // --- Enhanced Comment Submit ---
  const handleCommentSubmit = async (postId) => {
    if (!requireLogin("comment")) return;

    const text = commentInputs[postId];
    if (!text?.trim()) return;

    try {
      const res = await fetch('/api/community', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId, 
          action: 'comment',
          payload: { 
            text, 
            user: { 
              name: user.displayName || user.name || 'User',
              email: user.email,
              image: user.photoURL || user.image,
              role: user.role || 'student'
            }
          }
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        setPosts(prev => prev.map(p => p._id === postId ? {
          ...p, 
          comments: [...(p.comments || []), data.comment]
        } : p));
        toast.success("Comment added successfully");
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to add comment");
      }
    } catch (error) {
      console.error('Comment error:', error);
      toast.error("Failed to add comment");
    }
  };

  // --- Enhanced Reply Submit ---
  const handleReplySubmit = async (postId, commentId) => {
    if (!requireLogin("reply")) return;

    if (!replyText.trim()) return;

    try {
      const res = await fetch('/api/community', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId, 
          action: 'reply_comment',
          payload: { 
            commentId, 
            text: replyText, 
            user: { 
              name: user.displayName || user.name || 'User',
              email: user.email,
              image: user.photoURL || user.image,
              role: user.role || 'student'
            }
          }
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReplyingTo(null);
        setReplyText('');
        setPosts(prev => prev.map(p => {
          if (p._id !== postId) return p;
          return {
            ...p,
            comments: p.comments.map(c => {
              if (c.id !== commentId && c.id.toString() !== commentId.toString()) return c;
              return { ...c, replies: [...(c.replies || []), data.reply] };
            })
          };
        }));
        toast.success("Reply added successfully");
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Reply failed");
      }
    } catch (error) {
      console.error('Reply error:', error);
      toast.error("Reply failed");
    }
  };

  // Image grid layout helper with click handlers
  const renderImageGrid = (images) => {
    if (!images || images.length === 0) return null;

    const imageArray = Array.isArray(images) ? images : [images];

    if (imageArray.length === 1) {
      return (
        <div className="mt-2 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex justify-center cursor-pointer">
          <img 
            src={imageArray[0]} 
            alt="Post" 
            className="max-h-[500px] w-auto object-contain"
            loading="lazy"
            onClick={() => openImageModal(imageArray, 0)}
          />
        </div>
      );
    }

    if (imageArray.length === 2) {
      return (
        <div className="mt-2 grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
          {imageArray.map((img, index) => (
            <img 
              key={index}
              src={img} 
              alt={`Post ${index + 1}`}
              className="w-full h-64 object-cover cursor-pointer"
              loading="lazy"
              onClick={() => openImageModal(imageArray, index)}
            />
          ))}
        </div>
      );
    }

    if (imageArray.length === 3) {
      return (
        <div className="mt-2 grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
          <img 
            src={imageArray[0]} 
            alt="Post 1"
            className="row-span-2 w-full h-full max-h-80 object-cover cursor-pointer"
            loading="lazy"
            onClick={() => openImageModal(imageArray, 0)}
          />
          <div className="grid grid-rows-2 gap-1">
            <img 
              src={imageArray[1]} 
              alt="Post 2"
              className="w-full h-40 object-cover cursor-pointer"
              loading="lazy"
              onClick={() => openImageModal(imageArray, 1)}
            />
            <img 
              src={imageArray[2]} 
              alt="Post 3"
              className="w-full h-40 object-cover cursor-pointer"
              loading="lazy"
              onClick={() => openImageModal(imageArray, 2)}
            />
          </div>
        </div>
      );
    }

    // 4 or more images
    return (
      <div className="mt-2 grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
        {imageArray.slice(0, 4).map((img, index) => (
          <div key={index} className="relative cursor-pointer">
            <img 
              src={img} 
              alt={`Post ${index + 1}`}
              className="w-full h-40 object-cover"
              loading="lazy"
              onClick={() => openImageModal(imageArray, index)}
            />
            {index === 3 && imageArray.length > 4 && (
              <div 
                className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center"
                onClick={() => openImageModal(imageArray, 3)}
              >
                <span className="text-white font-bold text-lg">+{imageArray.length - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen text-blue-500">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 min-h-screen font-sans">
      <Toaster position="bottom-center" />

      {/* --- Image Modal --- */}
      {imageModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors z-10"
          >
            <X size={24} />
          </button>

          {/* Navigation Arrows */}
          {imageModal.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 text-white p-3 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors z-10"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 text-white p-3 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors z-10"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          {/* Zoom Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black bg-opacity-50 rounded-lg p-2 z-10">
            <button
              onClick={zoomOut}
              className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              disabled={imageModal.zoom <= 1}
            >
              <ZoomOut size={20} />
            </button>
            <span className="text-white px-2 py-2 text-sm">
              {Math.round(imageModal.zoom * 100)}%
            </span>
            <button
              onClick={zoomIn}
              className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              disabled={imageModal.zoom >= 3}
            >
              <ZoomIn size={20} />
            </button>
          </div>

          {/* Image Counter */}
          {imageModal.images.length > 1 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 rounded-full px-3 py-1 text-sm z-10">
              {imageModal.currentIndex + 1} / {imageModal.images.length}
            </div>
          )}

          {/* Image Container */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={imageModal.images[imageModal.currentIndex]}
              alt={`Image ${imageModal.currentIndex + 1}`}
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              style={{ transform: `scale(${imageModal.zoom})` }}
            />
          </div>

          {/* Click outside to close */}
          <div 
            className="absolute inset-0 -z-10"
            onClick={closeImageModal}
          />
        </div>
      )}

      {/* --- Create Post --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-3">
           {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100" />
           ) : (
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                 <UserIcon size={20} />
              </div>
           )}
           <div className="flex-1">
             <form onSubmit={handlePostSubmit}>
               <textarea
                 className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 resize-none text-gray-800 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                 placeholder={user ? `What's on your mind, ${user.displayName?.split(" ")[0] || user.name?.split(" ")[0] || 'User'}?` : "Please login to create posts..."}
                 rows="2"
                 value={newPostContent}
                 onChange={(e) => setNewPostContent(e.target.value)}
                 disabled={!user}
               ></textarea>
               
               {/* Multiple Images Preview */}
               {selectedImages.length > 0 && (
                 <div className="mt-3">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-sm text-gray-600">{selectedImages.length} image(s) selected</span>
                     <button 
                       type="button" 
                       onClick={clearAllImages}
                       className="text-red-500 hover:text-red-700 text-sm font-medium"
                     >
                       Remove all
                     </button>
                   </div>
                   <div className="grid grid-cols-3 gap-2">
                     {selectedImages.map((image) => (
                       <div key={image.id} className="relative group">
                         <img 
                           src={image.url} 
                           alt="Preview" 
                           className="w-full h-24 object-cover rounded-lg border border-gray-200 cursor-pointer"
                           onClick={() => openImageModal(selectedImages.map(img => img.url), selectedImages.findIndex(img => img.id === image.id))}
                         />
                         <button 
                           type="button"
                           onClick={() => removeImage(image.id)}
                           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                           <X size={14} />
                         </button>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
               
               <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
                 <div>
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     accept="image/*" 
                     onChange={handleImageSelect} 
                     className="hidden" 
                     multiple
                     disabled={!user}
                   />
                   <button 
                     type="button" 
                     onClick={() => fileInputRef.current?.click()} 
                     disabled={!user} 
                     className="flex items-center gap-2 text-gray-600 hover:bg-green-50 px-3 py-1 rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                     title={!user ? "Please login to add photos" : "Add photos"}
                   >
                     <ImageIcon size={18} className="text-green-500" /> Photo
                   </button>
                 </div>
                 <button 
                   type="submit" 
                   disabled={!user || submitting || (!newPostContent && selectedImages.length === 0)} 
                   className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                 >
                   {submitting ? <Loader2 size={16} className="animate-spin"/> : <Send size={16} />} Post
                 </button>
               </div>
             </form>
           </div>
        </div>
      </div>

      {/* --- Feed --- */}
      <div className="space-y-5">
        {posts.map((post) => {
          const isLiked = user && post.likes?.includes(user.email);
          const isAuthor = user && post.author?.email === user.email;
          const showAllComments = expandedComments[post._id];
          const displayedComments = showAllComments ? post.comments : post.comments?.slice(0, 2);
          const images = post.images || (post.image ? [post.image] : []);

          return (
            <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              
              {/* Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {post.author?.photoURL ? (
                     <img src={post.author.photoURL} alt={post.author.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-100" />
                  ) : (
                     <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                       {post.author?.name?.[0] || <UserIcon size={18}/>}
                     </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      {post.author?.name}
                      {post.author?.role === 'teacher' && <span className="bg-blue-100 text-blue-700 text-[10px] px-2 rounded-full">Teacher</span>}
                    </h3>
                    <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                
                {/* Edit/Delete Actions (Only for Author) */}
                {isAuthor && (
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => startEditing(post)} 
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                      title="Edit post"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeletePost(post._id)} 
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                      title="Delete post"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Content (Normal or Edit Mode) */}
              <div className="px-4 pb-2">
                {editingPostId === post._id ? (
                  <div className="mb-3">
                    <textarea 
                      value={editContent} 
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                      rows="3"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => setEditingPostId(null)} className="text-xs px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                      <button onClick={() => handleUpdatePost(post._id)} className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-800 whitespace-pre-wrap mb-3 text-[15px]">{post.content}</p>
                    {/* Multiple Images Display */}
                    {renderImageGrid(images)}
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="px-4 py-2 flex justify-between text-sm text-gray-500 border-t border-gray-50">
                 <div className="flex items-center gap-1">
                    {post.likes?.length > 0 && (
                      <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                        <Heart size={10} fill="currentColor"/> {post.likes.length}
                      </span>
                    )}
                 </div>
                 <span>{post.comments?.length || 0} Comments</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 border-t border-gray-100">
                <button 
                  onClick={() => handleLike(post._id, post.likes || [])} 
                  className={`py-3 flex items-center justify-center gap-2 text-sm font-medium transition ${isLiked ? 'text-red-500 bg-red-50/20' : 'text-gray-600 hover:bg-gray-50'} ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!user}
                  title={!user ? "Please login to like" : ""}
                >
                  <Heart size={18} className={isLiked ? "fill-current" : ""} /> Like
                </button>
                <button 
                  onClick={() => toggleComments(post._id)} 
                  className={`py-3 flex items-center justify-center gap-2 text-sm font-medium transition ${visibleCommentPosts[post._id] ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'} ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!user}
                  title={!user ? "Please login to comment" : ""}
                >
                  <MessageCircle size={18} /> Comment
                </button>
              </div>

              {/* --- Comment Section (Toggled) --- */}
              {visibleCommentPosts[post._id] && (
                <div className="bg-gray-50/50 p-4 border-t border-gray-100">
                  
                  {/* Comment List */}
                  <div className="space-y-4 mb-4">
                    {post.comments?.length > 0 ? (
                      <>
                        {displayedComments.map((comment, idx) => (
                          <div key={idx} className="flex gap-2 items-start group">
                            {/* Commenter Avatar */}
                            {comment.author?.image ? (
                              <img src={comment.author.image} alt={comment.author.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-xs font-bold text-gray-500">
                                {comment.author?.name?.[0] || 'U'}
                              </div>
                            )}
                            
                            <div className="flex-1">
                              {/* Main Comment Bubble */}
                              <div className="bg-white border border-gray-200 rounded-2xl px-3 py-2 shadow-sm inline-block min-w-[200px]">
                                <div className='flex items-center justify-between mb-1'>
                                  <p className="font-semibold text-xs text-gray-900">{comment.author?.name}</p>
                                  <span className="text-[10px] text-gray-400">
                                    {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700">{comment.text}</p>
                              </div>
                              
                              {/* Reply Button */}
                              <div className="flex gap-3 mt-1 ml-2 text-xs text-gray-500 font-medium">
                                <button 
                                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} 
                                  className="hover:text-blue-600 transition"
                                  disabled={!user}
                                >
                                  Reply
                                </button>
                              </div>

                              {/* --- Replies List --- */}
                              {comment.replies?.length > 0 && (
                                <div className="mt-2 space-y-2 border-l-2 border-gray-200 pl-3 ml-2">
                                  {comment.replies.map((reply, rIdx) => (
                                    <div key={rIdx} className="flex gap-2 items-start">
                                      {reply.author?.image ? (
                                        <img src={reply.author.image} alt={reply.author.name} className="w-6 h-6 rounded-full" />
                                      ) : (
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                                          {reply.author?.name?.[0]}
                                        </div>
                                      )}
                                      <div className="bg-gray-100 rounded-xl px-3 py-1.5 w-full">
                                        <p className="font-bold text-[11px]">{reply.author?.name}</p>
                                        <p className="text-xs text-gray-700">{reply.text}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* --- Reply Input Box --- */}
                              {replyingTo === comment.id && (
                                <div className="mt-2 ml-2 flex gap-2 items-center animate-in fade-in slide-in-from-top-1">
                                  <CornerDownRight size={14} className="text-gray-400" />
                                  <input 
                                    autoFocus
                                    type="text"
                                    placeholder={`Reply to ${comment.author?.name}...`}
                                    className="flex-1 bg-white border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit(post._id, comment.id)}
                                    disabled={!user}
                                  />
                                  <button 
                                    onClick={() => handleReplySubmit(post._id, comment.id)} 
                                    className="text-blue-600 hover:bg-blue-50 p-1 rounded-full disabled:text-gray-300 disabled:cursor-not-allowed"
                                    disabled={!user || !replyText.trim()}
                                  >
                                    <Send size={14} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* "View More" Button */}
                        {post.comments?.length > 2 && !showAllComments && (
                          <button 
                            onClick={() => setExpandedComments(prev => ({ ...prev, [post._id]: true }))}
                            className="text-sm text-gray-500 hover:text-blue-600 font-medium w-full text-left pl-11"
                          >
                            View all {post.comments.length} comments
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="text-center text-gray-500 py-4">
                        No comments yet. Be the first to comment!
                      </div>
                    )}
                  </div>

                  {/* Main Comment Input */}
                  {user ? (
                    <div className="flex gap-2 items-center">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Your profile" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserIcon size={14}/>
                        </div>
                      )}
                      <div className="relative flex-1">
                        <input 
                          type="text" 
                          placeholder="Write a comment..." 
                          className="w-full py-2 pl-4 pr-10 border rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                          value={commentInputs[post._id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post._id)}
                          disabled={!user}
                        />
                        <button 
                          onClick={() => handleCommentSubmit(post._id)} 
                          disabled={!user || !commentInputs[post._id]?.trim()} 
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 text-blue-600 p-1.5 hover:bg-blue-50 rounded-full disabled:text-gray-300 disabled:cursor-not-allowed"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-2">
                      Please login to comment
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {posts.length === 0 && !loading && (
          <div className="text-center py-10 text-gray-500">
            <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No posts yet. Be the first to share something!</p>
          </div>
        )}
      </div>
    </div>
  );
}