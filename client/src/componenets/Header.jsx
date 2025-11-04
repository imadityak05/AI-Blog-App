import React from 'react'
import {assets} from '../assets/assets'
import { useAppContext } from '../context/AppContext'
const Header = () => {

const { setInput, input } = useAppContext();
const [searchValue, setSearchValue] = React.useState(input || '');

// Update local state when input changes from outside (e.g., when cleared from another component)
React.useEffect(() => {
    if (input === '') {
        setSearchValue('');
    }
}, [input]);

const onSubmitHandler = (e) => {
    e.preventDefault();
    setInput(searchValue.trim());
}

const onClear = () => {
    setSearchValue('');
    setInput('');
}

  return (
    <div className='mx-8 sm:mx-16 xl:mx-24 relative'>
       
        <div className='text-center mt-20 mb-10'>
          <div className=' inline-flex items-center gap-4 justify-center px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm'>
            <p>New AI Features Integrated</p>
            <img src={assets.star_icon} alt="new feature" className='w-3' />
          </div>
          <h1 className='text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700'>Your Own <span className='text-primary'>Blogging</span> 
            <br/>Platform 
          </h1>
          <p className='text-gray-600 text-sm sm:text-lg my-5 sm:my-8 max-w-2xl mx-auto'>
            This is your space to think out loud, to share what matters, and to write without filters. Whether it's one word or a thousand, your story starts right here.
          </p>

          <form onSubmit={onSubmitHandler} className='flex justify-center gap-2' role="search">
            <input 
              type="text" 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder='Search for blogs' 
              aria-label="Search blogs"
              className='border border-gray-300 rounded-full px-5 py-2 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 focus:outline-none focus:ring-2 focus:ring-primary/50'
            />
            <button 
              type='submit' 
              className='bg-primary text-white px-5 py-2 rounded-full hover:bg-[#5044E5]/80 transition-all duration-300 cursor-pointer whitespace-nowrap'
            >
              Search
            </button>
          </form>
          
          {(input || searchValue) && (
            <div className='text-center mt-5'>
              <button 
                onClick={onClear} 
                className='bg-white text-primary px-5 py-2 rounded-full hover:bg-gray-100 transition-all duration-300 cursor-pointer border border-primary/20'
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
  <img src={assets.gradientBackground} alt="" className='absolute top-1/2 right-0 z-0 opacity-50 pointer-events-none'/>
       
    </div>
  )
}

export default Header
