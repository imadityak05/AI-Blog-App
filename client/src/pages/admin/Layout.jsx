import React from 'react';
import {assets} from '../../assets/assets';
import { Outlet} from 'react-router-dom';
import Sidebar from '../../componenets/admin/Sidebar';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
const Layout = () => {  
   

  const {axios ,setToken ,navigate}=useAppContext();
  const logout = () => {
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    setToken(null);
    navigate('/');
    window.location.reload();
    toast.success('Logged out successfully');
  };

  return (
    <>
      {/* Top Navbar */}
      <div className='flex justify-between items-center py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200'>
        <img
          src={assets.logo}
          alt="logo"
          className='w-32 sm:w-40 cursor-pointer'
          onClick={() => navigate('/')}
        />
        <button
          onClick={logout}
          className='text-sm px-8 py-2 bg-primary text-white rounded-full hover:bg-[#5044E5]/80 transition-all duration-300 cursor-pointer'
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className=' flex h-[calc(100vh-70px)]'>
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
