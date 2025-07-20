import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import NavBar from '../componenets/NavBar';
import Footer from '../componenets/Footer';
import Moment from 'moment';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';


const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios, user } = useAppContext();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');

  const fetchBlogData = useCallback(async () => {
    if (!id) {
      setError('No blog ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching blog with ID:', id);
      const response = await axios.get(`/api/blog/${id}`);
      
      if (response.data.success) {
        console.log('Blog data received:', response.data);
        setData(response.data.blog);
      } else {
        console.error('Failed to fetch blog:', response.data.message);
        setError(response.data.message || 'Failed to load blog');
        toast.error(response.data.message || 'Failed to load blog');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      setError(errorMessage);
      toast.error('Error loading blog: ' + errorMessage);
      
      if (error.response?.status === 404) {
        setTimeout(() => navigate('/'), 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate, axios]);

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/blog/comments/${id}`);
      if (data.success) {
        setComments(data.comments || []);
      } else {
        console.error('Failed to fetch comments:', data.message);
        toast.error('Failed to load comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Error loading comments: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  }, [id, axios]);

  const addComment = async (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Create a temporary comment with a temporary ID
    const tempId = `temp-${Date.now()}`;
    const newComment = {
      _id: tempId,
      name,
      content,
      isApproved: user?.role === 'admin', // Auto-approve for admins
      createdAt: new Date().toISOString(),
      blog: id
    };
    
    // Optimistically update the UI
    setComments(prev => [newComment, ...prev]);
    
    try {
      const { data } = await axios.post('/api/blog/add-comment', { 
        blog: id,
        name, 
        content 
      });
      
      if (data.success) {
        // Show a custom success message for pending approval
        toast.success('Comment submitted successfully! Your comment is pending approval and will be visible once approved by the author.');
        setName('');
        setContent('');
        
        // Only refetch if user is admin, otherwise keep the optimistic update
        if (user?.role === 'admin') {
          await fetchComments();
        }
      } else {
        // Remove the optimistically added comment if the request fails
        setComments(prev => prev.filter(comment => comment._id !== tempId));
        toast.error(data.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      // Remove the optimistically added comment if there's an error
      setComments(prev => prev.filter(comment => comment._id !== tempId));
      toast.error(error.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleApproveComment = async (commentId) => {
    try {
      const { data } = await axios.patch(`/api/blog/comments/${commentId}/approve`);
      if (data.success) {
        // Update the comment in the local state
        setComments(prev => 
          prev.map(comment => 
            comment._id === commentId 
              ? { ...comment, isApproved: true } 
              : comment
          )
        );
        toast.success('Comment approved successfully');
      } else {
        toast.error(data.message || 'Failed to approve comment');
      }
    } catch (error) {
      console.error('Error approving comment:', error);
      toast.error(error.response?.data?.message || 'Failed to approve comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const { data } = await axios.delete(`/api/blog/comments/${commentId}`);
      if (data.success) {
        // Remove the comment from the local state
        setComments(prev => prev.filter(comment => comment._id !== commentId));
        toast.success('Comment deleted successfully');
      } else {
        toast.error(data.message || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchBlogData();
      await fetchComments();
    };
    fetchData();
  }, [id, fetchBlogData, fetchComments]);

  if (loading) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4'></div>
        <p className='text-gray-600'>Loading blog post...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4'>
        <div className='max-w-md w-full text-center'>
          <h2 className='text-2xl font-bold text-red-600 mb-3'>Something went wrong</h2>
          <p className='text-gray-600 mb-6'>{error || 'The blog post could not be loaded.'}</p>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <button 
              onClick={() => window.location.reload()} 
              className='px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors'
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate('/')} 
              className='px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative min-h-screen'>
      <img src={assets.gradientBackground} alt="" className='absolute inset-0 w-full h-full object-cover opacity-50 -z-10'/>
      <NavBar/>
      
      {/* Blog Header */}
      <div className='container mx-auto px-4 py-20 max-w-6xl'>
        <div className='text-center mb-12'>
          <p className='text-primary font-medium mb-2'>
            Published on {Moment(data.createdAt).format("MMMM D, YYYY")}
          </p>
          <h1 className='text-3xl md:text-5xl font-bold mb-4'>{data.title}</h1>
          <h2 className='text-xl text-gray-600 mb-6'>{data.subTitle}</h2>
          <div className='inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-1 rounded-full border border-primary/20'>
            <span>By</span>
            <span className='font-medium'>{data.author || 'Admin'}</span>
          </div>
        </div>

        {/* Blog Content */}
        <div className='bg-white rounded-xl shadow-lg overflow-hidden mb-12'>
          {data.image && (
            <img 
              src={data.image} 
              alt={data.title} 
              className='w-full h-64 md:h-96 object-cover'
            />
          )}
          <div className='p-6 md:p-8'>
            <div 
              className='prose max-w-none' 
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          </div>
        </div>

        {/* Comments Section */}
        <div className='max-w-3xl mx-auto'>
          <div className='border-b border-gray-200 pb-4 mb-8'>
            <h3 className='text-2xl font-bold text-gray-800'>
              Comments ({comments.length})
            </h3>
          </div>
          
          {/* Comments List */}
          <div className='space-y-6 mb-12'>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className='bg-white p-6 rounded-lg shadow'>
                  <div className='flex items-start gap-4'>
                    <div className='flex-shrink-0'>
                      <div className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center'>
                        <span className='text-gray-500 text-lg'>
                          {comment.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between mb-1'>
                        <div className='flex items-center gap-2'>
                          <h4 className='font-medium text-gray-900'>{comment.name}</h4>
                          {!comment.isApproved && (
                            <span className='text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full'>
                              Pending Approval
                            </span>
                          )}
                        </div>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm text-gray-500'>
                            {Moment(comment.createdAt).fromNow()}
                          </span>
                          {user?.role === 'admin' && (
                            <div className='flex gap-1'>
                              {!comment.isApproved && (
                                <button 
                                  onClick={() => handleApproveComment(comment._id)}
                                  className='text-green-600 hover:text-green-800 transition-colors'
                                  title='Approve comment'
                                >
                                  <img src={assets.tick_icon} alt="Approve" className="w-5 h-5 cursor-pointer hover:opacity-70" />
                                </button>
                              )}
                              <button 
                                onClick={() => handleDeleteComment(comment._id)}
                                className='text-red-600 hover:text-red-800 transition-colors'
                                title='Delete comment'
                              >
                                <img src={assets.bin_icon} alt="Delete" className="w-5 h-5 cursor-pointer hover:opacity-70" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className='text-gray-700'>{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-center text-gray-500 py-8'>No comments yet. Be the first to comment!</p>
            )}
          </div>

          {/* Add Comment Form */}
          <div className='bg-white rounded-xl shadow-lg p-6 mb-12'>
            <h3 className='text-xl font-semibold mb-6'>Leave a Comment</h3>
            <form onSubmit={addComment} className='space-y-4'>
              <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                  Name
                </label>
                <input
                  id='name'
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition'
                  placeholder='Your name'
                />
              </div>
              <div>
                <label htmlFor='comment' className='block text-sm font-medium text-gray-700 mb-1'>
                  Comment
                </label>
                <textarea
                  id='comment'
                  rows='4'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition resize-none'
                  placeholder='Write your comment here...'
                />
              </div>
              <div className='flex justify-end'>
                <button
                  type='submit'
                  className='px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors'
                >
                  Post Comment
                </button>
              </div>
            </form>
          </div>

          {/* Share Buttons */}
          <div className='mb-12'>
            <p className='font-semibold text-gray-700 mb-4'>Share this article</p>
            <div className='flex gap-4'>
              <button className='w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors'>
                <img src={assets.facebook_icon} alt="Share on Facebook" className='w-6 h-6' />
              </button>
              <button className='w-12 h-12 flex items-center justify-center bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors'>
                <img src={assets.twitter_icon} alt="Share on Twitter" className='w-6 h-6' />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
