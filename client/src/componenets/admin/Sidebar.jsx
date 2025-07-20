import React from 'react'
import { NavLink } from 'react-router-dom'
import {assets} from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {

  const navigate = useNavigate();

  const logout = () => {
    navigate('/');
  };
  return (
    <div className='flex flex-col h-screen border-r border-gray-200 min-h-full pt-6'>
      <NavLink
        end={true}
        to="/admin"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer transition-all duration-300 hover:bg-primary/10 ${
            isActive ? 'bg-primary/10 border-r-4 border-primary' : ''
          }`
        }
      >
        <img src={assets.home_icon} alt="dashboard icon" className="min-w-4 w-5" />
        <p className="hidden sm:inline-block">Dashboard</p>
      </NavLink>
     
     {/*addBlog*/}
     <NavLink
     to="/admin/addBlog"
     className={({ isActive }) =>
       `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer transition-all duration-300 hover:bg-primary/10 ${
         isActive ? 'bg-primary/10 border-r-4 border-primary' : ''
       }`
     }
   >
     <img src={assets.add_icon} alt="add blog icon" className="min-w-4 w-5" />
     <p className="hidden sm:inline-block">Add Blog</p>
   </NavLink>

   {/*listBlog*/}
   <NavLink
     to="/admin/listBlog"
     className={({ isActive }) =>
       `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer transition-all duration-300 hover:bg-primary/10 ${
         isActive ? 'bg-primary/10 border-r-4 border-primary' : ''
       }`
     }
   >
     <img src={assets.list_icon} alt="list blog icon" className="min-w-4 w-5" />
     <p className="hidden sm:inline-block">List Blog</p>
   </NavLink>

   {/*comments*/}
   <NavLink
     to="/admin/comments"
     className={({ isActive }) =>
       `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer transition-all duration-300 hover:bg-primary/10 ${
         isActive ? 'bg-primary/10 border-r-4 border-primary' : ''
       }`
     }
   >
     <img src={assets.comment_icon} alt="comments icon" className="min-w-4 w-5" />
     <p className="hidden sm:inline-block">Comments</p>
   </NavLink>
    
     {/* Bottom Section */}
     <button
        type="button"
        onClick={logout}
        className="flex mt-90 items-center justify-center text-red-500 rounded-full gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer transition-all duration-300 hover:bg-primary/10"
      >
        Logout
      </button>
    </div>
  )
}

export default Sidebar
