import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
const Login = () => {



    const {axios ,setToken}=useAppContext();

    const [email , setEmail]=useState('');
    const [password , setPassword]=useState('');


    const handleSubmit= async(e)=>{
        e.preventDefault();
        try {
           const {data}=await axios.post('/api/admin/login',{email,password});
            if(data.success){
                setToken(data.token);
                localStorage.setItem('token',data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
               
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error( error.message);
        }
    }
  return (
    <div className='flex justify-center items-center h-screen'>
       <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/20 rounded-lg shadow-xl shadow-primary/10'>
        <div className='flex flex-col items-center justify-center'> 
             <div className='w-full py-6 text-center'>
              <h1 className='text-3xl font-bold'> <span className='text-primary'>Admin</span> Login</h1>
              <p className='text-sm text-gray-500'>Enter your credentials to Access your account</p>
             </div>
             <form onSubmit={handleSubmit}   action="">
              <div className='space-y-4'>
                <label htmlFor="">Email</label>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} className='w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary' type="email" required placeholder=' Enter Email' />

              <div/>
              <div>
                <label htmlFor="" required>Password</label>
                <input value={password} onChange={(e)=>setPassword(e.target.value)} className='w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary' type="password" required placeholder='Enter Password' />
              </div>
               
                <button className='w-full py-2 mt-4 bg-primary text-white rounded-lg hover:bg-primary/80 transition-all duration-300 cursor-pointer' type='submit'>Login</button>
              </div>
             </form>
        </div>
       </div>
    </div>
  )
}

export default Login
