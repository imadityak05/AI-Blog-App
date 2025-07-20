import React from 'react';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const BlogTableItem = ({ blog, fetchBlogs, updateBlogStatus, index, onTogglePublish }) => {
  const { title, createdAt } = blog;
  const blogDate = new Date(createdAt).toLocaleDateString();
  const { axios } = useAppContext();

  const deleteBlog = async () => {
    const confirm = window.confirm("Are you sure you want to delete this blog?");
    if (!confirm) return;

    try {
      console.log('Attempting to delete blog with ID:', blog._id);
      const { data } = await axios.post('/api/blog/delete', {
        id: blog._id
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Delete response:', data);

      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message || 'Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || error.message || 'Failed to delete blog');
    }
  };

  const togglePublish = async () => {
    try {
      console.log('Toggling publish for blog:', blog._id, 'Current status:', blog.isPublished);
      
      // Optimistically update the UI
      const previousStatus = blog.isPublished;
      updateBlogStatus(blog._id, !previousStatus);
      
      const { data } = await axios.post('/api/blog/toggle-publish', 
        { id: blog._id },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('Toggle publish response:', data);

      if (data.success) {
        toast.success(data.message);
        
        // Force a full page reload to ensure consistency
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        // Revert the optimistic update if the API call fails
        updateBlogStatus(blog._id, previousStatus);
        toast.error(data.message || 'Failed to update blog status');
      }
    } catch (error) {
      console.error('Error toggling publish status:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Revert the optimistic update on error
      updateBlogStatus(blog._id, blog.isPublished);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update blog status';
      toast.error(errorMessage);
    }
  };

  return (
    <tr className="border-y border-gray-300 text-sm">
      <th className="px-2 py-4 font-medium" scope="row">
        {index}
      </th>
      <td className="px-2 py-4">{title}</td>
      <td className="px-2 py-4 max-sm:hidden">{blogDate}</td>
      <td className="px-2 py-4 max-sm:hidden">
        <span
          className={`${
            blog.isPublished ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
          } px-3 py-1 rounded-full text-xs font-medium`}
        >
          {blog.isPublished ? 'Published' : 'Unpublished'}
        </span>
      </td>
      <td className="px-2 py-4 flex gap-2 items-center">
        <button
          onClick={togglePublish}
          className="border px-3 py-1 bg-primary text-white rounded-full hover:bg-primary/80 transition-all duration-300"
        >
          {blog.isPublished ? 'Unpublish' : 'Publish'}
        </button>
        <button

          onClick={deleteBlog}
          className="border px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default BlogTableItem;
