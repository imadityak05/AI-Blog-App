import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  // Note: Using both 'catogry' and 'category' for backward compatibility
  const { title, description, category, catogry, image, _id, createdAt } = blog;
  const [isLoading, setIsLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle image loading and errors
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImgError(true);
    setIsLoading(false);
  };

  // Strip HTML tags from description for better preview
  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const truncatedDescription = stripHtml(description).substring(0, 100) + '...';

  return (
    <article 
      onClick={() => navigate(`/blog/${_id}`)}
      className="w-full rounded-lg overflow-hidden shadow hover:shadow-md hover:shadow-primary/20 transition-all duration-300 cursor-pointer bg-white flex flex-col h-full"
      aria-label={`Read more about ${title}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/blog/${_id}`)}
    >
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        <img 
          src={imgError ? '/placeholder-blog.jpg' : image} 
          alt={title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            objectPosition: 'center',
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 bg-primary/10 rounded-full text-xs text-primary font-medium">
            {category || catogry || 'Uncategorized'}
          </span>
          {createdAt && (
            <time 
              dateTime={new Date(createdAt).toISOString()}
              className="text-xs text-gray-500"
            >
              {formatDate(createdAt)}
            </time>
          )}
        </div>
        
        <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2" title={title}>
          {title}
        </h2>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {truncatedDescription}
        </p>
        
        <span className="mt-auto text-sm font-medium text-primary hover:text-primary-dark transition-colors">
          Read more →
        </span>
      </div>
    </article>
  );
};

export default React.memo(BlogCard);
