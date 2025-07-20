import React, { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import CommenttableItem from '../../componenets/admin/CommenttableItem';
import { toast } from 'react-toastify';


const Comments = () => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const { axios } = useAppContext();

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all comments for admin review
      const { data } = await axios.get('/api/blog/admin/comments');
      if (data.success) {
        setComments(data.comments || []);
      } else {
        toast.error(data.message || 'Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Error loading comments');
    } finally {
      setLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const filteredComments = comments.filter((comment) => {
    if (filter === 'Approved') return comment.isApproved === true
    if (filter === 'Not Approved') return comment.isApproved === false
    return true // show all if no filter
  })

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 md:p-10 bg-blue-50/50'>
      <div className='flex justify-between items-center max-w-3xl'>
        <h1>Comments</h1>
        <div className='flex gap-4'>
          <button
            onClick={() => setFilter('Approved')}
            className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${
              filter === 'Approved' ? 'text-primary' : 'text-gray-600'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('Not Approved')}
            className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${
              filter === 'Not Approved' ? 'text-primary' : 'text-gray-600'
            }`}
          >
            Not Approved
          </button>
        </div>
      </div>
      <div className='mt-4 relative h-4/5 max-w-4xl overflow-x-auto shadow-md rounded-lg scrollbar-hide bg-white'>
        {loading ? (
          <div className='flex justify-center items-center h-32'>
            <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary'></div>
          </div>
        ) : filteredComments.length > 0 ? (
          <table>
            <thead className='text-xs text-left text-gray-600 uppercase'>
              <tr>
                <th scope='col' className='px-6 py-3 xl:px-6'>Blog Title & Comment</th>
                <th scope='col' className='px-6 py-3 max-sm:hidden'>Date</th>
                <th scope='col' className='px-6 py-3'>Status</th>
                <th scope='col' className='px-6 py-3'>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComments.map((comment) => (
                <CommenttableItem
                  key={comment._id}
                  comment={comment}
                  fetchComments={fetchComments}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className='flex justify-center items-center h-32 text-gray-500'>
            No comments found
          </div>
        )}
      </div>
    </div>
  )
}

export default Comments
