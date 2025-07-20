import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAppContext } from '../../context/AppContext';

const CommenttableItem = ({ comment, fetchComments }) => {
  const { blog, createdAt, _id, isApproved } = comment;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const { axios } = useAppContext();
  const blogDate = new Date(createdAt);

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this comment?')) return;
    
    try {
      setIsApproving(true);
      const { data } = await axios.patch(`/api/blog/comments/${_id}/approve`);
      if (data.success) {
        toast.success('Comment approved successfully');
        fetchComments();
      } else {
        toast.error(data.message || 'Failed to approve comment');
      }
    } catch (error) {
      console.error('Error approving comment:', error);
      toast.error(error.response?.data?.message || 'Failed to approve comment');
    } finally {
      setIsApproving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      setIsDeleting(true);
      const { data } = await axios.delete(`/api/blog/comments/${_id}`);
      if (data.success) {
        toast.success('Comment deleted successfully');
        fetchComments();
      } else {
        toast.error(data.message || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <tr className='border-y border-gray-300'>
      <td className='px-6 py-4'>
        <b className='font-medium text-gray-600'>Blog</b>: {blog?.title || 'Untitled'}
        <br /><br />
        <b className='font-medium text-gray-600'>Comment</b>: {comment?.content}
        <br />
        <b className='font-medium text-gray-600'>By</b>: {comment?.name}
      </td>
      <td className='px-6 py-4 max-sm:hidden'>
        {blogDate.toLocaleDateString()}
      </td>
      <td className='px-6 py-4'>
        {isApproved ? (
          <span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full'>
            Approved
          </span>
        ) : (
          <span className='text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full'>
            Pending
          </span>
        )}
      </td>
      <td className='px-6 py-4'>
        <div className='inline-flex gap-4 items-center'>
          {!isApproved && (
            <button
              onClick={handleApprove}
              disabled={isApproving}
              className='p-1 text-green-600 hover:text-green-800 disabled:opacity-50'
              title='Approve comment'
            >
              {isApproving ? 'Approving...' : '✓'}
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className='p-1 text-red-600 hover:text-red-800 disabled:opacity-50'
            title='Delete comment'
          >
            {isDeleting ? 'Deleting...' : '✕'}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CommenttableItem;
