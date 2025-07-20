import React from 'react'
import {assets} from '../assets/assets'
import { useAppContext } from '../context/AppContext'
const Header = () => {

const {setInput ,input}=useAppContext();
const inputRef=React.useRef();

const onSubmitHandler=(e)=>{
    e.preventDefault();
    setInput(inputRef.current.value);
}

const onClear=()=>{
    setInput('');
    inputRef.current.value='';
}

  return (
    <div className='mx-8 sm:mx-16 xl:mx-24 relative'>
       
        <div className='text-center mt-20 mb-10'>
          <div className=' inline-flex items-center gap-4 justify-center px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm'>
            <p>New AI Features Integrated</p>
            <img src={assets.star_icon} alt="arrow" className='w-3'/>
          </div>
          <h1 className='text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700'>Your Own <span className='text-primary'>Blogging</span> 
            <br/>Platform 
          </h1>
          <p className='text-gray-600 text-sm sm:text-lg my-5 sm:my-8 max-w-2xl mx-auto'>
            This is your space to think out loud, to share what matters, and to write without filters. Whether it's one word or a thousand, your story starts right here.
          </p>

          <form onSubmit={onSubmitHandler}>
            <input ref={inputRef} type="text" placeholder='Search for blogs' required
            className='border border-gray-300 rounded-full px-5 py-2 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 cursor-pointer' 
             />
            <button className='bg-primary text-white px-5 py-2 rounded-full hover:bg-[#5044E5]/80 transition-all duration-300 cursor-pointer'>Search</button>
            
          </form>
          <div className='text-center mt-5'> {input && (
            <button onClick={onClear} className='bg-primary text-white px-5 py-2 rounded-full hover:bg-[#5044E5]/80 transition-all duration-300 cursor-pointer border border-primary/20'>Clear Search</button>
          )}
          </div>
        </div>
        <img src={assets.gradientBackground} alt="" className='absolute top-50 z-1 opacity-50'/>
       
    </div>
  )
}

export default Header
