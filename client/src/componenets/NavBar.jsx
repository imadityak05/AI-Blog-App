import React from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const { token, setToken } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    navigate('/');
  };

  return (
    <div className='flex justify-between items-center py-5 mx-8 sm:mx-20 md:mx-28 lg:mx-32 xl:mx-40'>
      <img 
        onClick={() => navigate("/")}
        src={assets.logo} 
        alt="Logo"  
        className='w-32 sm:w-44 cursor-pointer'
      />
      
      <div className='flex items-center gap-4'>
        {token ? (
          <>
            <button 
              onClick={() => navigate("/admin")}
              className='flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full hover:bg-[#5044E5]/80 transition-all duration-300'
            >
              Dashboard
              <img src={assets.arrow} alt="" className='w-3'/>
            </button>
            <button 
              onClick={handleLogout}
              className='bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full transition-all duration-300'
            >
              Logout
            </button>
          </>
        ) : (
          <button 
            onClick={() => navigate("/admin")}
            className='flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full hover:bg-[#5044E5]/80 transition-all duration-300'
          >
            Login
            <img src={assets.arrow} alt="" className='w-3'/>
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
