import React, { useState, useRef, useEffect } from 'react';
import { assets, blogCategories } from '../../assets/assets'; 
import Quill from 'quill';
import 'quill/dist/quill.snow.css';  
import { useAppContext } from '../../context/AppContext';
import {toast} from 'react-hot-toast'
import {parse} from 'marked';
const AddBlog = () => {

  const {axios}=useAppContext();
  const [isAdding,setIsAdding]=useState(false);
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  // State Management
  const [image, setImage] = useState(null);  
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');  
  const [category, setCategory] = useState('Startups');
  const [isPublished, setIsPublished] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  // --- Handlers ---

  const handleImageUpload = (e) => {
    // Set the selected file to state
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      
      // Validate required fields
      if (!title.trim() || !subtitle.trim() || !quillRef.current.getText().trim() || !category) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      if (!image) {
        toast.error('Please upload a thumbnail image');
        return;
      }

      setIsAdding(true);

      // Create blog object
      const blogData = {
        title,
        subTitle: subtitle,  
        description: quillRef.current.root.innerHTML,
        category,
        isPublished
      };

      // Create form data
      const formData = new FormData();
      formData.append('blog', JSON.stringify(blogData));
      formData.append('image', image);
      
      // Add headers for file upload
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };
      
      const { data } = await axios.post('/api/blog/add', formData, config);
      
      if (data.success) {
        toast.success('Blog added successfully!');
        // Reset form
        setTitle('');
        setSubtitle('');
        quillRef.current.root.innerHTML = '';
        setCategory('Startups');
        setImage(null);
        document.getElementById('thumbnail').value = '';  
      } else {
        toast.error(data.message || 'Failed to add blog');
      }
    }catch(error){
      toast.error(error.message);
    }finally{
      setIsAdding(false);
    }
     
    

    
  };
  
  const generateContent = async () => {
    if(!title) return toast.error('Please enter a title');
    try{
      setIsGenerating(true);
      const {data} = await axios.post('/api/blog/generate', {prompt:title});
      if(data.success){
        quillRef.current.root.innerHTML = parse(data.content);
         
      }else{
        toast.error(data.message || 'Failed to generate content');
      }
    }catch(error){
      toast.error(error.message);
    }finally{
      setIsGenerating(false);
    }
    
  };

  // --- Effects ---

  useEffect(() => {
    // Initialize Quill Editor
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
          ]
        }
      });

      // Add a listener to update state when the editor's content changes
      quillRef.current.on('text-change', () => {
        setDescription(quillRef.current.root.innerHTML);
      });
    }
  }, []); 

  return (
    <form
      onSubmit={onSubmitHandler}
      className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-y-auto'
    >
      <div className='bg-white p-5 w-full max-w-3xl my-10 mx-auto shadow rounded'>
        
        {/* -- Thumbnail Upload -- */}
        <p className="font-semibold">Upload Thumbnail</p>
        <label htmlFor="thumbnail" className='block cursor-pointer mt-2'>
          <img
            src={image ? URL.createObjectURL(image) : assets.upload_area}
            alt="upload icon"
            className="w-40 h-auto object-cover border rounded"
          />
          <input
            onChange={handleImageUpload}
            type="file"
            accept="image/*"  
            hidden
            required
            id="thumbnail"
          />
        </label>

        {/* -- Blog Title -- */}
        <p className='mt-5 font-semibold'>Blog Title</p>
        <input
          className='w-full max-w-lg p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition mt-2'
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          value={title}
          required
          id="title"
          placeholder='Enter Blog Title...'
        />

        {/* -- Subtitle -- */}
        <p className='mt-5 font-semibold'>Subtitle</p>
        <input
          className='w-full max-w-lg p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition mt-2'
          onChange={(e) => setSubtitle(e.target.value)}
          type="text"
          value={subtitle}
          required
          id="subtitle"
          placeholder='A catchy subtitle...'
        />

        {/* -- Blog Description (Quill Editor) -- */}
        <p className='mt-5 font-semibold'>Blog Description</p>
        <div className='max-w-3xl relative pt-2 border border-gray-300 rounded-md'>
          <div
            ref={editorRef}
            className='h-[300px] overflow-y-auto p-2' 
          ></div>
          {isGenerating && (
            <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center z-20'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-t-white'></div>
            </div>
          )}
          <button
            type='button'
            onClick={generateContent}
            disabled={isGenerating}
            className='absolute bottom-4 right-2 flex items-center gap-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer transition-all duration-200 z-10'
          >
            <img src={assets.arrow} alt="AI icon" className='w-4 h-4' />
            Generate With AI
          </button>
        </div>

        {/* -- Category -- */}
        <p className='mt-5 font-semibold'>Category</p>
        <select
          className='w-full max-w-lg p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition mt-2'
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          name='category'
          required
          id="category"
        >
          <option value="">Select Category</option>
          {blogCategories.map((item , index) => {
             return <option key={index} value={item}>
              {item}
            </option>
            })}
        </select> 

        {/* -- Publish Now -- */}
        <div className='flex gap-2 mt-5'>
          <p className='font-semibold'>Publish Now</p>
            <input type="checkbox" name="publish" id="publish" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className='scale-150 cursor-pointer'/>
        </div>
        
         {/* -- Submit Button -- */}
          <button disabled={isAdding} type="submit" className='w-full py-2 mt-4 bg-primary text-white rounded-lg hover:bg-primary/80 transition-all duration-300 cursor-pointer'>
            {isAdding ? "Adding..." : "Add Blog"}
          </button>

      </div>
    </form>
  );
};

export default AddBlog;