import React, { useEffect, useState } from 'react';
import BlogTableItem from '../../componenets/admin/BlogTableItem';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axios } = useAppContext();

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/blog/all');
      if (data.success) {
        setBlogs(data.blogs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    }
    setLoading(false);
  };

  const updateBlogStatus = (blogId, isPublished) => {
    setBlogs(prevBlogs => 
      prevBlogs.map(blog => 
        blog._id === blogId ? { ...blog, isPublished } : blog
      )
    );
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 md:p-10 bg-blue-50/50'>
      <h1>All Blogs</h1>

      <div className="mt-4 relative h-4/5 max-w-4xl overflow-x-auto shadow-md rounded-lg scrollbar-hide bg-white">
        {loading ? (
          <p className="p-4 text-gray-500">Loading blogs...</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="px-2 py-4 xl:px-6">#</th>
                <th className="px-2 py-4">Blog Title</th>
                <th className="px-2 py-4 max-sm:hidden">Date</th>
                <th className="px-2 py-4 max-sm:hidden">Status</th>
                <th className="px-2 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, index) => (
                <BlogTableItem
                  key={blog._id || index}
                  blog={blog}
                  fetchBlogs={fetchBlogs}
                  updateBlogStatus={updateBlogStatus}
                  index={index + 1}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ListBlog;
