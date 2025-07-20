import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import BlogCard from './BlogCard'
import { useAppContext } from '../context/AppContext'
import { blog_data } from '../assets/assets'

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const { blogs, input, categories, token } = useAppContext();
  
  // Show blog_data when not logged in, otherwise show published blogs
  const visibleBlogs = React.useMemo(() => {
    if (!token) {
      console.log('User not logged in, showing blog_data from assets');
      return blog_data;
    }
    console.log('User logged in, filtering published blogs');
    const publishedBlogs = blogs.filter(blog => blog.isPublished === true);
    console.log(`Found ${publishedBlogs.length} published blogs out of ${blogs.length} total`);
    return publishedBlogs;
  }, [blogs, token]);

  // Debug: Log categories when they change
  useEffect(() => {
    console.log('Available categories from context:', categories);
    console.log('Current blogs and their categories:', blogs.map(blog => ({
      title: blog.title,
      category: blog.category || blog.catogry || 'No category'
    })));
  }, [categories, blogs]);

  const filteredBlogs = () => {
    console.log('=== FILTER DEBUG ===');
    console.log('All visible blogs:', visibleBlogs);
    console.log('Current category:', menu);
    console.log('Available categories in data:', [...new Set(visibleBlogs.flatMap(b => [b.category, b.catogry].filter(Boolean)))]);
    
    let result = [...visibleBlogs];
    
    // Apply category filter
    if (menu !== 'All') {
      console.log(`Filtering for category: "${menu}"`);
      const normalizedMenu = menu.trim().toLowerCase();
      result = result.filter(blog => {
        // Handle both 'category' and 'catogry' typos in the data
        const category = blog.category || blog.catogry || '';
        const normalizedCategory = category.toString().trim().toLowerCase();
        const matches = normalizedCategory === normalizedMenu;
        console.log(`Blog "${blog.title}" - Category: "${category}" (normalized: "${normalizedCategory}") - Looking for: "${normalizedMenu}" - Match: ${matches}`);
        return matches;
      });
      console.log(`Found ${result.length} matching blogs`);
    }
    
    // Apply search filter if there's input
    if (input) {
      const searchTerm = input.trim().toLowerCase();
      result = result.filter(blog => {
        // Handle both 'category' and 'catogry' typos in the data
        const category = blog.category || blog.catogry || '';
        const normalizedCategory = category.toString().toLowerCase();
        return (
          blog.title.toLowerCase().includes(searchTerm) ||
          normalizedCategory.includes(searchTerm) ||
          (blog.description && blog.description.toLowerCase().includes(searchTerm))
        );
      });
    }
    
    return result;
  }
 

  return (
    <div>
      <div className='flex flex-wrap justify-center gap-2 sm:gap-4 my-6 px-4'>
        {categories.map((category) => (
          <div key={category} className='relative'>
            {menu === category && (
              <motion.div 
                layoutId='underline'
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className='absolute inset-0 h-9 bg-primary rounded-full -z-10 pointer-events-none'
              />
            )}
            <button
              onClick={() => setMenu(category)}
              className={`relative z-10 cursor-pointer text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-200 ${
                menu === category 
                  ? 'text-white font-medium' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          </div>
        ))}
      </div>


      <div className='grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40'>
        {/* blogs  Cards*/}
         {filteredBlogs().map((blog)=>(
          <BlogCard blog={blog} key={blog._id}/>
         ))}

      </div>
    </div>  
  )
}

export default BlogList
