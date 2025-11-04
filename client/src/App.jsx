import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Layout from './pages/admin/Layout';
import ListBlog from './pages/admin/ListBlog';
import Comments from './pages/admin/Comments';
import DashBoard from './pages/admin/Dashboard';
import AddBlog from './pages/admin/AddBlog';
import Login from './componenets/admin/Login';
import Signup from './componenets/admin/Signup';
import 'quill/dist/quill.core.css';
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';

const App = () => {

  const {token}=useAppContext();

  return (
    <div>
      <Toaster />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog/:id" element={<Blog />} />
      <Route path="/admin/login" element={token ? <Navigate to="/admin" /> : <Login />} />
      <Route path="/admin/signup" element={token ? <Navigate to="/admin" /> : <Signup />} />
      <Route path="/admin" element={token ? <Layout /> : <Navigate to="/admin/login" />}>
        <Route index element ={<DashBoard />} />
        <Route path="addBlog" element={<AddBlog />} />
        <Route path="listBlog" element={<ListBlog />} />
        <Route path="comments" element={<Comments />} />
         
      </Route>
    </Routes>
    </div>
  );
};

export default App;
