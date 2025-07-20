import React, { useEffect, useState, useCallback } from 'react';
import { assets } from '../../assets/assets';
import BlogTableItem from '../../componenets/admin/BlogTableItem';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const DashBoard = () => {
  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { axios } = useAppContext();
  const isMounted = React.useRef(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Fetching dashboard data from /api/admin/dashboard');
      const response = await axios.get('/api/admin/dashboard');
      console.log('Dashboard API Response:', response);
      
      // Only update state if component is still mounted
      if (!isMounted.current) return;
      
      if (response.data.success) {
        console.log('Dashboard data received:', response.data);
        // Map the response data to our component's state
        const formattedData = {
          blogs: response.data.dashboardData?.totalBlogs || 0,
          comments: response.data.dashboardData?.totalComments || 0,
          drafts: response.data.dashboardData?.draftBlogs || 0,
          recentBlogs: response.data.dashboardData?.recentBlogs || []
        };
        console.log('Mapped dashboard data:', formattedData);
        console.log('Formatted dashboard data:', formattedData);
        setDashboardData(formattedData);
      } else {
        // Only show error toast if we have a specific message
        if (data.message) {
          toast.error(data.message);
        }
      }
    } catch (error) {
      // Only log and show error if component is still mounted
      if (isMounted.current) {
        console.error('Error fetching dashboard data:', error);
        // Only show error toast for network errors or if we have a response message
        if (!error.response || error.response.status !== 401) {
          toast.error(error.response?.data?.message || 'Failed to load dashboard data');
        }
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [axios]);

  // Delete blog
  const deleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      const { data } = await axios.post('/api/blog/delete', { id });
      toast[data.success ? 'success' : 'error'](data.message);
      if (data.success) {
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error(error.response?.data?.message || 'Failed to delete blog');
    }
  };

  // Toggle publish status
  const togglePublish = async (id) => {
    try {
      const { data } = await axios.post('/api/blog/toggle-publish', { id });
      toast[data.success ? 'success' : 'error'](data.message);
      if (data.success) {
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error(error.response?.data?.message || 'Failed to update blog status');
    }
  };

  useEffect(() => {
    // Set mounted ref to true when component mounts
    isMounted.current = true;
    
    // Initial fetch
    fetchDashboardData();
    
    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted.current = false;
    };
  }, [fetchDashboardData]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-blue-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-10 bg-blue-50/50">
      {/* Top Stats Cards */}
      <div className="flex flex-wrap gap-6">
        {/* Blogs */}
        <div className="flex items-center gap-6 bg-white p-4 rounded-lg shadow-md min-w-58 cursor-pointer hover:bg-primary/10 transition-all duration-300">
          <img src={assets.dashboard_icon_1} alt="dashboard icon" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashboardData.blogs}</p> {/* ✅ updated */}
            <p className="font-light text-gray-500">Overview of your blog</p>
          </div>
        </div>

        {/* Comments */}
        <div className="flex items-center gap-6 bg-white p-4 rounded-lg shadow-md min-w-58 cursor-pointer hover:bg-primary/10 transition-all duration-300">
          <img src={assets.dashboard_icon_2} alt="dashboard icon" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashboardData.comments}</p>
            <p className="font-light text-gray-500">Comments</p>
          </div>
        </div>

        {/* Drafts */}
        <div className="flex items-center gap-6 bg-white p-4 rounded-lg shadow-md min-w-58 cursor-pointer hover:bg-primary/10 transition-all duration-300">
          <img src={assets.dashboard_icon_3} alt="dashboard icon" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashboardData.drafts}</p>
            <p className="font-light text-gray-500">Drafts</p>
          </div>
        </div>
      </div>

      {/* Recent Blogs */}
      <div>
        <div className="flex items-center gap-3 m-4 mt-6 text-gray-600">
          <img src={assets.dashboard_icon_4} alt="dashboard icon" />
          <p>Recent Blogs</p>
        </div>

        <div className="relative max-w-4xl overflow-x-auto shadow-md rounded-lg scrollbar-hide bg-white">
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
              {dashboardData.recentBlogs.map((blog, index) => (
                <BlogTableItem
                  key={blog._id}
                  blog={blog}
                  fetchBlogs={fetchDashboardData}
                  index={index + 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DashBoard
