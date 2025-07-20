import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  // ✅ Set axios base URL from .env
  const baseURL = import.meta.env.VITE_BASE_URL;
  
  // Create axios instance with base URL
  const api = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor to include token in every request
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Initialize token from localStorage if available
  const [token, setToken] = useState(() => {
    // This will only run once when the component mounts
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Set the Authorization header for any initial API calls
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      return storedToken;
    }
    return null;
  });
  
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [input, setInput] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Update axios headers and localStorage when token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
    
    // Mark as initialized after first render
    setIsInitialized(true);
  }, [token]);

  // ✅ Fetch all blogs
  const fetchBlogs = async () => {
    try {
      // For non-authenticated users, only fetch published blogs
      const endpoint = token ? '/api/blog/all' : '/api/blog/published';
      console.log(`Fetching blogs from ${endpoint} (${token ? 'authenticated' : 'public'})`);
      
      const { data } = await api.get(endpoint);
      console.log('Received blog data:', {
        hasSuccess: data.success,
        blogsCount: data.blogs?.length || data.length || 0,
        isArray: Array.isArray(data) || Array.isArray(data?.blogs)
      });
      
      let blogsToSet = [];
      
      // Handle both response formats for backward compatibility
      if (data.success && Array.isArray(data.blogs)) {
        blogsToSet = data.blogs;
      } else if (Array.isArray(data)) {
        // Handle case where the endpoint returns the array directly
        blogsToSet = data;
      } else {
        console.error('Unexpected blogs data format:', data);
        toast.error(data?.message || "Failed to fetch blogs: Invalid format");
        return;
      }
      
      // Log the published status of all blogs for debugging
      console.log('Blogs to display:', blogsToSet.map(b => ({
        id: b._id,
        title: b.title,
        isPublished: b.isPublished
      })));
      
      setBlogs(blogsToSet);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error(error?.response?.data?.message || error.message || "Failed to fetch blogs");
    }
  };

  // ✅ Fetch all unique categories
  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/api/blog/categories');
      if (data.success && Array.isArray(data.categories)) {
        // Add 'All' category at the beginning
        setCategories(['All', ...data.categories]);
      } else {
        console.error('Unexpected categories format:', data);
        toast.error('Failed to load categories: Invalid format');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  // ✅ Fetch initial data when token changes
  useEffect(() => {
    if (isInitialized) {
      fetchBlogs();
      fetchCategories();
    }
  }, [token, isInitialized]);

  return (
    <AppContext.Provider value={{
      token,
      setToken,
      blogs,
      setBlogs,
      categories,
      fetchCategories,
      input,
      setInput,
      fetchBlogs,
      navigate,
      axios: api, // Pass the configured axios instance
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
